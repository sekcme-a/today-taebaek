"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProfileButton = () => {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const onProfileClick = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (session?.session) router.push("/profile");
    else router.push("/login");
  };

  return (
    // <Link
    //   href={session?.session ? "/profile" : "/login"}
    //   aria-label="프로필로 이동"
    // >
    <div className="pl-3 pr-3 cursor-pointer" onClick={onProfileClick}>
      <i className="fa-solid fa-user"></i>
    </div>
    // </Link>
  );
};

export default ProfileButton;
