import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const systemia = localFont({
  src: "../public/fonts/SystemiaVF-Regular.ttf",
  variable: "--font-systemia",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Greenely Prototypes",
  description: "Mobile-first electricity price visualization prototypes",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={`${systemia.variable} antialiased`}>
        <div className="max-w-md mx-auto bg-background min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
