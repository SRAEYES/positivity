import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const results = await prisma.quizResult.findMany({
            include: {
                user: { select: { name: true, email: true, imageUrl: true } },
                quiz: { select: { title: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        // Calculate summary stats
        const totalAttempts = results.length;
        const perfectScores = results.filter(r => r.score === r.total).length;
        const uniqueUsers = new Set(results.map(r => r.userId)).size;
        
        const avgScore = totalAttempts > 0 
            ? Math.round((results.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / totalAttempts) * 100)
            : 0;

        return NextResponse.json({
            results,
            stats: {
                totalAttempts,
                perfectScores,
                activeUsers: uniqueUsers,
                avgScore
            }
        });
    } catch (e) {
        return NextResponse.json({ error: "Failed to analyze results" }, { status: 500 });
    }
}
