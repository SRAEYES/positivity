import prisma from "@/lib/prisma";

async function main() {
  const existing = await prisma.quiz.findFirst({ where: { title: "Vedic Wisdom Foundations" } });
  if (existing) {
    console.log("Sample quiz already exists, skipping.");
    return;
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
          { text: "Who wrote the Mahabharata?", options: JSON.stringify(["Valmiki", "Vyasa", "Tulsidas", "Kalidasa"]), correctAnswer: "Vyasa" },
          { text: "What is the sacred primordial syllable representing Brahman?", options: JSON.stringify(["Swastika", "Om", "Namaste", "Shanti"]), correctAnswer: "Om" },
          { text: "Which of these is NOT one of the 4 Yugas?", options: JSON.stringify(["Satya", "Treta", "Dvapara", "Sama"]), correctAnswer: "Sama" },
          { text: "What is the ultimate goal of Yoga?", options: JSON.stringify(["Physical Fitness", "Mental Peace", "Union with the Divine", "Stress Relief"]), correctAnswer: "Union with the Divine" },
          { text: "Who is the mother of the Pandavas?", options: JSON.stringify(["Gandhari", "Kunti", "Draupadi", "Kaikeyi"]), correctAnswer: "Kunti" },
          { text: "In which battle was the Bhagavad Gita spoken?", options: JSON.stringify(["Battle of Lanka", "Battle of Panipat", "Battle of Kurukshetra", "Battle of Plassey"]), correctAnswer: "Battle of Kurukshetra" }
        ]
      }
    }
  });
  
  // Seed default deities for DivineStack
  await prisma.divineDeity.createMany({
    data: [
      { name: "Sri Krishna", info: "The Supreme Personality of Godhead, speaker of the Bhagavad Gita and Lord of Dwarka.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Lord_Krishna_with_cow.jpg/400px-Lord_Krishna_with_cow.jpg", color: "from-blue-600 to-indigo-900" },
      { name: "Sri Rama", info: "The ideal King and embodiment of Dharma. Avatar of Vishnu and Lord of Ayodhya.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Rama_with_bow.jpg/400px-Rama_with_bow.jpg", color: "from-orange-500 to-red-700" },
      { name: "Lord Shiva", info: "The auspicious Mahadeva, Lord of Yogis and destroyer of illusion.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Shiva_Parvati_Nandi.jpg/400px-Shiva_Parvati_Nandi.jpg", color: "from-cyan-900 to-zinc-950" },
      { name: "Srimati Radharani", info: "The embodiment of divine love and the supreme devotee of Lord Sri Krishna.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Radha_Krishna.jpg/400px-Radha_Krishna.jpg", color: "from-rose-400 to-pink-600" },
      { name: "Narasimha Deva", info: "The half-man, half-lion avatar of Vishnu who protected the devotee Prahlada.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Narasimha_avatar.jpg/400px-Narasimha_avatar.jpg", color: "from-amber-600 to-red-900" },
    ]
  });

  console.log("✅ Seeded quiz:", quiz.id, "and 5 deities.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
