import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ ticketId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { ticketId } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { creator: { select: { name: true, image: true, discordId: true } }, assignee: { select: { name: true, image: true } }, messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ticket });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ ticketId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { ticketId } = await params;
  const body = await req.json();
  const updateData: Record<string, unknown> = {};
  if (body.status) updateData.status = body.status;
  if (body.priority) updateData.priority = body.priority;
  if (body.assigneeId !== undefined) updateData.assigneeId = body.assigneeId;
  if (body.status === "CLOSED" || body.status === "RESOLVED") { updateData.closedAt = new Date(); updateData.closedReason = body.closedReason; }
  const ticket = await prisma.ticket.update({ where: { id: ticketId }, data: updateData });
  return NextResponse.json({ ticket });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ ticketId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { ticketId } = await params;
  await prisma.ticket.delete({ where: { id: ticketId } });
  return NextResponse.json({ success: true });
}
