import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const perks = await prisma.perk.findMany({
            orderBy: { name: "asc" }
        });
        return NextResponse.json(perks);
    } catch (e) {
        return NextResponse.json({ error: "Failed to load perks" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name, description, type, imageUrl } = await req.json();
        const perk = await prisma.perk.create({
            data: { name, description, type, imageUrl }
        });
        return NextResponse.json(perk);
    } catch (e) {
        return NextResponse.json({ error: "Failed to create reward" }, { status: 500 });
    }
}
