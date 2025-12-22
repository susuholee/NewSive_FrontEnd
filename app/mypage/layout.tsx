"use client";

import Protected from "../../shared/components/Protected";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Protected>{children}</Protected>;
}
