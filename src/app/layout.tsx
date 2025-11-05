import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Baatcheet",
  description: "Chat app frontend",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
