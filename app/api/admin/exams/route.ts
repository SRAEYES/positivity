import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const quizzes = await prisma.quiz.findMany({
            include: { questions: true },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ quizzes });
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { title, description, questions } = await req.json();

        if (!title || !questions || !Array.isArray(questions)) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const quiz = await prisma.quiz.create({
            data: {
                title,
                description,
                questions: {
                    create: questions.map((q: any) => ({
                        text: q.text,
                        options: JSON.stringify(q.options),
                        correctAnswer: q.correctAnswer
                    }))
                }
            },
            include: { questions: true }
        });

        return NextResponse.json({ quiz });
    } catch (e) {
        return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "0");

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    try {
        // Questions will be deleted automatically if cascade is set, 
        // otherwise we do it manually. Prisma usually requires explicit delete for relations unless configured.
        await prisma.quizQuestion.deleteMany({ where: { quizId: id } });
        await prisma.quiz.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Failed to delete exam" }, { status: 500 });
    }
}
