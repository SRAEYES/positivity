import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdStr = searchParams.get("userId");

    if (!userIdStr) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(userIdStr);

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const count = await prisma.notification.count({
      where: {
        OR: [
          { isGlobal: true },
          { userId: userId }
        ],
        read: false,
        createdAt: {
          gte: twentyFourHoursAgo
        }
      }
    });

    return NextResponse.json({ unreadCount: count });
  } catch (error) {
    console.error("Unread Count Fetch Error:", error);
    return NextResponse.json({ error: "Failed to load cosmic signals" }, { status: 500 });
  }
}
