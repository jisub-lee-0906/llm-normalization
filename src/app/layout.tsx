import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "AI 답변 정리기",
    template: "%s | AI 답변 정리기",
  },
  description:
    "ChatGPT, Gemini, Perplexity, Claude에서 복사한 텍스트를 붙여넣으면 citation, 링크 꼬리, 마크다운 잔재를 정리해 바로 쓸 수 있는 plain text로 바꿉니다.",
  applicationName: "AI 답변 정리기",
  keywords: [
    "AI text cleaner",
    "LLM normalization",
    "ChatGPT copy paste cleanup",
    "Gemini cleanup",
    "Perplexity cleanup",
    "plain text formatter",
  ],
  category: "productivity",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "AI 답변 정리기",
    description:
      "AI 출력물을 붙여넣으면 citation, 링크 꼬리, 마크다운 잔재를 자동으로 정리해 plain text로 바꿉니다.",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AI 답변 정리기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 답변 정리기",
    description:
      "AI 출력물을 붙여넣으면 citation, 링크 꼬리, 마크다운 잔재를 자동으로 정리해 plain text로 바꿉니다.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
