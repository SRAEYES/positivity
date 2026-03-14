import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const body = await req.json();
    const { userId, mantraName, dailyRoundsGoal, theme } = body;

    try {
        const goal = await prisma.japaGoal.upsert({
            where: { id: body.id || -1 }, // Simple upsert logic for demo
            update: { mantraName, dailyRoundsGoal, theme },
            create: { userId, mantraName, dailyRoundsGoal, theme }
        });
        return NextResponse.json({ goal });
    } catch (e) {
        return NextResponse.json({ error: "Failed to manifest goal" }, { status: 500 });
    }
}
