import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, courseId, progress } = await req.json();

    if (!userId || !courseId) {
      return NextResponse.json({ error: "Missing identity details" }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.updateMany({
      where: { userId, courseId },
      data: { progress: Math.min(100, Math.max(0, progress)) },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error("Progress Update Error:", error);
    return NextResponse.json({ error: "Failed to record advancement" }, { status: 500 });
  }
}
