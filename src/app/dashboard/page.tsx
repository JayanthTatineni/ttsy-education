import { EducatorDashboard } from "@/components/dashboard/educator-dashboard";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { requireLearner } from "@/lib/auth/session";
import {
  getEducatorDashboardData,
  getStudentDashboardData,
} from "@/lib/services/dashboard";

export default async function DashboardPage() {
  const profile = await requireLearner();

  if (profile.role === "educator") {
    const data = await getEducatorDashboardData(profile.id);
    return <EducatorDashboard profile={profile} data={data} />;
  }

  const data = await getStudentDashboardData(profile.id, profile.grade_level);
  return <StudentDashboard profile={profile} data={data} />;
}
