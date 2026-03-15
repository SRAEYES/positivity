import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULTS = [
  { sanskrit: "Dharma", english: "Righteous Duty / Purpose", example: "Live your Dharma and the universe will align." },
  { sanskrit: "Karma", english: "Law of Cause & Effect", example: "Every action ripples through eternity." },
  { sanskrit: "Moksha", english: "Liberation / Enlightenment", example: "The ultimate aim of every soul's journey." },
  { sanskrit: "Ahimsa", english: "Non-Violence / Compassion", example: "The highest ethical principle in Vedic life." },
  { sanskrit: "Satya", english: "Truth / Authenticity", example: "Truth is the foundation of all virtues." },
  { sanskrit: "Atma", english: "The Eternal Soul / Self", example: "The Atma is never born, never dies." },
];

export async function GET() {
  let cards = await prisma.smartCard.findMany({ orderBy: { createdAt: "asc" } });
  // Seed defaults if empty
  if (cards.length === 0) {
    await prisma.smartCard.createMany({ data: DEFAULTS });
    cards = await prisma.smartCard.findMany({ orderBy: { createdAt: "asc" } });
  }
  return NextResponse.json(cards);
}

export async function POST(req: NextRequest) {
  const { sanskrit, english, example } = await req.json();
  if (!sanskrit || !english) return NextResponse.json({ error: "sanskrit and english are required" }, { status: 400 });
  const card = await prisma.smartCard.create({ data: { sanskrit, english, example } });
  return NextResponse.json(card, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id, sanskrit, english, example } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const card = await prisma.smartCard.update({ where: { id }, data: { sanskrit, english, example } });
  return NextResponse.json(card);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") || "0");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.smartCard.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
