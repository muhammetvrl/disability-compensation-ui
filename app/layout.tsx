import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "Tazminat Hesaplama",
  description: "Tazminat Hesaplama Uygulaması",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='tr'>
    <body className={clsx("font-sans antialiased", fontSans.className)}>
      <Providers>{children}</Providers>
    </body>
  </html>
  );
}
