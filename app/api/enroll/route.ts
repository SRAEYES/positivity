import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, courseId } = body;

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "userId and courseId required" },
        { status: 400 }
      );
    }

    const existing = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already enrolled" },
        { status: 400 }
      );
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        paid: false,
      },
    });

    return NextResponse.json({
      message: "Enrollment created",
      enrollment,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Enrollment failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId, courseId } = body;

    if (!userId || !courseId) {
      return NextResponse.json({ error: "userId and courseId required" }, { status: 400 });
    }

    const existing = await prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 404 });
    }

    await prisma.enrollment.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ message: "Successfully unenrolled" });
  } catch (error) {
    console.error("De-enroll error:", error);
    return NextResponse.json({ error: "Failed to de-enroll" }, { status: 500 });
  }
}