import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: { role: "student" },
            select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true
            },
            orderBy: { name: "asc" }
        });
        return NextResponse.json(users);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
