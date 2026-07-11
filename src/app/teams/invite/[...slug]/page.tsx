import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AcceptInviteClient } from "@/components/teams/accept-invite-client";

export default async function TeamInvitePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const slug = params.slug ?? [];

  let teamId = "";
  let token = "";

  if (slug.length === 1) {
    token = slug[0];
  } else if (slug.length === 2) {
    teamId = slug[0];
    token = slug[1];
  } else {
    redirect("/teams");
  }

  if (!token) redirect("/teams");

  if (!teamId) {
    const invitation = await prisma.teamInvitation.findUnique({
      where: { token },
      select: { teamId: true },
    });
    if (!invitation) redirect("/teams");
    teamId = invitation.teamId;
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/auth/signin?callbackUrl=/teams/invite/${teamId}/${token}`);
  }

  return <AcceptInviteClient token={token} teamId={teamId} />;
}

