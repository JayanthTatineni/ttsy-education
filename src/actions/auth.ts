"use server";

import { redirect } from "next/navigation";
import { hasSupabaseEnv, missingSupabaseMessage } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema, type LoginValues, type SignupValues } from "@/lib/validation/auth";

export type ActionState = {
  ok: boolean;
  message: string;
  shouldRedirect?: boolean;
};

export async function loginAction(values: LoginValues): Promise<ActionState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: missingSupabaseMessage, shouldRedirect: false };
  }

  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check your login.",
      shouldRedirect: false,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, message: error.message, shouldRedirect: false };
  }

  return { ok: true, message: "Welcome back.", shouldRedirect: true };
}

export async function signupAction(values: SignupValues): Promise<ActionState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: missingSupabaseMessage, shouldRedirect: false };
  }

  const parsed = signupSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check your signup.",
      shouldRedirect: false,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        grade_level: parsed.data.role === "student" ? parsed.data.gradeLevel : null,
        role: parsed.data.role,
      },
    },
  });

  if (error) {
    return { ok: false, message: error.message, shouldRedirect: false };
  }

  return {
    ok: true,
    message: data.session
      ? parsed.data.role === "educator"
        ? "Your classroom space is ready."
        : "Your learning space is ready."
      : "Check your email to finish signing up, then come back to log in.",
    shouldRedirect: Boolean(data.session),
  };
}

export async function logoutAction() {
  if (!hasSupabaseEnv()) {
    redirect("/");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
