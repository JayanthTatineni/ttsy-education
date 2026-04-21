import { CompactClassList } from "@/components/dashboard/compact-class-list";
import { CourseHomeList } from "@/components/dashboard/course-home-list";
import { StatCard } from "@/components/dashboard/stat-card";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { gradeLabel } from "@/lib/constants";
import { getStudentDashboardData } from "@/lib/services/dashboard";
import type { Profile } from "@/types/domain";

type StudentDashboardData = Awaited<ReturnType<typeof getStudentDashboardData>>;

export function StudentDashboard({
  profile,
  data,
}: {
  profile: Profile;
  data: StudentDashboardData;
}) {
  const firstName = profile.full_name.split(" ")[0] || "learner";
  const selectedCount = data.selectedCourses.length;
  const currentGradeLabel = profile.grade_level ? gradeLabel(profile.grade_level) : "Not set";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Student home"
        title="My courses"
        actions={
          <>
            <ButtonLink href="/dashboard/courses" variant="secondary">
              Edit courses
            </ButtonLink>
            <ButtonLink href="/dashboard/progress" variant="outline">
              Progress
            </ButtonLink>
          </>
        }
      >
        {`Welcome back, ${firstName}. Choose the courses you want on your home screen, then keep moving lesson by lesson.`}
      </PageHeader>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current grade"
          value={currentGradeLabel}
          helper="Your current grade is still used for suggested paths."
        />
        <StatCard
          label="My courses"
          value={selectedCount}
          helper="Courses you pinned to your dashboard."
        />
        <StatCard
          label="Completed lessons"
          value={data.stats.completedLessons}
          helper="Lessons finished at 80% or higher."
        />
        <StatCard
          label="Average mastery"
          value={`${data.stats.averageBestScore}%`}
          helper="Your average best score across saved lessons."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_290px]">
        <div className="space-y-6">
          <CourseHomeList
            title={selectedCount > 0 ? "Chosen courses" : "Suggested courses"}
            description={
              selectedCount > 0
                ? "These are the courses you picked for your home screen."
                : "You have not pinned any courses yet, so we are showing the suggested courses for your current grade."
            }
            courses={data.homeCourses}
            emptyMessage="Open Edit courses to add courses from any grade or subject."
          />

          {data.featuredCourse ? (
            <Card>
              <p className="text-sm font-black uppercase tracking-wide text-emerald-700">
                Continue learning
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                {data.featuredCourse.unit.title}
              </h2>
              <p className="mt-2 text-base leading-7 text-slate-600">
                {data.featuredCourse.unit.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink
                  href={`/learn/${data.featuredCourse.unit.grade_level.toLowerCase()}/courses/${data.featuredCourse.slug}`}
                >
                  Open course
                </ButtonLink>
                <ButtonLink href="/dashboard/courses" variant="outline">
                  Choose more courses
                </ButtonLink>
              </div>
            </Card>
          ) : null}
        </div>

        <div className="space-y-5">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                  Teachers
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">Classes</h2>
              </div>
              <ButtonLink href="/dashboard/classes" variant="ghost" className="px-0">
                Open
              </ButtonLink>
            </div>
            <div className="mt-4">
              <CompactClassList classes={data.classes} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
