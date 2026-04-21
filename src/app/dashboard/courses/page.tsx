import { CourseLibrary } from "@/components/dashboard/course-library";
import { PageHeader } from "@/components/ui/page-header";
import { requireStudent } from "@/lib/auth/session";
import { GRADES } from "@/lib/constants";
import {
  getAllCourseSummaries,
  getSelectedCourseUnitIds,
} from "@/lib/services/lessons";

export default async function StudentCoursesPage() {
  const profile = await requireStudent();
  const [courses, selectedUnitIds] = await Promise.all([
    getAllCourseSummaries(profile.id),
    getSelectedCourseUnitIds(profile.id),
  ]);

  const groups = GRADES.map((grade) => ({
    grade,
    courses: courses.filter((course) => course.unit.grade_level === grade),
  })).filter((group) => group.courses.length > 0);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Course library" title="Edit courses">
        Choose which courses show up on your home screen. You can mix courses from any grade.
      </PageHeader>
      <CourseLibrary groups={groups} initialSelectedUnitIds={selectedUnitIds} />
    </div>
  );
}
