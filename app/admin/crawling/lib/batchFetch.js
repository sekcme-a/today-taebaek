import axios from "axios";
import * as cheerio from "cheerio";

function parseDate(str) {
  const [yyyy, mm, dd] = str.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

export async function batchFetch({
  startDate,
  endDate,
  maxArticles = 50,
  maxPages = 15,
}) {
  let currentPage = 1;
  const articles = [];

  while (articles.length < maxArticles && currentPage <= maxPages) {
    const url = `https://www.ansan.go.kr/www/common/bbs/selectPageListBbs.do?key=274&bbs_code=B0238&currentPage=${currentPage}`;
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    const rows = $("tbody.text_center > tr");
    if (rows.length === 0) break;

    let addedThisPage = 0;

    for (let i = 0; i < rows.length && articles.length < maxArticles; i++) {
      const row = rows.eq(i);
      const tds = row.find("td");

      const number = tds.eq(0).text().trim();
      const title = tds.eq(1).find("a").text().trim();
      const onclick = tds.eq(1).find("a").attr("onclick") || "";
      const dateStr = tds.eq(4).text().trim();
      const date = parseDate(dateStr);

      if (isNaN(parseInt(number))) continue;
      if ((startDate && date < startDate) || (endDate && date > endDate))
        continue;

      const match = onclick?.match(/fnGoDetail\(\s*(\d+)\s*\)/);
      if (!match) continue;

      const seq = match[1];
      const detailUrl = `https://www.ansan.go.kr/www/common/bbs/selectBbsDetail.do?key=274&bbs_code=B0238&bbs_seq=${seq}&currentPage=${currentPage}`;

      try {
        const detailRes = await axios.get(detailUrl);
        const $$ = cheerio.load(detailRes.data);

        const subjectRow = $$("tbody.p-table--th-left tr.p-table__subject").eq(
          0
        );
        const contentRow = $$("tbody.p-table--th-left tr.p-table__subject").eq(
          2
        );

        const detailTitle = subjectRow.find("td").text().trim();
        let content = contentRow.find("td").html()?.trim() || "";
        content = content
          .replace(/<br\s*\/?>/g, "\n")
          .replace(/<[^>]+>/g, "")
          .trim();

        const files = [];
        $$(".p-attach__item a").each((_, el) => {
          const fileOnclick = $$(el).attr("onclick");
          const fileMatch = fileOnclick?.match(/fnFileDownLoad\('(.+?)'\)/);
          if (fileMatch) {
            const fileId = fileMatch[1];
            const fileUrl = `https://www.ansan.go.kr/common/file/FileDown.do?key=274&bbs_seq=${seq}&bbs_code=B0238&currentPage=${currentPage}&file_id=${fileId}`;
            files.push(fileUrl);
          }
        });

        articles.push({
          number,
          title: detailTitle,
          date: dateStr,
          content,
          attachments: files,
          url: detailUrl,
        });

        addedThisPage++;
      } catch (err) {
        console.error("상세 페이지 오류:", detailUrl, err.message);
      }
    }

    if (addedThisPage === 0 && articles.length !== 0) break;

    currentPage++;
  }

  return articles;
}
