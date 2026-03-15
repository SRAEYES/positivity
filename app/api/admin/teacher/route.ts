import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const profile = await prisma.teacherProfile.findFirst();
        return NextResponse.json(profile || { 
            name: "Acharya Shrivatsa", 
            qualifications: "MA in Sanskrit, Vedantic Scholar", 
            experience: "15+ Years of Vedic Teaching", 
            bio: "Dedicated to preserving and sharing the eternal wisdom of Sanatana Dharma with the modern world.",
            phone: "+91 999 999 9999",
            email: "contact@dharmaveda.com"
        });
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch master's profile" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    const { id, updatedAt, ...updateData } = body;
    try {
        // Since we only have one teacher profile normally
        const existing = await prisma.teacherProfile.findFirst();
        
        let profile;
        if (existing) {
            profile = await prisma.teacherProfile.update({
                where: { id: existing.id },
                data: updateData
            });
        } else {
            profile = await prisma.teacherProfile.create({
                data: updateData
            });
        }
        return NextResponse.json(profile);
    } catch (e) {
        console.error("Teacher API Error:", e);
        return NextResponse.json({ error: "Failed to manifest profile" }, { status: 500 });
    }
}
