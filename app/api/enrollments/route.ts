import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdRaw = searchParams.get("userId");
    
    if (!userIdRaw || isNaN(Number(userIdRaw))) {
      return NextResponse.json({ enrollments: [] });
    }

    const userId = Number(userIdRaw);

    const allEnrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: true,
      },
      orderBy: { paid: 'desc' }
    });

    // Deduplicate by courseId
    const uniqueEnrollments = Array.from(
      allEnrollments.reduce((map, item) => {
        if (!map.has(item.courseId)) map.set(item.courseId, item);
        return map;
      }, new Map()).values()
    );

    return NextResponse.json({ enrollments: uniqueEnrollments });
  } catch (error) {
    console.error("Enrollments fetch error:", error);
    return NextResponse.json({ enrollments: [], error: "Failed to fetch enrollments" }, { status: 500 });
  }
}