import { createServerSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase?.auth?.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: member } = await supabase
    .from("members")
    .select("role")
    .eq("user_id", session.user.id)
    .single();

  if (member?.role !== "admin") {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 text-lg">⚠️ 권한이 없습니다.</p>
      </div>
    );
  }

  return (
    <main
    // className="bg-gray-100 text-black min-h-screen"
    >
      {children}
    </main>
  );
}
