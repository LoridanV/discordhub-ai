import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMockAnalytics } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get("serverId");
  const days = parseInt(searchParams.get("days") ?? "30");

  // Return mock data for demo; in production query real analytics table
  const data = getMockAnalytics(days);
  return NextResponse.json(data);
}
