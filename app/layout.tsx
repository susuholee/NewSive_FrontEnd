"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/shared/components/Header";
import WeatherWidget from "@/shared/components/WeatherWidget";
import { Providers } from "./provider";
import AuthInitializer from "@/shared/components/AuthInitializer";
import FriendsSidebar from "@/shared/components/friends/FriendSidebar";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();


  const IntroPage = pathname === "/";

  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-text-primary`}
      >
        <Providers>
          <AuthInitializer>
 
            {!IntroPage && <Header />}

            {IntroPage ? (
              <main className="min-h-screen">{children}</main>
            ) : (
              <div className="min-h-[calc(100vh-72px)]">
                <div className="mx-auto max-w-6xl px-4 py-6">
                  <div className="flex gap-6 items-start">
                    <main className="flex-1">{children}</main>

                    <aside className="hidden lg:block w-[280px]">
                      <div className="sticky top-20 flex flex-col gap-6">
                        <WeatherWidget />
                        <FriendsSidebar />
                      </div>
                    </aside>
                  </div>
                </div>
              </div>
            )}
          </AuthInitializer>
        </Providers>
      </body>
    </html>
  );
}
