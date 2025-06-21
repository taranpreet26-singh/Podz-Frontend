import type { Metadata } from "next";
import {  Roboto, Ubuntu } from "next/font/google";
import "./globals.css";

const geistSans = Roboto({
  variable: "--font-roboto",
  weight:['400','700'],
  subsets: ["latin"],
});

const geistMono = Ubuntu({
  variable: "--font-ubuntu",
  weight:['400','700'],
  subsets: ['greek'],
});

export const metadata: Metadata = {
  title: "Podz",
  description: "1:1 Video Calling Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
