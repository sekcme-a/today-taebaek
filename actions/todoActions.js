"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

function handleError(error) {
  console.error("Error:", error);
  throw new Error(error.message);
}

export async function getTodos({ searchInput = "" }) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .ilike("title", `%${searchInput}%`)
    .order("created_at", { ascending: false });

  if (error) {
    handleError(error);
  }
  return data;
}

export async function createTodo(todo) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("todos").insert(todo);

  if (error) {
    handleError(error);
  }
  return data;
}
