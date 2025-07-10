"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";

function handleError(error) {
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

export const fetchArticlesImages = async (id) => {
  console.log("asdf");
  const supabase = await createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("articles")
    .select("images")
    .eq("id", id)
    .single();

  handleError(error);

  if (error) throw error;

  return data.images || [];
};

export const updateArticlesImages = async (id, imageUrls) => {
  const supabase = await createBrowserSupabaseClient();

  const { error } = await supabase
    .from("articles")
    .update({ images: imageUrls })
    .eq("id", id);

  if (error) throw error;
};

const toIsoData = (dateString) => {
  const date = new Date(dateString);
  // 현재 시간을 사용하여 날짜와 시간 정보를 포함
  date.setHours(
    new Date().getHours(),
    new Date().getMinutes(),
    new Date().getSeconds()
  );
  return date.toISOString();
};

export const insertArticle = async ({
  title,
  subtitle,
  author,
  createdAt,
  content,
  isHeadline,
  isPublished,
  selectedCategory,
  isEditorPick,
  isBreakingNews,
}) => {
  const supabase = await createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from("articles")
    .insert({
      title,
      subtitle,
      author,
      ...(createdAt && { created_at: toIsoData(createdAt) }),
      content,
      is_headline: isHeadline,
      is_published: isPublished,
      thumbnail_text: content.slice(
        0,
        Math.floor(Math.random() * (125 - 75 + 1)) + 70
      ),
      category_id: selectedCategory,
      is_editor_pick: isEditorPick,
      is_breaking_news: isBreakingNews,
    })
    .select("id");

  handleError(error);

  return data[0].id;
};

export const updateArticle = async ({
  id,
  title,
  subtitle,
  author,
  createdAt,
  content,
  isHeadline,
  isPublished,
  selectedCategory,
  isBreakingNews,
  isEditorPick,
}) => {
  const supabase = await createBrowserSupabaseClient();

  const { error } = await supabase
    .from("articles")
    .update({
      title,
      subtitle,
      author,
      created_at: toIsoData(createdAt),
      content,
      is_headline: isHeadline,
      is_published: isPublished,
      thumbnail_text: content.slice(
        0,
        Math.floor(Math.random() * (125 - 75 + 1)) + 70
      ),
      category_id: selectedCategory,
      is_editor_pick: isEditorPick,
      is_breaking_news: isBreakingNews,
    })
    .eq("id", id);

  handleError(error);
};

export const fetchArticle = async (id) => {
  const supabase = await createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  handleError(error);

  return data;
};
export const deleteArticle = async (id) => {
  const supabase = await createBrowserSupabaseClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);

  handleError(error);
};
