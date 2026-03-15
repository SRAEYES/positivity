import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const body = await req.json();
    const { goalId, roundsCompleted } = body;

    try {
        const progress = await prisma.japaProgress.create({
            data: { goalId, roundsCompleted }
        });
        return NextResponse.json({ progress });
    } catch (e) {
        return NextResponse.json({ error: "Failed to record progress" }, { status: 500 });
    }
}
