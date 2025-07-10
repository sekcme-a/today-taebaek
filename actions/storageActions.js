"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";

const handleError = (error) => {
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const uploadImages = async ({ files, folder = "uploads" }) => {
  const uploaded = [];
  const supabase = await createBrowserSupabaseClient();

  for (const item of files) {
    if (!item.file) continue; // 이미 업로드된 항목일 경우 스킵

    const fileExt = item.file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}.${fileExt}`;

    console.log(fileName);

    const { data, error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
      .upload(fileName, item.file);

    handleError(error);

    const url = supabase.storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
      .getPublicUrl(fileName).data.publicUrl;
    uploaded.push({ url, name: fileName });
  }

  return uploaded;
};

const getPathFromUrl = (url) => {
  const [, path] = url.split("/storage/v1/object/public/articles/");
  return path;
};
export const deleteImages = async (urls = []) => {
  const supabase = await createBrowserSupabaseClient();
  const paths = urls.map(getPathFromUrl);
  console.log(paths);
  const { error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
    .remove(paths);

  handleError(error);
};
