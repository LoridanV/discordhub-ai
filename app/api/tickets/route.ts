import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTicketId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get("serverId");
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: Record<string, unknown> = {};
  if (serverId) where.serverId = serverId;
  if (status) where.status = status;
  if (category) where.category = category;

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      include: {
        creator: { select: { name: true, image: true } },
        assignee: { select: { name: true, image: true } },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.ticket.count({ where }),
  ]);

  return NextResponse.json({ tickets, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { serverId, title, description, category, priority } = await req.json();

  const ticket = await prisma.ticket.create({
    data: {
      ticketId: generateTicketId(),
      serverId,
      creatorId: session.user.id,
      title,
      description,
      category: category ?? "SUPPORT",
      priority: priority ?? "MEDIUM",
      status: "OPEN",
    },
    include: {
      creator: { select: { name: true, image: true } },
    },
  });

  return NextResponse.json({ ticket }, { status: 201 });
}
