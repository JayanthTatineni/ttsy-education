import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Profile } from "@/types/domain";

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

  if (error || !data) {
    return null;
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
