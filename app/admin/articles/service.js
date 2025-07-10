"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";

export const fetchArticlesWithPage = async (page, filter) => {
  const PAGE_SIZE = 10;
  console.log("asdf", page);
  const supabase = await createBrowserSupabaseClient();

  let query = supabase
    .from("articles")
    .select()
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (filter === "is_headline") query = query.eq("is_headline", true);
  if (filter === "is_editor_pick") query = query.eq("is_editor_pick", true);
  if (filter === "is_breaking_news") query = query.eq("is_breaking_news", true);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
  return data;
};

export const fetchPageCount = async () => {
  const supabase = await createBrowserSupabaseClient();
  const { count } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true });
  return Math.ceil(count / 10);
};

export const publishArticle = async (postId, isPublished) => {
  const supabase = await createBrowserSupabaseClient();
  const { error } = await supabase
    .from("articles")
    .update({ is_published: !isPublished })
    .eq("id", postId);

  if (error) throw error;
};

export const updateHeadline = async (postId, isHeadline) => {
  const supabase = await createBrowserSupabaseClient();
  const { error } = await supabase
    .from("articles")
    .update({ is_headline: !isHeadline })
    .eq("id", postId);

  if (error) throw error;
};
export const updateEditorPick = async (postId, isEditorPick) => {
  const supabase = await createBrowserSupabaseClient();
  const { error } = await supabase
    .from("articles")
    .update({ is_editor_pick: !isEditorPick })
    .eq("id", postId);

  if (error) throw error;
};
export const updateBreakingNews = async (postId, isBreakingNews) => {
  const supabase = await createBrowserSupabaseClient();
  const { error } = await supabase
    .from("articles")
    .update({ is_breaking_news: !isBreakingNews })
    .eq("id", postId);

  if (error) throw error;
};
