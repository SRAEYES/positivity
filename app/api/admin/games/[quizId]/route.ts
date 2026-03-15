import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/admin/games/[quizId] — update quiz metadata
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params;
  const id = parseInt(quizId);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const quiz = await prisma.quiz.findUnique({ where: { id }, include: { questions: true } });
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(quiz);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params;
  const id = parseInt(quizId);
  const { title, description, isActive } = await req.json();
  const quiz = await prisma.quiz.update({ where: { id }, data: { title, description, isActive } });
  return NextResponse.json(quiz);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params;
  const id = parseInt(quizId);
  await prisma.quiz.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
