"use client";

import { useEffect, useState } from "react";
import { BookOpen, Calendar, Clock, Users, ArrowRight, Sparkles, Loader2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Course {
  id: number;
  title: string;
  thumbnail?: string;
  timeslot?: string;
  wpLink?: string;
  gcrLink?: string;
  description?: string;
  startDate?: string;
  price?: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);

  useEffect(() => {
    async function loadData() {
      const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
      
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          fetch("/api/courses"),
          user.id ? fetch(`/api/enrollments?userId=${user.id}`).then(res => res.json()) : Promise.resolve({ enrollments: [] })
        ]);

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData.courses || []);
        }

        if (enrollmentsRes.enrollments) {
          // Track all enrollments to show proper status (Wise Path Enrolled)
          setEnrolledCourses(enrollmentsRes.enrollments.map((e: any) => e.courseId) || []);
        }
      } catch (e) {
        console.error("Data load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleEnroll = async (course: Course) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
        alert("Please login to proceed with initiation.");
        return;
    }

    if (!course.price || course.price === 0) {
        // Free course, direct enrollment
        const res = await fetch("/api/enroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, courseId: course.id }),
        });
        if (res.ok) {
            setEnrolledCourses([...enrolledCourses, course.id]);
            // Redirect or show success
        } else {
            const data = await res.json();
            alert(data.error || "Enrollment failed");
        }
        return;
    }

    // Paid course, trigger Razorpay
    try {
        const orderRes = await fetch("/api/payment/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                userId: user.id, 
                courseId: course.id, 
                amount: course.price 
            }),
        });
        
        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order");

        const resScript = await loadRazorpay();
        if (!resScript) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SRSOudExcBg1uY",
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Divine Wisdom Portal",
            description: `Initiation into ${course.title}`,
            image: "/logo.png",
            order_id: orderData.orderId,
            handler: async function (response: any) {
                const verifyRes = await fetch("/api/payment/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        enrollmentId: orderData.enrollmentId
                    }),
                });

                const verifyData = await verifyRes.json();
                if (verifyRes.ok && verifyData.success) {
                    setEnrolledCourses([...enrolledCourses, course.id]);
                } else {
                    alert("Payment verification failed. Please contact support.");
                }
            },
            prefill: {
                name: user.name,
                email: user.email,
            },
            theme: {
                color: "#f4c430", // Saffron color
            },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on("payment.failed", function (response: any) {
            alert("Payment failed: " + response.error.description);
        });
        paymentObject.open();

    } catch (e: any) {
        alert(e.message || "An error occurred during payment");
    }
  };

  const handleUnenroll = async (courseId: number) => {
    if (!confirm("Are you sure you want to drop this path of wisdom?")) return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const res = await fetch("/api/enroll", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, courseId }),
    });
    if (res.ok) {
      setEnrolledCourses(enrolledCourses.filter(id => id !== courseId));
    } else {
      alert("De-enrollment failed");
    }
  };

  return (
    <div className="min-h-screen pb-20">
      
      {/* Premium Header Section */}
      <div className="relative pt-20 pb-20 px-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent z-0"></div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Vedic Academy
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter mb-6 italic">
            Paths of <span className="text-primary italic">Wisdom</span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto font-medium leading-relaxed">
            "Knowledge is that which liberates." Explore our curated courses designed to illuminate your spiritual journey.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-foreground/40 font-black uppercase tracking-widest text-sm">Divine Knowledge is loading...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {courses.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white/40 dark:bg-zinc-800/40 backdrop-blur-xl rounded-[3rem] border border-dashed border-primary/20">
                <p className="text-foreground/40 font-black italic">No paths are currently revealed.</p>
              </div>
            ) : (
              courses.map((course, idx) => (
                <motion.div 
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-white/80 dark:bg-zinc-800/80 backdrop-blur-2xl px-6 py-6 rounded-[3.5rem] shadow-2xl shadow-black/[0.03] border border-white dark:border-white/5 flex flex-col h-full overflow-hidden"
                >
                  <div className="relative h-64 w-full mb-8 rounded-[2.5rem] overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-primary opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  <div className="flex-1 flex flex-col px-2">
                    <h2 className="text-2xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">{course.title}</h2>
                    
                    {course.description && (
                      <p className="text-foreground/60 mb-8 line-clamp-3 text-sm font-medium leading-relaxed">
                        {course.description}
                      </p>
                    )}

                    <div className="space-y-4 mb-10">
                      {course.startDate && (
                        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest opacity-40">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>Starts {new Date(course.startDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {course.timeslot && (
                        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest opacity-40">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{course.timeslot}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm font-black text-primary">
                        <Sparkles className="w-4 h-4" />
                        <span>{course.price && course.price > 0 ? `Offer: ₹${course.price}` : "Divine Offering (Free)"}</span>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-4">
                      {enrolledCourses.includes(course.id) ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-primary bg-primary/10 px-6 py-3 rounded-2xl">
                             <Sparkles className="w-5 h-5" />
                             <span className="text-sm font-black uppercase tracking-tighter">Wisdom Path Enrolled</span>
                          </div>
                          
                          <div className="flex gap-4">
                            {course.wpLink && (
                              <a href={course.wpLink} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-xs font-black uppercase tracking-tighter hover:bg-primary hover:text-white transition-all">
                                WhatsApp
                              </a>
                            )}
                            <button 
                              onClick={() => handleUnenroll(course.id)}
                              className="w-12 h-12 flex items-center justify-center bg-destructive/10 text-destructive rounded-2xl hover:bg-destructive hover:text-white transition-all"
                              title="Drop Course"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course)}
                          className="w-full flex items-center justify-center gap-3 h-16 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                          Enroll Now <ArrowRight className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

