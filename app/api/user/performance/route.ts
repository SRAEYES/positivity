import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { userId, quizId, score, total } = await req.json();

        if (!userId || !quizId || score === undefined || !total) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const result = await prisma.quizResult.create({
            data: {
                userId,
                quizId,
                score,
                total
            }
        });

        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");
    
    try {
        if (quizId) {
            // Get leaderboard for specific quiz
            const leaderboard = await prisma.quizResult.findMany({
                where: { quizId: parseInt(quizId) },
                include: { user: { select: { name: true, imageUrl: true } } },
                orderBy: { score: "desc" },
                take: 10
            });
            return NextResponse.json(leaderboard);
        } else {
            // Global leaderboard (sum of scores per user)
            // Note: Prisma group by with include is tricky, we might need to aggregate manually or use raw queries
            const topUsers = await prisma.quizResult.groupBy({
                by: ['userId'],
                _sum: { score: true },
                orderBy: { _sum: { score: 'desc' } },
                take: 10
            });

            const users = await prisma.user.findMany({
                where: { id: { in: topUsers.map(u => u.userId) } },
                select: { id: true, name: true, imageUrl: true }
            });

            const globalLeaderboard = topUsers.map(u => ({
                userId: u.userId,
                totalScore: u._sum.score,
                user: users.find(usr => usr.id === u.userId)
            }));

            return NextResponse.json(globalLeaderboard);
        }
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
