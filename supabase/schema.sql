create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null default 'student',
  grade_level text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('student', 'educator', 'admin'));

alter table public.profiles
  drop constraint if exists profiles_grade_level_check;

alter table public.profiles
  add constraint profiles_grade_level_check
  check (grade_level in ('K', '1', '2', '3', '4', '5') or grade_level is null);

update public.profiles
set role = 'student'
where role not in ('student', 'educator', 'admin');

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique
);

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  grade_level text not null,
  title text not null,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (subject_id, grade_level, title)
);

alter table public.units
  drop constraint if exists units_grade_level_check;

alter table public.units
  add constraint units_grade_level_check
  check (grade_level in ('K', '1', '2', '3', '4', '5'));

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  grade_level text not null,
  title text not null,
  slug text not null,
  description text not null,
  video_url text not null,
  thumbnail_url text,
  estimated_minutes integer not null default 8 check (estimated_minutes > 0),
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_id, grade_level, slug)
);

alter table public.lessons
  drop constraint if exists lessons_grade_level_check;

alter table public.lessons
  add constraint lessons_grade_level_check
  check (grade_level in ('K', '1', '2', '3', '4', '5'));

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  type text not null,
  prompt text not null,
  image_url text,
  explanation text not null,
  correct_answer text not null,
  answer_options jsonb not null default '[]'::jsonb check (jsonb_typeof(answer_options) = 'array'),
  difficulty text not null default 'easy',
  skill_tag text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.questions
  drop constraint if exists questions_type_check;

alter table public.questions
  add constraint questions_type_check
  check (type in ('multiple_choice', 'true_false', 'numeric'));

alter table public.questions
  drop constraint if exists questions_difficulty_check;

alter table public.questions
  add constraint questions_difficulty_check
  check (difficulty in ('easy', 'medium', 'challenge'));

create table if not exists public.lesson_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  score integer not null check (score >= 0 and score <= 100),
  total_questions integer not null check (total_questions >= 0),
  correct_answers integer not null check (correct_answers >= 0),
  completed boolean not null default false,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  lesson_attempt_id uuid not null references public.lesson_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  selected_answer text not null,
  is_correct boolean not null,
  answered_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  best_score integer not null default 0 check (best_score >= 0 and best_score <= 100),
  last_score integer not null default 0 check (last_score >= 0 and last_score <= 100),
  completed boolean not null default false,
  times_attempted integer not null default 0 check (times_attempted >= 0),
  last_attempted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  educator_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text not null default '',
  grade_level text,
  subject_focus text,
  join_code text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.classes
  drop constraint if exists classes_grade_level_check;

alter table public.classes
  add constraint classes_grade_level_check
  check (grade_level in ('K', '1', '2', '3', '4', '5') or grade_level is null);

alter table public.classes
  drop constraint if exists classes_subject_focus_check;

alter table public.classes
  add constraint classes_subject_focus_check
  check (subject_focus in ('math', 'science') or subject_focus is null);

create table if not exists public.class_memberships (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (class_id, student_id)
);

create table if not exists public.student_course_selections (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  unit_id uuid not null references public.units(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (student_id, unit_id)
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists units_subject_grade_idx on public.units(subject_id, grade_level);
create index if not exists lessons_lookup_idx on public.lessons(grade_level, subject_id, slug);
create index if not exists lessons_published_idx on public.lessons(is_published);
create index if not exists questions_lesson_sort_idx on public.questions(lesson_id, sort_order);
create index if not exists lesson_attempts_student_idx on public.lesson_attempts(student_id, created_at desc);
create index if not exists question_attempts_student_idx on public.question_attempts(student_id, created_at desc);
create index if not exists lesson_progress_student_idx on public.lesson_progress(student_id, updated_at desc);
create index if not exists classes_educator_idx on public.classes(educator_id, created_at desc);
create index if not exists classes_join_code_idx on public.classes(join_code);
create index if not exists class_memberships_student_idx on public.class_memberships(student_id, created_at desc);
create index if not exists class_memberships_class_idx on public.class_memberships(class_id, created_at desc);
create index if not exists student_course_selections_student_idx on public.student_course_selections(student_id, created_at desc);
create index if not exists student_course_selections_unit_idx on public.student_course_selections(unit_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists lessons_updated_at on public.lessons;
create trigger lessons_updated_at
before update on public.lessons
for each row execute function public.set_updated_at();

drop trigger if exists questions_updated_at on public.questions;
create trigger questions_updated_at
before update on public.questions
for each row execute function public.set_updated_at();

drop trigger if exists lesson_progress_updated_at on public.lesson_progress;
create trigger lesson_progress_updated_at
before update on public.lesson_progress
for each row execute function public.set_updated_at();

drop trigger if exists classes_updated_at on public.classes;
create trigger classes_updated_at
before update on public.classes
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'role', 'student');

  insert into public.profiles (id, email, full_name, role, grade_level)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    case
      when requested_role in ('student', 'educator') then requested_role
      else 'student'
    end,
    nullif(new.raw_user_meta_data->>'grade_level', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    grade_level = excluded.grade_level;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.is_educator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'educator'
  );
$$;

create or replace function public.educates_student(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.classes
    join public.class_memberships
      on class_memberships.class_id = classes.id
    where classes.educator_id = auth.uid()
      and class_memberships.student_id = target_student_id
  );
$$;

create or replace function public.is_class_member(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_memberships
    where class_id = target_class_id
      and student_id = auth.uid()
  );
$$;

create or replace function public.owns_class(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.classes
    where id = target_class_id
      and educator_id = auth.uid()
  );
$$;

create or replace function public.assign_student_to_class(
  target_class_id uuid,
  target_student_email text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  target_student_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated.';
  end if;

  if not public.is_admin() and not public.owns_class(target_class_id) then
    raise exception 'You can only assign students to your own class.';
  end if;

  select id
  into target_student_id
  from public.profiles
  where lower(email) = lower(trim(target_student_email))
    and role = 'student'
  limit 1;

  if target_student_id is null then
    raise exception 'No student account was found for that email.';
  end if;

  insert into public.class_memberships (class_id, student_id)
  values (target_class_id, target_student_id)
  on conflict (class_id, student_id) do nothing;

  return true;
end;
$$;

create or replace function public.reset_own_account_data()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Not authenticated.';
  end if;

  delete from public.student_course_selections
  where student_id = current_user_id;

  delete from public.question_attempts
  where student_id = current_user_id;

  delete from public.lesson_attempts
  where student_id = current_user_id;

  delete from public.lesson_progress
  where student_id = current_user_id;

  delete from public.class_memberships
  where student_id = current_user_id;

  delete from public.classes
  where educator_id = current_user_id;

  return true;
end;
$$;

create or replace function public.delete_own_account()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Not authenticated.';
  end if;

  delete from auth.users
  where id = current_user_id;

  return true;
end;
$$;

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.units enable row level security;
alter table public.lessons enable row level security;
alter table public.questions enable row level security;
alter table public.lesson_attempts enable row level security;
alter table public.question_attempts enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.classes enable row level security;
alter table public.class_memberships enable row level security;
alter table public.student_course_selections enable row level security;

drop policy if exists "profiles read own or admin" on public.profiles;
drop policy if exists "profiles read own or class educator or admin" on public.profiles;
create policy "profiles read own or class educator or admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin() or public.educates_student(id));

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles update own or admin" on public.profiles;
create policy "profiles update own or admin"
on public.profiles for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "subjects read authenticated" on public.subjects;
create policy "subjects read authenticated"
on public.subjects for select
to authenticated
using (true);

drop policy if exists "subjects admin manage" on public.subjects;
create policy "subjects admin manage"
on public.subjects for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "units read authenticated" on public.units;
create policy "units read authenticated"
on public.units for select
to authenticated
using (true);

drop policy if exists "units admin manage" on public.units;
create policy "units admin manage"
on public.units for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "lessons read published or admin" on public.lessons;
create policy "lessons read published or admin"
on public.lessons for select
to authenticated
using (is_published or public.is_admin());

drop policy if exists "lessons admin manage" on public.lessons;
create policy "lessons admin manage"
on public.lessons for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "questions read for published lessons or admin" on public.questions;
create policy "questions read for published lessons or admin"
on public.questions for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.lessons
    where lessons.id = questions.lesson_id
      and lessons.is_published
  )
);

drop policy if exists "questions admin manage" on public.questions;
create policy "questions admin manage"
on public.questions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "lesson attempts read own or admin" on public.lesson_attempts;
drop policy if exists "lesson attempts read own class educator or admin" on public.lesson_attempts;
create policy "lesson attempts read own class educator or admin"
on public.lesson_attempts for select
to authenticated
using (student_id = auth.uid() or public.is_admin() or public.educates_student(student_id));

drop policy if exists "lesson attempts insert own" on public.lesson_attempts;
create policy "lesson attempts insert own"
on public.lesson_attempts for insert
to authenticated
with check (student_id = auth.uid());

drop policy if exists "question attempts read own or admin" on public.question_attempts;
drop policy if exists "question attempts read own class educator or admin" on public.question_attempts;
create policy "question attempts read own class educator or admin"
on public.question_attempts for select
to authenticated
using (student_id = auth.uid() or public.is_admin() or public.educates_student(student_id));

drop policy if exists "question attempts insert own" on public.question_attempts;
create policy "question attempts insert own"
on public.question_attempts for insert
to authenticated
with check (student_id = auth.uid());

drop policy if exists "lesson progress read own or admin" on public.lesson_progress;
drop policy if exists "lesson progress read own class educator or admin" on public.lesson_progress;
create policy "lesson progress read own class educator or admin"
on public.lesson_progress for select
to authenticated
using (student_id = auth.uid() or public.is_admin() or public.educates_student(student_id));

drop policy if exists "lesson progress insert own" on public.lesson_progress;
create policy "lesson progress insert own"
on public.lesson_progress for insert
to authenticated
with check (student_id = auth.uid());

drop policy if exists "lesson progress update own" on public.lesson_progress;
create policy "lesson progress update own"
on public.lesson_progress for update
to authenticated
using (student_id = auth.uid())
with check (student_id = auth.uid());

drop policy if exists "classes read members owners or admin" on public.classes;
create policy "classes read members owners or admin"
on public.classes for select
to authenticated
using (
  public.is_admin()
  or educator_id = auth.uid()
  or public.is_class_member(id)
);

drop policy if exists "classes educator create" on public.classes;
create policy "classes educator create"
on public.classes for insert
to authenticated
with check (
  public.is_admin()
  or (educator_id = auth.uid() and public.is_educator())
);

drop policy if exists "classes educator update" on public.classes;
create policy "classes educator update"
on public.classes for update
to authenticated
using (
  public.is_admin()
  or (educator_id = auth.uid() and public.is_educator())
)
with check (
  public.is_admin()
  or (educator_id = auth.uid() and public.is_educator())
);

drop policy if exists "classes educator delete" on public.classes;
create policy "classes educator delete"
on public.classes for delete
to authenticated
using (
  public.is_admin()
  or (educator_id = auth.uid() and public.is_educator())
);

drop policy if exists "class memberships read own class or admin" on public.class_memberships;
create policy "class memberships read own class or admin"
on public.class_memberships for select
to authenticated
using (
  public.is_admin()
  or student_id = auth.uid()
  or public.owns_class(class_id)
);

drop policy if exists "class memberships insert self or educator" on public.class_memberships;
create policy "class memberships insert self or educator"
on public.class_memberships for insert
to authenticated
with check (
  public.is_admin()
  or student_id = auth.uid()
  or public.owns_class(class_id)
);

drop policy if exists "class memberships delete self or educator" on public.class_memberships;
create policy "class memberships delete self or educator"
on public.class_memberships for delete
to authenticated
using (
  public.is_admin()
  or student_id = auth.uid()
  or public.owns_class(class_id)
);

drop policy if exists "student course selections read own or admin" on public.student_course_selections;
drop policy if exists "student course selections read own class educator or admin" on public.student_course_selections;
create policy "student course selections read own class educator or admin"
on public.student_course_selections for select
to authenticated
using (
  public.is_admin()
  or student_id = auth.uid()
  or public.educates_student(student_id)
);

drop policy if exists "student course selections insert own" on public.student_course_selections;
create policy "student course selections insert own"
on public.student_course_selections for insert
to authenticated
with check (student_id = auth.uid());

drop policy if exists "student course selections delete own" on public.student_course_selections;
create policy "student course selections delete own"
on public.student_course_selections for delete
to authenticated
using (student_id = auth.uid() or public.is_admin());
