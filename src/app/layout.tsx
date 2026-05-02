import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home Gas Plan Comparator",
  description:
    "Compare Australian residential gas plans for Wollongong NSW and find the best deal for your usage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
