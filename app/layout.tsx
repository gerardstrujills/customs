import type { Metadata } from "next";
import "./globals.css";
import { AuthRedirectHandler } from "@/components/Auth/AuthRedirectHandler";

export const metadata: Metadata = {
  title: "Multiservicios Catunta E.I.R.L.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="html__responsive" lang="en">
      <head>
        <link rel="icon" href="/santamaria.ico" />
        <link rel="stylesheet" href="/styles/channels.css" />
        <link rel="stylesheet" href="/styles/primary.css" />
        <link rel="stylesheet" href="/styles/product.css" />
        <link rel="stylesheet" href="/styles/stacks.css" />
        <link rel="stylesheet" href="/styles/theme.css" />
        <link rel="stylesheet" href="/styles/login.css" />
      </head>
      <body className="home-page unified-theme">
        <AuthRedirectHandler />
        {children}
      </body>
    </html>
  );
}
