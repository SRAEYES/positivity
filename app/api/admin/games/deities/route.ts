import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const deities = await prisma.divineDeity.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(deities);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, info, image, color } = body;
  if (!name || !info || !image) {
    return NextResponse.json({ error: "name, info, and image are required" }, { status: 400 });
  }
  const deity = await prisma.divineDeity.create({
    data: { name, info, image, color: color || "from-primary to-secondary" }
  });
  return NextResponse.json(deity, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id, name, info, image, color } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const deity = await prisma.divineDeity.update({
    where: { id },
    data: { name, info, image, color }
  });
  return NextResponse.json(deity);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") || "0");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.divineDeity.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
