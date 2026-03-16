import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdRaw = searchParams.get("userId");
    const includePending = searchParams.get("includePending") === "true";
    
    if (!userIdRaw || isNaN(Number(userIdRaw))) {
      return NextResponse.json({ enrollments: [] });
    }

    const userId = Number(userIdRaw);

    if (!includePending) {
      const paidEnrollments = await prisma.enrollment.findMany({
        where: { userId, paid: true },
        include: { course: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ enrollments: paidEnrollments });
    }

    const allEnrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: [{ paid: "desc" }, { createdAt: "desc" }],
    });

    // Deduplicate by courseId (prefer paid, then newest)
    const uniqueEnrollments = Array.from(
      allEnrollments
        .reduce((map, item) => {
          if (!map.has(item.courseId)) map.set(item.courseId, item);
          return map;
        }, new Map<number, (typeof allEnrollments)[number]>())
        .values()
    );

    return NextResponse.json({ enrollments: uniqueEnrollments });
  } catch (error) {
    console.error("Enrollments fetch error:", error);
    return NextResponse.json({ enrollments: [], error: "Failed to fetch enrollments" }, { status: 500 });
  }
}