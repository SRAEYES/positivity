"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SplitLoginCard() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })
            if (res.ok) {
                router.push("/") // Redirect to dashboard
            } else {
                console.error("Login failed")
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden bg-white border dark:bg-gray-800">
                
                {/* Left Side: Welcome + Illustration */}
                <div className="md:w-1/2 bg-[#8371F5] dark:bg-blue-600 text-white flex flex-col items-center justify-center p-8">
                    <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                    <p className="mb-6 text-center">Sign in to continue to your dashboard and enjoy seamless experience.</p>
                </div>

                {/* Right Side: Login Form */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-semibold mb-6">Sign In</h3>
                    
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="mt-1" required />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" className="mt-1" required />
                        </div>

                        <Button type="submit" className="mt-6 w-full">Login</Button>
                    </form>

                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-300 text-center">
                        Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
