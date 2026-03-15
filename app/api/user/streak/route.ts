import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const { userId } = await req.json();

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { lastLogin: true, streakCount: true }
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const now = new Date();
        const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
        
        let newStreak = user.streakCount;

        if (!lastLogin) {
            newStreak = 1;
        } else {
            // Normalize to UTC midnight for date comparison
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const last = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
            
            const diffInMs = today.getTime() - last.getTime();
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInDays === 1) {
                // Continuous day login
                newStreak += 1;
            } else if (diffInDays > 1) {
                // Streak broken
                newStreak = 1;
            } else if (diffInDays === 0) {
                // Already logged in today, keep same
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { 
                lastLogin: now,
                streakCount: newStreak
            }
        });

        return NextResponse.json({ streakCount: updatedUser.streakCount });
    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
