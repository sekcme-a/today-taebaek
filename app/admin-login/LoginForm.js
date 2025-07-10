"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

export default function LoginForm() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    // 로그인 성공 후 /admin으로 이동
    router.push("/admin");
  };

  return (
    <Card className="shadow-lg bg-black">
      <CardBody className="space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Typography variant="small" className="text-gray-700 mb-2">
              이메일
            </Typography>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              label="이메일"
            />
          </div>
          <div>
            <Typography variant="small" className="text-gray-700 mb-2">
              비밀번호
            </Typography>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              label="비밀번호"
            />
          </div>
          {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "로딩 중..." : "로그인"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
