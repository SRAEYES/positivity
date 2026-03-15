import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = parseInt(searchParams.get("userId") || "0");
    const dateStr = searchParams.get("date");

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    try {
        const goal = await prisma.japaGoal.findFirst({
            where: { userId }
        });

        let progress: any[] = [];
        if (goal) {
            progress = await prisma.japaProgress.findMany({
                where: { 
                    goalId: goal.id,
                    ...(dateStr ? {
                        date: {
                            gte: new Date(new Date(dateStr).setHours(0,0,0,0)),
                            lte: new Date(new Date(dateStr).setHours(23,59,59,999))
                        }
                    } : {})
                },
                orderBy: { date: "asc" }
            });
        }

        const journals = await prisma.spiritualJournal.findMany({
            where: { 
                userId,
                ...(dateStr ? {
                    date: {
                        gte: new Date(new Date(dateStr).setHours(0,0,0,0)),
                        lte: new Date(new Date(dateStr).setHours(23,59,59,999))
                    }
                } : {})
            },
            orderBy: { date: "desc" }
        });

        return NextResponse.json({ goal, progress, journals });
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch seeker data" }, { status: 500 });
    }
}
