import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { userId, perkId } = await req.json();
        
        if (!userId || !perkId) {
            return NextResponse.json({ error: "User ID and Perk ID required" }, { status: 400 });
        }

        const userPerk = await prisma.userPerk.create({
            data: {
                userId,
                perkId,
                unlockedAt: new Date()
            }
        });
        
        return NextResponse.json({ message: "Perk assigned successfully", userPerk });
    } catch (e) {
        console.error("Assign perk error:", e);
        return NextResponse.json({ error: "Failed to assign perk" }, { status: 500 });
    }
}
