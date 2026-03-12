import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = Number(searchParams.get("userId"));

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: true,
    },
  });

  return NextResponse.json({ enrollments });
}