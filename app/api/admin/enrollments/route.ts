import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: true,
        course: true,
      },
    });
    return NextResponse.json({ enrollments });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load enrollments" }, { status: 500 });
  }
}
