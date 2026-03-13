import prisma from '../lib/prisma';

async function main() {
  const courses = [
    {
      title: "Bhagavad Gita for Beginners",
      thumbnail: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeslot: "Monday & Wednesday, 6:00 PM EST",
      wpLink: "https://chat.whatsapp.com/dummy",
      gcrLink: "https://classroom.google.com/dummy",
      description: "Dive deep into the timeless wisdom of the Bhagavad Gita. Learn to apply its profound spiritual lessons to modern life challenges, finding peace and clarity through dialogue and dharma.",
      startDate: new Date("2026-04-01T00:00:00Z"),
    },
    {
      title: "Vishnu Sahasranamam Chanting",
      thumbnail: "https://images.unsplash.com/photo-1575005994269-8f35c6ca86e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeslot: "Tuesday & Thursday, 7:00 AM EST",
      wpLink: "https://chat.whatsapp.com/dummy",
      gcrLink: "https://classroom.google.com/dummy",
      description: "Learn the proper pronunciation, intonation, and meaning of the 1,000 names of Lord Vishnu. Experience the calming and purifying effects of this ancient Vedic chant.",
      startDate: new Date("2026-04-05T00:00:00Z"),
    },
    {
      title: "Introduction to Meditation",
      thumbnail: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeslot: "Saturday, 8:00 AM EST",
      wpLink: "https://chat.whatsapp.com/dummy",
      gcrLink: "https://classroom.google.com/dummy",
      description: "A foundational course on various meditation techniques, including breath awareness, mantra meditation, and mindfulness. Perfect for those seeking inner silence and stress relief.",
      startDate: new Date("2026-04-10T00:00:00Z"),
    },
    {
      title: "The Yoga Sutras of Patanjali",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeslot: "Friday, 5:00 PM EST",
      wpLink: "https://chat.whatsapp.com/dummy",
      gcrLink: "https://classroom.google.com/dummy",
      description: "Explore the psychological and spiritual philosophy of Yoga. We will cover the Eight Limbs of Yoga (Ashtanga) and how to integrate them into daily practice for spiritual liberation.",
      startDate: new Date("2026-04-12T00:00:00Z"),
    },
    {
      title: "Upanishadic Wisdom",
      thumbnail: "https://images.unsplash.com/photo-1628173432168-3e4e1a0b5b25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeslot: "Sunday, 10:00 AM EST",
      wpLink: "https://chat.whatsapp.com/dummy",
      gcrLink: "https://classroom.google.com/dummy",
      description: "An overview of the major Upanishads. Discover the supreme knowledge of the self (Atman) and the universal reality (Brahman) through ancient stories and dialogues.",
      startDate: new Date("2026-04-15T00:00:00Z"),
    },
    {
      title: "Karma Yoga & Seva",
      thumbnail: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeslot: "Wednesday, 7:30 PM EST",
      wpLink: "https://chat.whatsapp.com/dummy",
      gcrLink: "https://classroom.google.com/dummy",
      description: "Learn the art of selfless action. This course explores how performing duties without attachment to the results can become a powerful path to spiritual awakening.",
      startDate: new Date("2026-04-20T00:00:00Z"),
    },
    {
      title: "Understanding Navagrahas",
      thumbnail: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeslot: "Monday, 8:00 PM EST",
      wpLink: "https://chat.whatsapp.com/dummy",
      gcrLink: "https://classroom.google.com/dummy",
      description: "A cosmic journey through Vedic Astrology. Learn about the nine planets (Navagrahas) and their profound influence on human life, spirituality, and destiny.",
      startDate: new Date("2026-04-25T00:00:00Z"),
    },
    {
      title: "Mantra Chanting & Sound Healing",
      thumbnail: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeslot: "Tuesday, 6:00 PM EST",
      wpLink: "https://chat.whatsapp.com/dummy",
      gcrLink: "https://classroom.google.com/dummy",
      description: "Discover the science of sound through Sanskrit mantras. Experience how specific vibrations can heal the body, clear the mind, and elevate human consciousness.",
      startDate: new Date("2026-05-01T00:00:00Z"),
    }
  ];

  console.log("Seeding courses...");

  for (const c of courses) {
    await prisma.course.create({
      data: c
    });
    console.log(`Created course: ${c.title}`);
  }

  console.log("Seeding complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
