import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const [quizzes, puzzles, quests, deities] = await Promise.all([
            prisma.quiz.findMany({ 
                where: { isActive: true },
                include: { _count: { select: { questions: true } } }
            }),
            prisma.vedicPuzzle.findMany(),
            prisma.historyQuest.findMany(),
            prisma.divineDeity.findMany({ orderBy: { createdAt: "asc" } })
        ]);

        return NextResponse.json({
            quizzes,
            puzzles,
            quests,
            deities
        });
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch arena data" }, { status: 500 });
    }
}
