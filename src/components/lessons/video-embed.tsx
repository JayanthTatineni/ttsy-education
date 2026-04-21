"use client";

import { PlayCircle, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { getYouTubeEmbedUrl } from "@/lib/utils";

function getYouTubeWatchUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/watch?v=${id}` : url;
    }

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/watch?v=${id}` : url;
    }

    return url;
  } catch {
    return url;
  }
}

function getYouTubeThumbnail(url: string) {
  try {
    const parsed = new URL(url);
    let id = "";

    if (parsed.hostname.includes("youtube.com")) {
      id = parsed.searchParams.get("v") ?? "";
    } else if (parsed.hostname === "youtu.be") {
      id = parsed.pathname.replace("/", "");
    }

    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
}

export function VideoEmbed({ title, url }: { title: string; url: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(url), [url]);
  const watchUrl = useMemo(() => getYouTubeWatchUrl(url), [url]);
  const thumbnail = useMemo(() => getYouTubeThumbnail(url), [url]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-sm">
      {isPlaying ? (
        <iframe
          title={title}
          src={embedUrl}
          className="aspect-video w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="group relative block aspect-video w-full overflow-hidden text-left"
          onClick={() => setIsPlaying(true)}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt=""
              className="h-full w-full object-cover opacity-70 transition group-hover:scale-[1.02] group-hover:opacity-60"
            />
          ) : (
            <div className="h-full w-full bg-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="text-sm font-black uppercase tracking-wide text-emerald-300">
              Lesson video
            </p>
            <h3 className="mt-2 text-3xl font-black tracking-tight">{title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
              Tap play when your student is ready. The video stays paused until they
              choose to start it.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-base font-black text-slate-950">
                <PlayCircle className="mr-2 h-5 w-5 text-emerald-600" />
                Play video
              </span>
              <a
                href={watchUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg border border-white/40 px-4 py-2 text-sm font-black text-white"
                onClick={(event) => event.stopPropagation()}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in YouTube
              </a>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
