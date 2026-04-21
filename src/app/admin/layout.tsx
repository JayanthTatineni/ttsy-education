import type { ReactNode } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await requireAdmin();
  return <AppShell profile={profile}>{children}</AppShell>;
}
