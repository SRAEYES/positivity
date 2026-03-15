import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 });
    }

    // Cascading deletion
    // 1. Find all enrollments for this course
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: id },
      select: { id: true }
    });

    const enrollmentIds = enrollments.map(e => e.id);

    // 2. Delete all payments associated with those enrollments
    if (enrollmentIds.length > 0) {
      await prisma.payment.deleteMany({
        where: { enrollmentId: { in: enrollmentIds } }
      });
    }

    // 3. Delete the enrollments
    await prisma.enrollment.deleteMany({
      where: { courseId: id }
    });

    // 4. Finally, delete the course
    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Course and associated data deleted" });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}