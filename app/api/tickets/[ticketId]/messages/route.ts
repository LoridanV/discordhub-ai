import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ ticketId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { ticketId } = await params;
  const { content, isStaff } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });
  const message = await prisma.ticketMessage.create({
    data: { ticketId, authorId: session.user.id, content: content.trim(), isStaff: isStaff ?? false },
  });
  await prisma.ticket.updateMany({ where: { id: ticketId, status: "OPEN" }, data: { status: "IN_PROGRESS" } });
  return NextResponse.json({ message }, { status: 201 });
}
