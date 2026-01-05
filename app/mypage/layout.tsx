"use client";

import { useRequireAuth } from "@/shared/hooks/useRequireAuth";

export default function MyPageLayout({children}: {children: React.ReactNode;}) {
  useRequireAuth();
  return (
    <>{children}</>
  )
}
