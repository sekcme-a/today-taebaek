"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";

export const fetchCategories = async () => {
  const supabase = await createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });
  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
  return data;
};

export const addCategory = async (name, order) => {
  const supabase = await createBrowserSupabaseClient();
  const { error } = await supabase.from("categories").insert([{ name, order }]);
  if (error) throw error;
};

export const updateCategory = async (id, name, order) => {
  const supabase = await createBrowserSupabaseClient();
  const { error } = await supabase
    .from("categories")
    .update({ name, order })
    .eq("id", id);
  if (error) throw error;
};

export const deleteCategory = async (id) => {
  const supabase = await createBrowserSupabaseClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
};
