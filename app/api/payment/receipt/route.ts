import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const enrollmentIdRaw = searchParams.get("enrollmentId");
    const userIdRaw = searchParams.get("userId");

    if (!enrollmentIdRaw || isNaN(Number(enrollmentIdRaw))) {
      return NextResponse.json({ error: "enrollmentId is required" }, { status: 400 });
    }
    if (!userIdRaw || isNaN(Number(userIdRaw))) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const enrollmentId = Number(enrollmentIdRaw);
    const userId = Number(userIdRaw);

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: true,
        payment: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });

    if (!enrollment || enrollment.userId !== userId) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    return NextResponse.json({
      enrollment: {
        id: enrollment.id,
        createdAt: enrollment.createdAt,
        paid: enrollment.paid,
        course: enrollment.course,
        payment: enrollment.payment,
        user: enrollment.user,
      },
    });
  } catch (error) {
    console.error("Receipt fetch error:", error);
    return NextResponse.json({ error: "Failed to load receipt" }, { status: 500 });
  }
}
