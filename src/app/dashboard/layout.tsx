import type { ReactNode } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { requireLearner } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const profile = await requireLearner();
  return <AppShell profile={profile}>{children}</AppShell>;
}
