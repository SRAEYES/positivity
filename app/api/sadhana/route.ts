import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = parseInt(searchParams.get("userId") || "");

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const goal = await prisma.japaGoal.findFirst({
            where: { userId }
        });

        let progress = [];
        if (goal) {
            progress = await prisma.japaProgress.findMany({
                where: { 
                    goalId: goal.id,
                    date: {
                        gte: new Date(new Date().setHours(0,0,0,0)),
                        lt: new Date(new Date().setHours(23,59,59,999))
                    }
                }
            });
        }

        const journals = await prisma.spiritualJournal.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 20
        });

        return NextResponse.json({ goal, progress, journals });
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
