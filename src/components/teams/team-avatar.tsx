"use client";

import Image from "next/image";
import { getTeamAvatar, type TeamAvatarInput } from "@/lib/team-avatar";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function TeamAvatar({
  team,
  size = 64,
  className,
  showSourceHint = false,
}: {
  team: TeamAvatarInput;
  size?: number;
  className?: string;
  showSourceHint?: boolean;
}) {
  const { t } = useI18n();
  const avatar = getTeamAvatar(team, Math.max(64, size * 2));
  const fromLeader = avatar.source === "leader-head" || avatar.source === "leader-avatar";

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 bg-[#0b233b]",
        className,
      )}
      style={{ width: size, height: size }}
      title={
        fromLeader && avatar.leaderName
          ? t("team.detail.avatarFromLeader", { name: avatar.leaderName })
          : team.tag
      }
    >
      {avatar.src ? (
        <Image
          src={avatar.src}
          alt=""
          fill
          sizes={`${size}px`}
          className={cn("object-cover", avatar.pixelated && "[image-rendering:pixelated]")}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white/45">
          {avatar.initials}
        </span>
      )}

      {showSourceHint && fromLeader ? (
        <span className="absolute inset-x-0 bottom-0 bg-[rgba(3,14,35,0.82)] py-0.5 text-center text-[8px] font-black uppercase tracking-[0.1em] text-[#57ffff]">
          {t("team.detail.leader")}
        </span>
      ) : null}
    </div>
  );
}
