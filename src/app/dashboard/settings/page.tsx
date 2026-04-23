import { SettingsPanel } from "@/components/settings/settings-panel";
import { PageHeader } from "@/components/ui/page-header";
import { requireLearner } from "@/lib/auth/session";

export default async function SettingsPage() {
  const profile = await requireLearner();

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Settings" title="Preferences and account">
        Switch your theme and manage the data attached to your account.
      </PageHeader>
      <SettingsPanel profile={profile} />
    </div>
  );
}
