import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        pricingType: true,
        startDate: true,
        timeslot: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
