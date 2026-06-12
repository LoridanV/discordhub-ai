import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMockModerationLogs } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get("serverId");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  // Return mock data for demo
  const logs = getMockModerationLogs(50);
  const paginated = logs.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ logs: paginated, total: logs.length, page });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { serverId, targetId, targetName, action, reason, content, severity, aiDetected, aiCategory } = body;

  const log = await prisma.moderationLog.create({
    data: {
      serverId,
      targetId,
      targetName,
      action,
      reason,
      content,
      severity: severity ?? 0,
      aiDetected: aiDetected ?? false,
      aiCategory,
      moderatorId: session.user.id,
    },
  });

  return NextResponse.json({ log }, { status: 201 });
}
