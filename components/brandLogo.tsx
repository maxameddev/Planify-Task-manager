type BrandLogoProps = {
  size?: "sm" | "md";
  inverse?: boolean;
};

export function BrandMark({ className = "", inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 32" fill="none" className={className}>
      <path d="M5 25.5 11.5 16" stroke="#a4c99d" strokeWidth="7" strokeLinecap="round" />
      <path d="M17 25.5 26 12" stroke="#69a973" strokeWidth="7" strokeLinecap="round" />
      <path d="m29 22 4 3.5L43 8" stroke={inverse ? "#ffffff" : "currentColor"} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BrandLogo({ size = "md", inverse = false }: BrandLogoProps) {
  const isSmall = size === "sm";
  return (
    <span className={`inline-flex items-center gap-1.5 ${inverse ? "text-white" : "text-[#173f2b] dark:text-[#e2eee4]"}`} aria-label="Planify">
      <BrandMark inverse={inverse} className={isSmall ? "h-6 w-9 shrink-0" : "h-8 w-12 shrink-0"} />
      <span className={`font-semibold tracking-[-0.04em] ${isSmall ? "text-base" : "text-xl"}`}>Planify</span>
    </span>
  );
}
