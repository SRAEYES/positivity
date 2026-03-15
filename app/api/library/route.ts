import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const books = await prisma.libraryBook.findMany();
        if (books.length === 0) {
            // Seed sample books if empty
            const samples = [
                { title: "Bhagavad Gita", author: "A.C. Bhaktivedanta Swami", coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400", description: "The Song of God, ultimate guide to action and devotion." },
                { title: "Srimad Bhagavatam", author: "Vyasadeva", coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400", description: "The spotless Purana, glory of the Supreme Lord." },
                { title: "Chaitanya Charitamrta", author: "Krishnadasa Kaviraja", coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400", description: "The nectar of Sri Chaitanya's life and teachings." }
            ];
            await prisma.libraryBook.createMany({ data: samples });
            return NextResponse.json(await prisma.libraryBook.findMany());
        }
        return NextResponse.json(books);
    } catch (e) {
        return NextResponse.json({ error: "Library is locked" }, { status: 500 });
    }
}
