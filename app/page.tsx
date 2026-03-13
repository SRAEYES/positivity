"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50 dark:from-black dark:via-zinc-900 dark:to-black">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-orange-700 dark:text-orange-400">
          DharmaVeda
        </h1>

        <div className="flex gap-6">
          <button
            onClick={() => router.push("/login")}
            className="text-gray-700 dark:text-gray-300 hover:text-orange-600"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 py-20 text-center">

        <h1 className="text-5xl font-bold text-gray-900 dark:text-white leading-tight">
          Discover the Wisdom of
          <span className="text-orange-600"> Sanatana Dharma</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Learn ancient spiritual knowledge, Sanskrit wisdom, meditation,
          philosophy, and Vedic culture through structured courses designed
          for the modern world.
        </p>

        <div className="flex justify-center gap-6 mt-10">

          <button
            onClick={() => router.push("/courses")}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-orange-700"
          >
            Explore Courses
          </button>

          <button
            onClick={() => router.push("/register")}
            className="border border-orange-600 text-orange-600 px-6 py-3 rounded-lg text-lg hover:bg-orange-50"
          >
            Start Learning
          </button>

        </div>

      </section>

      {/* Features Section */}

      <section className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-3 gap-10">

        <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-semibold text-orange-600">
            Vedic Knowledge
          </h3>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Learn timeless wisdom from Vedas, Upanishads, and ancient Indian
            philosophy in a structured way.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-semibold text-orange-600">
            Sanskrit Learning
          </h3>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Understand the divine language of Sanskrit and unlock deeper
            meanings of sacred texts.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-semibold text-orange-600">
            Spiritual Growth
          </h3>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Practice meditation, dharma-based living, and daily spiritual
            discipline guided by ancient traditions.
          </p>
        </div>

      </section>

      {/* About Section */}

      <section className="max-w-5xl mx-auto px-8 py-16 text-center">

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          A Global Platform for Eternal Wisdom
        </h2>

        <p className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed">
          Our mission is to bring the eternal teachings of Sanatana Dharma to
          the world. Through structured courses, spiritual guidance, and
          authentic knowledge from Indian traditions, we aim to help learners
          reconnect with timeless wisdom for modern life.
        </p>

      </section>

      {/* CTA */}

      <section className="bg-orange-600 text-white py-16 text-center">

        <h2 className="text-3xl font-bold">
          Begin Your Spiritual Journey Today
        </h2>

        <p className="mt-4 text-lg opacity-90">
          Join thousands of learners discovering ancient wisdom.
        </p>

        <button
          onClick={() => router.push("/register")}
          className="mt-6 bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          Join Now
        </button>

      </section>

      {/* Footer */}

      <footer className="text-center py-8 text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} DharmaVeda. All rights reserved.
      </footer>

    </div>
  );
}