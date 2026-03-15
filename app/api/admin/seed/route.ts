import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // Check if already seeded
    const existing = await prisma.quiz.findFirst({ where: { title: "Vedic Wisdom Foundations" } });
    if (existing) {
      return NextResponse.json({ message: "Already seeded", quiz: existing });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: "Vedic Wisdom Foundations",
        description: "A comprehensive test of fundamental Vedic knowledge covering Gita, Vedas, and sacred history.",
        isActive: true,
        questions: {
          create: [
            { text: "Who spoke the Bhagavad Gita?", options: JSON.stringify(["Lord Rama", "Lord Shiva", "Lord Krishna", "Lord Brahma"]), correctAnswer: "Lord Krishna" },
            { text: "How many chapters are in the Bhagavad Gita?", options: JSON.stringify(["12", "18", "24", "108"]), correctAnswer: "18" },
            { text: "Which Veda is the oldest?", options: JSON.stringify(["Sama Veda", "Yajur Veda", "Atharva Veda", "Rig Veda"]), correctAnswer: "Rig Veda" },
            { text: "What is the meaning of 'Dharma'?", options: JSON.stringify(["Wealth", "Righteous Duty", "Liberation", "Pleasure"]), correctAnswer: "Righteous Duty" },
            { text: "Who composed the Mahabharata?", options: JSON.stringify(["Valmiki", "Vyasa", "Tulsidas", "Kalidasa"]), correctAnswer: "Vyasa" },
            { text: "What sacred syllable represents Brahman?", options: JSON.stringify(["Swastika", "Om", "Namaste", "Shanti"]), correctAnswer: "Om" },
            { text: "Which is NOT one of the 4 Yugas?", options: JSON.stringify(["Satya", "Treta", "Dvapara", "Sama"]), correctAnswer: "Sama" },
            { text: "What is the ultimate goal of Yoga?", options: JSON.stringify(["Physical Fitness", "Mental Peace", "Union with the Divine", "Stress Relief"]), correctAnswer: "Union with the Divine" },
            { text: "Who is the mother of the Pandavas?", options: JSON.stringify(["Gandhari", "Kunti", "Draupadi", "Kaikeyi"]), correctAnswer: "Kunti" },
            { text: "In which battle was the Gita spoken?", options: JSON.stringify(["Battle of Lanka", "Battle of Panipat", "Battle of Kurukshetra", "Battle of Plassey"]), correctAnswer: "Battle of Kurukshetra" }
          ]
        }
      }
    });

    // Seed default deities for DivineStack
    const deitiesCount = await prisma.divineDeity.count();
    if (deitiesCount === 0) {
      await prisma.divineDeity.createMany({
        data: [
          { name: "Sri Krishna", info: "The Supreme Personality of Godhead, speaker of the Bhagavad Gita and Lord of Dwarka.", image: "https://images.unsplash.com/photo-1609619385002-f40f1df66e12?w=400", color: "from-blue-600 to-indigo-900" },
          { name: "Sri Rama", info: "The ideal King and embodiment of Dharma. Avatar of Vishnu and Lord of Ayodhya.", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400", color: "from-orange-500 to-red-700" },
          { name: "Lord Shiva", info: "The auspicious Mahadeva, Lord of Yogis and destroyer of all illusion.", image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400", color: "from-cyan-900 to-zinc-950" },
          { name: "Srimati Radharani", info: "The embodiment of divine love and the supreme devotee of Lord Sri Krishna.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", color: "from-rose-400 to-pink-600" },
          { name: "Narasimha Deva", info: "The half-man, half-lion avatar of Vishnu who protected the great devotee Prahlada.", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400", color: "from-amber-600 to-red-900" },
          { name: "Lord Ganesha", info: "The remover of obstacles and son of Lord Shiva, worshipped at the beginning of all endeavors.", image: "https://images.unsplash.com/photo-1681407258048-f16a0da23fa1?w=400", color: "from-yellow-600 to-orange-700" },
        ]
      });
    }

    return NextResponse.json({ message: "Seeded successfully", quizId: quiz.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
