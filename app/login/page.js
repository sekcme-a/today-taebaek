import Header from "@/components/Header";
import Link from "next/link";
import KakaoButton from "./components/KakaoButton";
import GoogleButton from "./components/GoogleButton";

export const metadata = () => {
  return {
    title: "로그인",
    description:
      "투데이태백에 로그인해서 댓글, 북마크 등 여러 기능을 만나보세요.",
    openGraph: {
      title: "로그인",
      description:
        "투데이태백에 로그인해서 댓글, 북마크 등 여러 기능을 만나보세요.",
    },
    twitter: {
      title: "로그인",
      description:
        "투데이태백에 로그인해서 댓글, 북마크 등 여러 기능을 만나보세요.",
    },
  };
};

const Login = () => {
  return (
    <main className="lg:mx-[5%]">
      <Header hasH1 />

      <div className="flex justify-center mt-20 flex-wrap">
        <h2 className="text-3xl font-bold w-full text-center">로그인</h2>
        <p className="mt-5 w-full text-center">
          소셜로그인으로 간편하게 로그인하세요!
        </p>

        <div className="w-full flex justify-center">
          <KakaoButton />
        </div>
        <GoogleButton />
      </div>
    </main>
  );
};

export default Login;
