"use client";

/**
 * TeamCrest — renders team crests/logos from the football-data.org API.
 * Replaces the old FlagEmoji component that used emoji flags.
 * Falls back to a styled text abbreviation if no crest URL is available.
 */

type TeamCrestProps = {
  crest: string | null;
  name: string;
  size?: number;
  className?: string;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();
}

export default function TeamCrest({
  crest,
  name,
  size = 28,
  className = "",
}: TeamCrestProps) {
  if (!crest) {
    return (
      <span
        title={name}
        className={`inline-flex items-center justify-center rounded bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        {getInitials(name)}
      </span>
    );
  }

  return (
    <img
      src={crest}
      alt={name}
      title={name}
      width={size}
      height={size}
      className={`object-contain shrink-0 ${className}`}
      style={{ display: "inline-block", verticalAlign: "middle" }}
      onError={(e) => {
        const parent = e.currentTarget.parentElement;
        if (parent) {
          const span = document.createElement("span");
          span.textContent = getInitials(name);
          span.title = name;
          span.className =
            "inline-flex items-center justify-center rounded bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400";
          span.style.width = `${size}px`;
          span.style.height = `${size}px`;
          parent.replaceChild(span, e.currentTarget);
        }
      }}
    />
  );
}
