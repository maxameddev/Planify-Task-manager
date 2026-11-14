type AudienceIllustrationProps = {
  kind: "student" | "professional" | "team";
};

export function AudienceIllustration({ kind }: AudienceIllustrationProps) {
  return (
    <svg viewBox="0 0 480 280" role="img" aria-hidden="true" className="h-full w-full">
      {kind === "student" && (
        <>
          <rect width="480" height="280" fill="#e8f0e6" />
          <circle cx="392" cy="58" r="36" fill="#d3e2cf" />
          <path d="M0 222 120 154l84 50 114-96 162 100v72H0Z" fill="#d8e6d5" />
          <rect x="67" y="77" width="205" height="119" rx="12" fill="#fffefa" />
          <rect x="82" y="92" width="175" height="88" rx="5" fill="#edf4eb" />
          <path d="M102 116h92M102 135h126M102 154h73" stroke="#9ab49a" strokeWidth="7" strokeLinecap="round" />
          <path d="M51 198h239l-18 14H69Z" fill="#718f73" />
          <path d="M178 207c0-35 22-62 52-62s52 27 52 62v13H178Z" fill="#52755a" />
          <circle cx="230" cy="126" r="28" fill="#c98762" />
          <path d="M202 124c0-25 13-39 31-39 22 0 33 18 29 39-8-3-14-10-17-18-9 11-24 17-43 18Z" fill="#344b3c" />
          <path d="M320 190h96v13h-96z" fill="#bc9565" />
          <path d="M331 188v-50h72v50" fill="#fffefa" />
          <path d="M341 151h49M341 163h40M341 175h29" stroke="#d5dfd2" strokeWidth="5" strokeLinecap="round" />
        </>
      )}
      {kind === "professional" && (
        <>
          <rect width="480" height="280" fill="#f1e9dc" />
          <circle cx="90" cy="72" r="42" fill="#e5d7c2" />
          <path d="M0 214 140 148l94 54 119-98 127 77v99H0Z" fill="#e8ddca" />
          <rect x="285" y="49" width="132" height="102" rx="8" fill="#fffdf8" />
          <rect x="298" y="62" width="106" height="76" rx="4" fill="#e8f0e6" />
          <path d="M312 119l19-22 16 12 23-28 23 17" fill="none" stroke="#739577" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M52 199h375l-17 15H69Z" fill="#9c7955" />
          <path d="M137 190c0-42 28-70 66-70s67 28 67 70v13H137Z" fill="#395f49" />
          <circle cx="203" cy="103" r="30" fill="#d69a75" />
          <path d="M174 102c0-27 14-43 34-43 22 0 34 17 29 43-10-4-17-12-20-22-11 12-25 19-43 22Z" fill="#463b35" />
          <rect x="145" y="174" width="119" height="9" rx="4" fill="#ddd9cd" />
          <path d="m195 191 19-33 19 33Z" fill="#d9b76f" />
        </>
      )}
      {kind === "team" && (
        <>
          <rect width="480" height="280" fill="#e8edf2" />
          <circle cx="396" cy="66" r="45" fill="#d9e3ea" />
          <rect x="116" y="36" width="250" height="132" rx="12" fill="#fffefa" />
          <rect x="132" y="52" width="218" height="100" rx="6" fill="#edf2f3" />
          <path d="M151 75h65M151 92h90M151 109h55" stroke="#9aafba" strokeWidth="6" strokeLinecap="round" />
          <rect x="266" y="69" width="27" height="59" rx="6" fill="#b8cfbc" />
          <rect x="302" y="88" width="27" height="40" rx="6" fill="#d9bd84" />
          <path d="M98 172h285l-20 17H118Z" fill="#728a91" />
          <path d="M48 218c0-29 21-51 50-51s50 22 50 51v22H48Z" fill="#607e8a" />
          <circle cx="98" cy="151" r="24" fill="#c98762" />
          <path d="M73 150c1-20 11-31 27-31 16 0 26 12 25 31-13-2-23-7-30-17-5 9-12 14-22 17Z" fill="#3e4b4c" />
          <path d="M187 218c0-29 21-51 50-51s50 22 50 51v22H187Z" fill="#738e70" />
          <circle cx="237" cy="151" r="24" fill="#e0ac83" />
          <path d="M212 149c0-19 12-30 26-30 17 0 26 11 25 30-12-1-21-6-28-15-5 8-12 13-23 15Z" fill="#513f39" />
          <path d="M326 218c0-29 21-51 50-51s50 22 50 51v22H326Z" fill="#b28d65" />
          <circle cx="376" cy="151" r="24" fill="#9f654b" />
          <path d="M351 149c1-19 11-30 27-30 16 0 25 11 24 30-12-1-21-6-28-15-5 8-12 13-23 15Z" fill="#302d2b" />
        </>
      )}
    </svg>
  );
}
