import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ serverId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { serverId } = await params;
  const settings = await prisma.serverSettings.findUnique({ where: { serverId } });
  if (!settings) {
    const newSettings = await prisma.serverSettings.create({ data: { serverId } });
    return NextResponse.json({ settings: newSettings });
  }
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ serverId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { serverId } = await params;
  const body = await req.json();
  const settings = await prisma.serverSettings.upsert({
    where: { serverId }, update: body, create: { serverId, ...body },
  });
  return NextResponse.json({ settings });
}
