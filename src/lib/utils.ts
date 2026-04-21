import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeCourseSlug(subjectSlug: string, unitTitle: string) {
  return `${subjectSlug}-${slugify(unitTitle)}`;
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

export function isNumericMatch(selected: string, correct: string) {
  const selectedNumber = Number(selected.trim());
  const correctNumber = Number(correct.trim());

  if (Number.isNaN(selectedNumber) || Number.isNaN(correctNumber)) {
    return normalizeAnswer(selected) === normalizeAnswer(correct);
  }

  return selectedNumber === correctNumber;
}

export function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    return url;
  } catch {
    return url;
  }
}
