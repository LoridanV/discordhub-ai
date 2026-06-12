import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const serverUsers = await prisma.serverUser.findMany({
      where: { userId: session.user.id },
      include: {
        server: {
          include: {
            settings: true,
            subscription: true,
            _count: { select: { tickets: true, moderationLogs: true } },
          },
        },
      },
    });

    const servers = serverUsers
      .filter((su: any) => {
        const perms = BigInt(su.permissions);
        return (perms & BigInt("8")) !== BigInt(0);
      })
      .map((su: any) => ({
        id: su.server.id,
        discordId: su.server.discordId,
        name: su.server.name,
        icon: su.server.icon,
        memberCount: su.server.memberCount,
        plan: su.server.subscription?.plan ?? "FREE",
        ticketCount: su.server._count.tickets,
        moderationCount: su.server._count.moderationLogs,
      }));

    return NextResponse.json({ servers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { discordId, name, icon, memberCount } = await req.json();

    const server = await prisma.server.upsert({
      where: { discordId },
      update: { name, icon, memberCount },
      create: {
        discordId,
        name,
        icon,
        memberCount: memberCount ?? 0,
        ownerId: session.user.discordId,
      },
    });

    await prisma.serverUser.upsert({
      where: { userId_serverId: { userId: session.user.id, serverId: server.id } },
      update: { permissions: "8" },
      create: {
        userId: session.user.id,
        serverId: server.id,
        permissions: "8",
      },
    });

    // Create default settings
    await prisma.serverSettings.upsert({
      where: { serverId: server.id },
      update: {},
      create: { serverId: server.id },
    });

    return NextResponse.json({ server });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
