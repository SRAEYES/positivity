import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "Course ID required" }, { status: 400 });
  }

  await prisma.course.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Course deleted" });
}