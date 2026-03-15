import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const quests = await prisma.historyQuest.findMany({ orderBy: { createdAt: "asc" } });
        return NextResponse.json(quests);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch quests" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { title, description, events } = await req.json();
        const quest = await prisma.historyQuest.create({
            data: { title, description, events: JSON.stringify(events) }
        });
        return NextResponse.json(quest);
    } catch (e) {
        return NextResponse.json({ error: "Failed to create quest" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, title, description, events } = await req.json();
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        const quest = await prisma.historyQuest.update({
            where: { id },
            data: { title, description, events: JSON.stringify(events) }
        });
        return NextResponse.json(quest);
    } catch (e) {
        return NextResponse.json({ error: "Failed to update quest" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = Number(searchParams.get("id"));
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        await prisma.historyQuest.delete({ where: { id } });
        return NextResponse.json({ message: "Quest dissolved" });
    } catch (e) {
        return NextResponse.json({ error: "Failed to dissolve quest" }, { status: 500 });
    }
}
