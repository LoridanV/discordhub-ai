import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ serverId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { serverId } = await params;
  const server = await prisma.server.findUnique({
    where: { id: serverId },
    include: { settings: true, subscription: true, _count: { select: { tickets: true, moderationLogs: true, users: true } } },
  });
  if (!server) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ server });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ serverId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { serverId } = await params;
  const body = await req.json();
  const server = await prisma.server.update({ where: { id: serverId }, data: { name: body.name, icon: body.icon, description: body.description } });
  return NextResponse.json({ server });
}
