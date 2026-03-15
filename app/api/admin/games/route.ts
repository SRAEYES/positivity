import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const quizzes = await prisma.quiz.findMany({
            include: { _count: { select: { questions: true } } },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(quizzes);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { title, description, questions } = await req.json();
        
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
            }
        });
        
        return NextResponse.json(quiz);
    } catch (e) {
        return NextResponse.json({ error: "Failed to manifest quiz" }, { status: 500 });
    }
}
