"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { loginAction, signupAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { GRADES, PROFILE_ROLES, gradeLabel } from "@/lib/constants";
import {
  loginSchema,
  signupSchema,
  type LoginValues,
  type SignupValues,
} from "@/lib/validation/auth";

type AuthMode = "login" | "signup";

export function AuthForm({
  mode,
  supabaseReady,
}: {
  mode: AuthMode;
  supabaseReady: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "student",
      gradeLevel: "1",
    },
  });
  const signupRole = useWatch({ control: signupForm.control, name: "role" });

  const handleLogin = loginForm.handleSubmit((values) => {
    setMessage(null);
    startTransition(async () => {
      const result = await loginAction(values);
      setMessage(result.message);
      if (result.ok && result.shouldRedirect) {
        router.push(next);
        router.refresh();
      }
    });
  });

  const handleSignup = signupForm.handleSubmit((values) => {
    setMessage(null);
    startTransition(async () => {
      const result = await signupAction(values);
      setMessage(result.message);
      if (result.ok && result.shouldRedirect) {
        router.push("/dashboard");
        router.refresh();
      }
    });
  });

  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">
          {isLogin ? "Welcome back" : "Start learning"}
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          {isLogin ? "Log in" : "Create your account"}
        </h1>
        <p className="mt-2 text-base leading-7 text-slate-600">
          {isLogin
            ? "Pick up right where you left off."
            : "Choose student or educator, then jump into learning or classroom tools."}
        </p>
      </div>

      <form onSubmit={isLogin ? handleLogin : handleSignup} className="mt-6 space-y-4">
        {!isLogin ? (
          <div>
            <label className="text-sm font-bold text-slate-700" htmlFor="fullName">
              Name
            </label>
            <input
              id="fullName"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-950 outline-none focus:border-emerald-600"
              {...signupForm.register("fullName")}
              disabled={!supabaseReady || isPending}
            />
            {signupForm.formState.errors.fullName ? (
              <p className="mt-1 text-sm font-bold text-rose-700">
                {signupForm.formState.errors.fullName.message}
              </p>
            ) : null}
          </div>
        ) : null}

        {!isLogin ? (
          <div>
            <label className="text-sm font-bold text-slate-700">
              I am signing up as
            </label>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {PROFILE_ROLES.map((role) => (
                <label
                  key={role.value}
                  className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 font-bold text-slate-800"
                >
                  <input
                    type="radio"
                    value={role.value}
                    {...signupForm.register("role")}
                    disabled={!supabaseReady || isPending}
                  />
                  <span>{role.label}</span>
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-950 outline-none focus:border-emerald-600"
            {...(isLogin ? loginForm.register("email") : signupForm.register("email"))}
            disabled={!supabaseReady || isPending}
          />
          {(isLogin
            ? loginForm.formState.errors.email
            : signupForm.formState.errors.email) ? (
            <p className="mt-1 text-sm font-bold text-rose-700">
              {isLogin
                ? loginForm.formState.errors.email?.message
                : signupForm.formState.errors.email?.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-950 outline-none focus:border-emerald-600"
            {...(isLogin
              ? loginForm.register("password")
              : signupForm.register("password"))}
            disabled={!supabaseReady || isPending}
          />
          {(isLogin
            ? loginForm.formState.errors.password
            : signupForm.formState.errors.password) ? (
            <p className="mt-1 text-sm font-bold text-rose-700">
              {isLogin
                ? loginForm.formState.errors.password?.message
                : signupForm.formState.errors.password?.message}
            </p>
          ) : null}
        </div>

        {!isLogin && signupRole === "student" ? (
          <div>
            <label className="text-sm font-bold text-slate-700" htmlFor="gradeLevel">
              Grade
            </label>
            <select
              id="gradeLevel"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-950 outline-none focus:border-emerald-600"
              {...signupForm.register("gradeLevel")}
              disabled={!supabaseReady || isPending}
            >
              {GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  {gradeLabel(grade)}
                </option>
              ))}
            </select>
            {signupForm.formState.errors.gradeLevel ? (
              <p className="mt-1 text-sm font-bold text-rose-700">
                {signupForm.formState.errors.gradeLevel.message}
              </p>
            ) : null}
          </div>
        ) : null}

        {!supabaseReady ? (
          <p className="rounded-lg bg-yellow-100 px-4 py-3 text-sm font-bold text-yellow-900">
            Add your Supabase values in <code>.env.local</code>, then run the SQL
            setup from the README.
          </p>
        ) : null}

        {message ? (
          <p className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
            {message}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={!supabaseReady || isPending}>
          {!supabaseReady
            ? "Connect Supabase first"
            : isPending
              ? "Working..."
              : isLogin
                ? "Log in"
                : signupRole === "educator"
                  ? "Create educator account"
                  : "Create student account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        {isLogin ? "New here?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-black text-sky-700 hover:text-sky-800"
        >
          {isLogin ? "Create an account" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
