import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const profile = await prisma.teacherProfile.findFirst({
            orderBy: { updatedAt: 'desc' }
        });
        return NextResponse.json(profile || { 
            name: "Acharya Shrivatsa", 
            qualifications: "MA in Sanskrit, Vedantic Scholar", 
            experience: "15+ Years of Vedic Teaching", 
            bio: "Dedicated to preserving and sharing the eternal wisdom of Sanatana Dharma with the modern world."
        });
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch master's profile" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    try {
        const profile = await prisma.teacherProfile.upsert({
            where: { id: body.id || -1 },
            update: { ...body },
            create: { ...body }
        });
        return NextResponse.json(profile);
    } catch (e) {
        return NextResponse.json({ error: "Failed to manifest profile" }, { status: 500 });
    }
}
