import { ClassCreateForm } from "@/components/dashboard/class-create-form";
import { ClassCard } from "@/components/dashboard/class-card";
import { JoinClassForm } from "@/components/dashboard/join-class-form";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { requireLearner } from "@/lib/auth/session";
import { getEducatorClasses, getStudentClasses } from "@/lib/services/classroom";

export default async function ClassesPage() {
  const profile = await requireLearner();

  if (profile.role === "educator") {
    const classes = await getEducatorClasses(profile.id);

    return (
      <div className="space-y-8">
        <PageHeader eyebrow="Classrooms" title="Your classes">
          Create class spaces, share codes, and open any class to monitor growth.
        </PageHeader>
        <ClassCreateForm />
        {classes.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {classes.map((classroom) => (
              <ClassCard
                key={classroom.id}
                classroom={classroom}
                href={`/dashboard/classes/${classroom.id}`}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No classes yet"
            message="Create your first class to start inviting students."
          />
        )}
      </div>
    );
  }

  const classes = await getStudentClasses(profile.id);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Teachers" title="Your teachers and classes">
        Join a class with a code and keep your teacher connections in one place.
      </PageHeader>
      <JoinClassForm />
      {classes.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {classes.map((classroom) => (
            <ClassCard key={classroom.id} classroom={classroom} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="You have not joined a class yet"
          message="Ask your educator for a class code, then join here."
        />
      )}
    </div>
  );
}
