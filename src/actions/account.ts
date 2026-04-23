"use server";

import { revalidatePath } from "next/cache";
import { requireLearner } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export type AccountActionState = {
  ok: boolean;
  message: string;
};

export async function resetAccountAction(): Promise<AccountActionState> {
  const profile = await requireLearner();
  const supabase = await createClient();
  const { error } = await supabase.rpc("reset_own_account_data");

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/classes");
  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/progress");
  revalidatePath("/dashboard/settings");

  return {
    ok: true,
    message:
      profile.role === "educator"
        ? "Your classes and saved educator data were reset."
        : "Your saved progress, joined classes, and course picks were reset.",
  };
}

export async function deleteAccountAction(): Promise<AccountActionState> {
  await requireLearner();
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_own_account");

  if (error) {
    return { ok: false, message: error.message };
  }

  await supabase.auth.signOut();
  revalidatePath("/");

  return {
    ok: true,
    message: "Your account was deleted.",
  };
}
