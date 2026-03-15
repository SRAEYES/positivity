import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const body = await req.json();
    const { title, description, thumbnail, timeslot, wpLink, gcrLink, startDate, price, pricingType } = body;
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const courseId = parseInt(params.id);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    const course = await prisma.course.update({
      where: { id: courseId },
      data: { 
        title, 
        description, 
        thumbnail, 
        timeslot, 
        wpLink, 
        gcrLink,
        price: parseFloat(price) || 0,
        pricingType: pricingType || "ONETIME",
        startDate: startDate ? new Date(startDate) : null,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const courseId = parseInt(params.id);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}
