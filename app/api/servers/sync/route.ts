import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const botToken = process.env.DISCORD_BOT_TOKEN;
    const discordId = session.user.discordId;

    if (!botToken || !discordId) {
      return NextResponse.json({ error: "No bot token" }, { status: 400 });
    }

    let guilds: any[] = [];

    // Încearcă cu OAuth access token
    const account = await prisma.account.findFirst({
      where: { userId: session.user.id, provider: "discord" },
    });

    if (account?.access_token) {
      const res = await fetch("https://discord.com/api/v10/users/@me/guilds?with_counts=true", {
        headers: { Authorization: `Bearer ${account.access_token}` },
      });
      if (res.ok) {
        guilds = await res.json();
      }
    }

    // Fallback — fetch guildurile botului
    if (guilds.length === 0) {
      const res = await fetch("https://discord.com/api/v10/users/@me/guilds?with_counts=true", {
        headers: { Authorization: `Bot ${botToken}` },
      });
      if (res.ok) {
        guilds = await res.json();
      }
    }

    if (guilds.length === 0) {
      return NextResponse.json({
        error: "Could not fetch guilds. Make sure the bot is in your server.",
        servers: [],
      });
    }

    // Salvează în baza de date
    const saved = [];
    for (const guild of guilds) {
      try {
        const memberCount = guild.approximate_member_count || guild.member_count || 0;

        const server = await prisma.server.upsert({
          where: { discordId: guild.id },
          update: {
            name: guild.name,
            icon: guild.icon,
            memberCount,
          },
          create: {
            discordId: guild.id,
            name: guild.name,
            icon: guild.icon,
            memberCount,
            ownerId: session.user.discordId,
          },
        });

        await prisma.serverUser.upsert({
          where: { userId_serverId: { userId: session.user.id, serverId: server.id } },
          update: { permissions: guild.permissions?.toString() || "8" },
          create: {
            userId: session.user.id,
            serverId: server.id,
            permissions: guild.permissions?.toString() || "8",
          },
        });

        await prisma.serverSettings.upsert({
          where: { serverId: server.id },
          update: {},
          create: { serverId: server.id },
        });

        saved.push({
          id: server.id,
          discordId: server.discordId,
          name: server.name,
          icon: server.icon,
          memberCount: server.memberCount,
          plan: "FREE",
        });
      } catch (e) {
        console.error(`Failed to save guild ${guild.name}:`, e);
      }
    }

    return NextResponse.json({ servers: saved, synced: saved.length });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}