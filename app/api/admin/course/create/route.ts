import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      thumbnail,
      startDate,
      timeslot,
      wpLink,
      gcrLink
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        timeslot,
        wpLink,
        gcrLink,
        startDate: startDate ? new Date(startDate) : null,
      },
    });

    return NextResponse.json({
      message: "Course created successfully",
      course,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}