// app/api/crawl/route.js
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

function parseDateFromText(text) {
  const match = text.match(/작성일\s+(\d{4}-\d{2}-\d{2})/);
  return match ? new Date(match[1]) : null;
}

function isWithinRange(date, start, end) {
  return date >= start && date <= end;
}

function extractViewUrlFromOnClick(onClick) {
  // 예: "goTo.view('list','173977','82','0100000000'); return false;"
  const match = onClick.match(
    /goTo\.view\('list','(\d+)',\s*'(\d+)',\s*'(\d+)'\)/
  );

  if (!match) return null;

  const [_, bIdx, ptIdx, mId] = match;
  console.log(mId, bIdx, ptIdx);
  return `https://www.siheung.go.kr/media/bbs/view.do?mId=${mId}&bIdx=${bIdx}&ptIdx=${ptIdx}`;
}

async function crawlViewPage(viewUrl) {
  try {
    const res = await axios.get(viewUrl);
    const $ = cheerio.load(res.data);

    const title = $("div.bod_view h4").text().trim();

    // ✅ <br>을 \n으로 바꾼 후 텍스트 추출
    const mT10 = $("div.view_cont .mT10").first();

    // <br> -> '\n' 로 변환
    mT10.find("br").replaceWith("\n");

    const content = mT10.text().trim();

    // ✅ 이미지 추출
    const images = [];
    $("div.view_cont img").each((_, img) => {
      const src = $(img).attr("src");
      if (src) {
        images.push(new URL(src, viewUrl).href);
      }
    });

    return { title, content, images, url: viewUrl };
  } catch (err) {
    console.error(`상세 페이지 크롤링 실패: ${viewUrl}`, err);
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const startDateStr = searchParams.get("start");
  const endDateStr = searchParams.get("end");

  if (!startDateStr || !endDateStr) {
    return NextResponse.json(
      { error: "start, end 날짜 쿼리 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const maxCount = 100;
  let currentPage = 1;
  let collected = [];

  try {
    while (collected.length < maxCount) {
      const url = `https://www.siheung.go.kr/media/bbs/list.do?ptIdx=82&mId=0100000000&page=${currentPage}`;
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);

      const items = $("div.bod_blog ul li");

      if (items.length === 0) break;

      let addedThisPage = 0;

      for (const el of items.toArray()) {
        if (collected.length >= maxCount) break;

        const a = $(el).find("a");
        const rawText = a.text().trim();
        const onClick = a.attr("onclick");

        const html = a.html()?.replace(/<br\s*\/?>/gi, "\n") || "";
        const decodedText = $("<div>").html(html).text().trim();
        const fullText = `[${rawText}]\n\n${decodedText}`;
        const createdAt = parseDateFromText(fullText);

        if (!createdAt || !isWithinRange(createdAt, startDate, endDate))
          continue;

        console.log(onClick);
        const viewUrl = extractViewUrlFromOnClick(onClick);
        if (!viewUrl) continue;
        console.log(viewUrl);
        const detail = await crawlViewPage(viewUrl);
        if (detail) {
          collected.push(detail);
          addedThisPage++;
        }
      }
      if (addedThisPage === 0 && collected.length !== 0) break;
      currentPage++;
    }

    return NextResponse.json({ posts: collected });
  } catch (err) {
    console.error("크롤링 중 오류:", err);
    return NextResponse.json({ error: "크롤링 실패" }, { status: 500 });
  }
}
