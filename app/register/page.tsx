"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Register() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        country: "",
        state: "",
        location: "",
        parentName: "",
        parentRel: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                router.push("/login")
            } else {
                console.error("Registration failed")
            }
        } catch (error) {
            console.error("An error occurred", error)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto shadow-lg rounded-lg overflow-hidden bg-white border dark:bg-gray-800">
                
                {/* Left Side: Welcome + Illustration */}
                <div className="md:w-1/2 bg-[#8371F5] dark:bg-blue-600 text-white flex flex-col items-center justify-center p-8">
                    <h2 className="text-3xl font-bold mb-4">Join Us!</h2>
                    <p className="mb-6 text-center">Create an account to start your learning journey and enjoy a seamless experience.</p>
                </div>

                {/* Right Side: Register Form */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-semibold mb-6">Sign Up as a Student</h3>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" type="text" placeholder="John Doe" className="mt-1" value={formData.name} onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" type="number" placeholder="18" className="mt-1" value={formData.age} onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" className="mt-1" required value={formData.email} onChange={handleChange} />
                        </div>
                        
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="********" className="mt-1" required value={formData.password} onChange={handleChange} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" type="text" placeholder="USA" className="mt-1" value={formData.country} onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="state">State</Label>
                                <Input id="state" type="text" placeholder="California" className="mt-1" value={formData.state} onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" type="text" placeholder="City or Address" className="mt-1" value={formData.location} onChange={handleChange} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="parentName">Parent's Name</Label>
                                <Input id="parentName" type="text" placeholder="Jane Doe" className="mt-1" value={formData.parentName} onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="parentRel">Parent's Relation</Label>
                                <Input id="parentRel" type="text" placeholder="Mother" className="mt-1" value={formData.parentRel} onChange={handleChange} />
                            </div>
                        </div>

                        <Button type="submit" className="mt-6 w-full">Register</Button>
                    </form>

                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-300 text-center">
                        Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log in</a>
                    </p>
                </div>
            </div>
        </div>
    )
}