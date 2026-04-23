"use client";

import { useEffect, useState, useTransition } from "react";
import { deleteAccountAction, resetAccountAction } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types/domain";

type ThemeMode = "light" | "dark";

const THEME_KEY = "ttsy-theme";

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(THEME_KEY, theme);
}

export function SettingsPanel({ profile }: { profile: Profile }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return window.localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isResetPending, startResetTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleThemeChange = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const handleReset = () => {
    if (
      !window.confirm(
        "Reset your saved progress, class memberships, and course picks? This keeps your account but clears your data.",
      )
    ) {
      return;
    }

    setMessage(null);
    startResetTransition(async () => {
      const result = await resetAccountAction();
      setMessage(result.message);
    });
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        "Delete your account permanently? This cannot be undone.",
      )
    ) {
      return;
    }

    setMessage(null);
    startDeleteTransition(async () => {
      const result = await deleteAccountAction();
      if (result.ok) {
        window.location.href = "/";
        return;
      }

      setMessage(result.message);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm font-black uppercase tracking-wide text-slate-500">
          Theme
        </p>
        <CardTitle className="mt-3">Choose your view</CardTitle>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Switch between light and dark mode whenever you want.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            variant={theme === "light" ? "primary" : "outline"}
            onClick={() => handleThemeChange("light")}
          >
            Light mode
          </Button>
          <Button
            variant={theme === "dark" ? "secondary" : "outline"}
            onClick={() => handleThemeChange("dark")}
          >
            Dark mode
          </Button>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-black uppercase tracking-wide text-slate-500">
          Account
        </p>
        <CardTitle className="mt-3">Manage your data</CardTitle>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Signed in as {profile.email}. Reset clears saved progress and class data. Delete removes
          the whole account.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isResetPending || isDeletePending}
          >
            {isResetPending ? "Resetting..." : "Reset account data"}
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isResetPending || isDeletePending}
          >
            {isDeletePending ? "Deleting..." : "Delete account"}
          </Button>
        </div>
        {message ? (
          <p className="mt-4 rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
            {message}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
