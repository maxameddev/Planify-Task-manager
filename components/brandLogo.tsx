type BrandLogoProps = {
  size?: "sm" | "md";
  inverse?: boolean;
};

export function BrandLogo({ size = "md", inverse = false }: BrandLogoProps) {
  const isSmall = size === "sm";

  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Planify">
      <span
        aria-hidden="true"
        className={`grid shrink-0 place-items-center ${isSmall ? "size-8 rounded-xl" : "size-10 rounded-2xl"} ${inverse ? "bg-white text-[#173f2b]" : "bg-[#173f2b] text-white"}`}
      >
        <svg viewBox="0 0 40 40" className={isSmall ? "size-5" : "size-6"} fill="none">
          <path d="M13 6.75h8l6.25 6.25v15.5a2.5 2.5 0 0 1-2.5 2.5h-12a2.5 2.5 0 0 1-2.5-2.5V9.25a2.5 2.5 0 0 1 2.5-2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M21 7v5a1 1 0 0 0 1 1h5M13.75 19l2.75 2.75 4.75-5.25M22.75 19h2.5M13.75 26h11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={`font-semibold tracking-[-0.04em] ${isSmall ? "text-base" : "text-xl"} ${inverse ? "text-white" : ""}`}>Planify</span>
    </span>
  );
}
