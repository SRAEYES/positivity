import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = parseInt(searchParams.get("userId") || "0");

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    try {
        // Automatically mark notifications older than 24h as 'expired/deleted' or just filter them out
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const notifications = await prisma.notification.findMany({
            where: {
                userId,
                createdAt: {
                    gte: twentyFourHoursAgo
                }
            },
            orderBy: { createdAt: "desc" }
        });

        // Optional: Count unread
        const unreadCount = await prisma.notification.count({
            where: { userId, read: false, createdAt: { gte: twentyFourHoursAgo } }
        });

        return NextResponse.json({ notifications, unreadCount });
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "0");

    if (!id) return NextResponse.json({ error: "Missing notification id" }, { status: 400 });

    try {
        await prisma.notification.update({
            where: { id },
            data: { read: true }
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
    }
}
