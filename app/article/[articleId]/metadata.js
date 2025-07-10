import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function generateMetadata({ params }) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("articles")
    .select("title, content, images")
    .eq("id", params.articleId)
    .single();

  if (!data)
    return { title: "기사 없음", description: "존재하지 않는 기사입니다." };

  return {
    title: data.title,
    description: `${data.title} ${data.content}`.slice(0, 100),
    openGraph: {
      title: data.title,
      description: `${data.title} ${data.content}`.slice(0, 100),
      images: data.images[0] ? [data.images[0]] : [],
    },
    twitter: {
      title: data.title,
      description: `${data.title} ${data.content}`.slice(0, 100),
      images: data.images[0] ? [data.images[0]] : [],
    },
  };
}
