import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryClientProvider from "@/config/ReactQueryClientProvider";
// import { ThemeProvider } from "@/config/material-tailwind-theme-provider";
import metadata from "./metadata";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ThemeProvider from "./themeProvider";

const inter = Inter({ subsets: ["latin"] });

export { metadata };

const theme = {
  input: {
    defaultProps: {
      color: "white",
      // className: "text-black placeholder:text-gray-400",
    },
  },
  button: {
    defaultProps: {
      color: "green",
    },
  },
  textarea: {
    defaultProps: {
      color: "white", // 색상을 white로 설정
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <meta
          name="google-site-verification"
          content="Tkt6-uvPtVRMzLJvNbtD_ChtLE1u1kZqiwQ6Y0yxdBg"
        />
        <meta
          name="naver-site-verification"
          content="90f934a8b0698cd8da2045fcb99ca96454b8573f"
        />
      </head>
      <body
        className={[
          `${inter.className} bg-[#343541] text-white vsc-initialized`,
        ]}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider>
            <ReactQueryClientProvider>
              {children}
              {/* <ThemeProvider value={theme}>{children}</ThemeProvider> */}
            </ReactQueryClientProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
