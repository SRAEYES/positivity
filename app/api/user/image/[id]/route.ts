import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const userId = parseInt(params.id);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { imageUrl: true },
    });

    if (!user || !user.imageUrl) {
      return new NextResponse(null, { status: 404 });
    }

    // Convert base64 to buffer
    const base64Data = user.imageUrl.split(",")[1];
    if (!base64Data) return new NextResponse(null, { status: 404 });
    
    const buffer = Buffer.from(base64Data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
