import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const body = await req.json();
    const { userId, bookName, pagesRead, notes } = body;

    try {
        const entry = await prisma.spiritualJournal.create({
            data: { userId, bookName, pagesRead, notes }
        });
        return NextResponse.json({ entry });
    } catch (e) {
        return NextResponse.json({ error: "Failed to record realization" }, { status: 500 });
    }
}
