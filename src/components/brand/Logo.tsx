import { cn } from "@/lib/utils";

const LEAF_L =
  "M47 36 C40 29 31 26 21 27.4 C19.4 27.6 18.5 28.8 18.5 30.3 L18.5 67 C18.5 68.6 19.6 69.7 21 69.6 C31 68.9 40 71.4 47 77.6 Z";
const LEAF_R =
  "M53 36 C60 29 69 26 79 27.4 C80.6 27.6 81.5 28.8 81.5 30.3 L81.5 67 C81.5 68.6 80.4 69.7 79 69.6 C69 68.9 60 71.4 53 77.6 Z";

const LEFT_LINES: [number, number, number][] = [
  [25, 41, 16],
  [25, 50, 12],
  [25, 59, 14],
];

const RIGHT_LINES: [number, number, number][] = [
  [59, 41, 15],
  [59, 50, 9],
  [71, 50, 5],
  [59, 59, 13],
];

function TextLines() {
  return (
    <g fill="#2a1f6b">
      {LEFT_LINES.map(([x, y, w]) => (
        <rect key={`l${x}-${y}`} x={x} y={y} width={w} height={5} rx={2.5} opacity={0.32} />
      ))}
      {RIGHT_LINES.map(([x, y, w]) => (
        <rect key={`r${x}-${y}`} x={x} y={y} width={w} height={5} rx={2.5} opacity={0.45} />
      ))}
    </g>
  );
}

function Book({
  left,
  right,
  lines,
}: {
  left: string;
  right: string;
  lines?: boolean;
}) {
  return (
    <>
      <path d={LEAF_L} fill={left} />
      <path d={LEAF_R} fill={right} />
      {lines && <TextLines />}
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
      <Book left="#ffffff" right="#f5b235" lines />
    </svg>
  );
}

export function LogoGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("h-8 w-8", className)} aria-hidden>
      <Book left="currentColor" right="#ee9b1a" />
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
