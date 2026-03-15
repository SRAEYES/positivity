import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const puzzles = await prisma.vedicPuzzle.findMany({ orderBy: { createdAt: "asc" } });
        return NextResponse.json(puzzles);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch puzzles" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { title, fullText, tiles } = await req.json();
        const puzzle = await prisma.vedicPuzzle.create({
            data: { title, fullText, tiles: JSON.stringify(tiles) }
        });
        return NextResponse.json(puzzle);
    } catch (e) {
        return NextResponse.json({ error: "Failed to create puzzle" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, title, fullText, tiles } = await req.json();
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        const puzzle = await prisma.vedicPuzzle.update({
            where: { id },
            data: { title, fullText, tiles: JSON.stringify(tiles) }
        });
        return NextResponse.json(puzzle);
    } catch (e) {
        return NextResponse.json({ error: "Failed to update puzzle" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = Number(searchParams.get("id"));
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        await prisma.vedicPuzzle.delete({ where: { id } });
        return NextResponse.json({ message: "Puzzle dissolved" });
    } catch (e) {
        return NextResponse.json({ error: "Failed to dissolve puzzle" }, { status: 500 });
    }
}
