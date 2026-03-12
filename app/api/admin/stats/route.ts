import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalStudents = await prisma.user.count({
      where: { role: "student" },
    });

    const totalCourses = await prisma.course.count();

    const totalEnrollments = await prisma.enrollment.count();

    const payments = await prisma.payment.findMany({
      where: { status: "success" },
    });

    const revenue = payments.reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      totalStudents,
      totalCourses,
      totalEnrollments,
      revenue,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}