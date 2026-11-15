"use client";

import { useState } from "react";
import Image from "next/image";

type ProfileAvatarProps = { image?: string | null; name?: string | null; email?: string | null; className?: string };

export function ProfileAvatar({ image, name, email, className = "" }: ProfileAvatarProps) {
  const [failed, setFailed] = useState(false);
  const initial = (name?.trim() || email?.trim() || "P").slice(0, 1).toLocaleUpperCase();
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#e8f0e7] text-xs font-bold text-[#285c38] dark:bg-[#2b3d2f] dark:text-[#c2ddc6] ${className}`}>
      {image && !failed ? <Image src={image} alt="" width={80} height={80} unoptimized className="size-full object-cover" onError={() => setFailed(true)} /> : initial}
    </span>
  );
}
