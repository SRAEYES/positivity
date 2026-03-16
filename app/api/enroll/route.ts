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

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    // Paid courses must go through the payment flow.
    if (course.price && course.price > 0) {
      return NextResponse.json(
        { error: "Payment required. Please complete payment to enroll.", requiresPayment: true },
        { status: 402 }
      );
    }

    const existing = await prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (existing) {
      if (existing.paid) {
        return NextResponse.json({ message: "Already enrolled in this sacred path." }, { status: 200 });
      }
      return NextResponse.json({ message: "Thy initiation is already pending.", enrollment: existing }, { status: 200 });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        paid: !course.price || course.price === 0,
      },
    });

    return NextResponse.json({
      message: course.price === 0 ? "Sacred path joined successfully" : "Initiation started",
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
      include: { payment: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.payment.deleteMany({ where: { enrollmentId: existing.id } }),
      prisma.enrollment.delete({ where: { id: existing.id } }),
    ]);

    return NextResponse.json({ message: "Successfully unenrolled" });
  } catch (error) {
    console.error("De-enroll error:", error);
    const message = error instanceof Error ? error.message : "Failed to de-enroll";
    return NextResponse.json({ error: "Failed to de-enroll", details: message }, { status: 500 });
  }
}