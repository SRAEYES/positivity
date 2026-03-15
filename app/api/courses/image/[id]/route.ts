import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const courseId = parseInt(params.id);
    
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { thumbnail: true },
    });

    if (!course || !course.thumbnail) {
      return new NextResponse(null, { status: 404 });
    }

    // Convert base64 to buffer
    const base64Data = course.thumbnail.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
