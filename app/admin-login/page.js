import LoginForm from "./LoginForm";

export const metadata = {
  title: "관리자 로그인 | 투데이태백",
  description:
    "관리자 페이지에 로그인하세요. 안전하고 빠르게 접근할 수 있습니다.",
  robots: "index, follow",
  openGraph: {
    title: "로그인 - MyAdmin",
    description: "안전한 관리자 페이지 로그인",
    url: "https://yourdomain.com/admin-login",
    siteName: "MyAdmin",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "MyAdmin 로그인",
      },
    ],
    type: "website",
  },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">관리자 로그인</h1>
        <LoginForm />
      </div>
    </main>
  );
}
