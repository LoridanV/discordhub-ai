import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // Verifică că vine de la bot
  const auth = req.headers.get("Authorization");
  if (auth !== `Bot ${process.env.DISCORD_BOT_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    discordId, messageCount, activeMembers,
    voiceMinutes, newMembers, leftMembers, memberCount
  } = body;

  try {
    // Găsește serverul în DB
    const server = await prisma.server.findUnique({
      where: { discordId },
    });

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    // Actualizează member count
    await prisma.server.update({
      where: { discordId },
      data: { memberCount },
    });

    // Salvează analytics pentru azi
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.analytics.upsert({
      where: { serverId_date: { serverId: server.id, date: today } },
      update: {
        messageCount: { increment: messageCount },
        activeMembers: { set: activeMembers },
        voiceMinutes: { increment: voiceMinutes },
        newMembers: { increment: newMembers },
        leftMembers: { increment: leftMembers },
      },
      create: {
        serverId: server.id,
        date: today,
        messageCount,
        activeMembers,
        voiceMinutes,
        newMembers,
        leftMembers,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}