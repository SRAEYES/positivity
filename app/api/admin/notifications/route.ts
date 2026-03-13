import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { title, message, type, isGlobal, userId } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type: type || "info",
        isGlobal: isGlobal ?? true,
        userId: userId || null,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Broadcast Error:", error);
    return NextResponse.json({ error: "Failed to broadcast update" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load broadcasts" }, { status: 500 });
  }
}
