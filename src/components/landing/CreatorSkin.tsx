"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const AVYRA_BODY = "https://avyra-skin-api.vercel.app/api/body";

function bodyUrl(username: string) {
  const params = new URLSearchParams({
    pose: "wave",
    size: "512",
    quality: "ultra",
    format: "png",
  });
  return `${AVYRA_BODY}/${encodeURIComponent(username)}?${params}`;
}

type CreatorSkinProps = {
  username: string;
  name: string;
  className?: string;
};

export function CreatorSkin({ username, name, className }: CreatorSkinProps) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative", className)}>
      {failed ? (
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-6xl font-black text-[rgba(255,255,255,0.10)]">{name.charAt(0)}</span>
        </div>
      ) : (
        <Image
          src={bodyUrl(username)}
          alt={t("creators.skinAlt", { name })}
          fill
          unoptimized
          sizes="(max-width: 640px) 80vw, 300px"
          className="object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.45)]"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
