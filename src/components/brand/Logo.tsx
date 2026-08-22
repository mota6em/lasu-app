import { cn } from "@/lib/utils";

const L_PATH = "M31.5 25 L31.5 65.5 A6.5 6.5 0 0 0 38 72 L68.5 72";

function Glyph({ stroke, dot }: { stroke: string; dot: string }) {
  return (
    <>
      <path
        d={L_PATH}
        fill="none"
        stroke={stroke}
        strokeWidth={18.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={59.25} cy={39} r={9.25} fill={dot} />
    </>
  );
}

export function LogoMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  const gradientId = "lasu-mark-gradient";

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("h-9 w-9", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#6d57e0" />
          <stop offset="1" stopColor="#241a63" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill={`url(#${gradientId})`} />
      <Glyph stroke="#ffffff" dot="#f5b235" />
    </svg>
  );
}

export function LogoGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("h-8 w-8", className)} aria-hidden>
      <Glyph stroke="currentColor" dot="#ee9b1a" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className="brandmark inline-block leading-none">
      <span
        className={cn(
          "font-display text-2xl font-bold tracking-[-0.03em]",
          className,
        )}
      >
        LaSu
      </span>
    </span>
  );
}

export default function Logo({
  className,
  markClassName,
  wordClassName,
  tagline,
  showWordmark = true,
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  tagline?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} title="LaSu" />
      {showWordmark && (
        <span className="flex flex-col justify-center">
          <Wordmark className={wordClassName} />
          {tagline && (
            <span className="mt-1 text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-muted-foreground">
              {tagline}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
