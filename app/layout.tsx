import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI News Rewrite Tool",
  description: "Transform trending news into WeChat Official Account articles using AI",
  keywords: ["news", "AI", "rewrite", "WeChat"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}
