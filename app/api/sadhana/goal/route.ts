import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const body = await req.json();
    const { userId, mantraName, dailyRoundsGoal, theme } = body;

    try {
        const goal = body.id 
            ? await prisma.japaGoal.update({
                where: { id: body.id },
                data: { mantraName, dailyRoundsGoal, theme }
              })
            : await prisma.japaGoal.create({
                data: { userId, mantraName, dailyRoundsGoal, theme }
              });
        return NextResponse.json({ goal });
    } catch (e) {
        return NextResponse.json({ error: "Failed to manifest goal" }, { status: 500 });
    }
}
