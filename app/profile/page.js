"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Profile = () => {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const handleLogout = async () => {
    console.log("asdf");
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <div>
      <p onClick={handleLogout}>로그아웃</p>
    </div>
  );
};

export default Profile;
