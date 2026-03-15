import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = Number(searchParams.get("userId"));

  const allEnrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: true,
    },
    orderBy: { paid: 'desc' } // Prioritize paid ones
  });

  // Deduplicate by courseId
  const uniqueEnrollments = Array.from(
    allEnrollments.reduce((map, item) => {
      if (!map.has(item.courseId)) map.set(item.courseId, item);
      return map;
    }, new Map()).values()
  );

  return NextResponse.json({ enrollments: uniqueEnrollments });
}