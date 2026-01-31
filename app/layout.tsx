"use client";
import { useState } from "react";
import "./globals.css";

import Header from "@/shared/components/Header";
import WeatherWidget from "@/shared/components/WeatherWidget";
import FriendsSidebar from "@/shared/components/friends/FriendSidebar";
import ToolTip from "@/shared/components/ToolTip";

import { Providers } from "./provider";
import AuthInitializer from "@/shared/components/AuthInitializer";
import { usePathname } from "next/navigation";


type HubState = "open" | "minimized";
type HubPanel = "weather" | "friends";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isIntroPage = pathname === "/";
  const isChatPage = pathname.startsWith("/chat");

  const [hubState, setHubState] = useState<HubState>("minimized");
  const [hubPanel, setHubPanel] = useState<HubPanel>("weather");

  return (
    <html lang="ko">
     <body className="antialiased min-h-screen bg-background text-text-primary font-sans">
      <Providers>
          <AuthInitializer>
            {!isIntroPage && <Header />}

            {isIntroPage ? (
              <main className="min-h-screen">{children}</main>
            ) : (
              <div className="min-h-[calc(100vh-72px)]">
                <div className="mx-auto max-w-6xl px-3 sm:px-4 py-6">
                  <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <main className="flex-1 min-w-0">
                      {children}
                    </main>

             
                    <aside className="hidden lg:block lg:w-[260px] xl:w-[280px]">
                      <div className="sticky top-20 flex flex-col gap-6">
                        <WeatherWidget />
                        <FriendsSidebar />
                      </div>
                    </aside>
                  </div>
                </div>
              </div>
            )}

    
            {!isIntroPage && (
              <div className="lg:hidden">
                <ToolTip
                  hubState={hubState}
                  panel={hubPanel}
                  passive={isChatPage} 
                  onOpen={() => setHubState("open")}
                  onClose={() => setHubState("minimized")}
                  onChangePanel={(panel) => {
                    setHubPanel(panel);
                    setHubState("open");
                  }}
                />
              </div>
            )}
          </AuthInitializer>
        </Providers>
      </body>
    </html>
  );
}
