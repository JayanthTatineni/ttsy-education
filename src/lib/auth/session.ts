import { cache } from "react";
import { redirect } from "next/navigation";
import { parseGrade } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { GradeLevel, Profile, ProfileRole } from "@/types/domain";

function normalizeRole(value: unknown): ProfileRole {
  return value === "educator" || value === "admin" ? value : "student";
}

function normalizeGradeLevel(value: unknown, role: ProfileRole): GradeLevel | null {
  if (role !== "student" || typeof value !== "string") {
    return null;
  }

  return parseGrade(value);
}

async function ensureProfileRow(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const role = normalizeRole(user.user_metadata?.role);
  const fullName =
    typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : user.email.split("@")[0];

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email,
      full_name: fullName,
      role,
      grade_level: normalizeGradeLevel(user.user_metadata?.grade_level, role),
    })
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

export const getCurrentUser = cache(async () => {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return null;
  }

  if (!data) {
    return ensureProfileRow();
  }

  return data;
});

export async function requireProfile() {
  if (!hasSupabaseEnv()) {
    redirect("/?setup=supabase");
  }

  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

export async function requireLearner() {
  const profile = await requireProfile();

  if (profile.role === "admin") {
    redirect("/admin");
  }

  return profile;
}

export async function requireStudent() {
  const profile = await requireLearner();

  if (profile.role !== "student") {
    redirect("/dashboard");
  }

  return profile;
}

export async function requireEducator() {
  const profile = await requireLearner();

  if (profile.role !== "educator") {
    redirect("/dashboard");
  }

  return profile;
}

export async function requireAdmin() {
  const profile = await requireProfile();

  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  return profile;
}
