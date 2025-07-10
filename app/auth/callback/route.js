import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createServerSupabaseClient();

    // 세션 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // 유저 정보 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // profiles 테이블에서 해당 유저가 이미 있는지 확인
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existingProfile) {
          const displayName = `유저_${user.id.slice(0, 8)}`;

          await supabase.from("profiles").insert({
            id: user.id,
            display_name: displayName,
            // created_at은 Supabase에서 DEFAULT now()로 설정되어 있으면 생략 가능
          });
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
