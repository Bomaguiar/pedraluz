import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function SiteLayout({
  children,
  overHero = false,
}: {
  children: ReactNode;
  overHero?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader overHero={overHero} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
