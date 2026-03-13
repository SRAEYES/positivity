"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, BookOpen, GraduationCap, IndianRupee, Plus, Settings, Bell, Search, Loader2, ArrowUpRight, TrendingUp, BarChart3, LineChart as LineIcon, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    revenue: 0,
  });
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({ growthTrend: [], financialTrend: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, enrollRes, analyticsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/enrollments"),
          fetch("/api/admin/analytics")
        ]);
        const statsData = await statsRes.json();
        const enrollData = await enrollRes.json();
        const analyticsData = await analyticsRes.json();

        setStats(statsData);
        setEnrollments(enrollData.enrollments || []);
        setAnalytics(analyticsData);
      } catch (e) {
        console.error("Fetch error:", e);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 md:p-12">
      
      {/* Admin Header */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest mb-4"
          >
            <Settings className="w-3 h-3" />
            Administrative Portal
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-foreground tracking-tighter"
          >
            Temple <span className="text-accent">Insight</span>
          </motion.h1>
          <p className="text-foreground/40 font-medium mt-2">Oversee the dissemination of ancient wisdom.</p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
        >
            <button 
                onClick={() => router.push("/admin/courses/create")}
                className="flex items-center gap-3 px-8 h-14 bg-accent text-white rounded-2xl font-black shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                <Plus className="w-5 h-5" /> Manifest Course
            </button>
            <button 
                onClick={() => router.push("/admin/courses")}
                className="flex items-center justify-center w-14 h-14 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-foreground/40 hover:text-accent hover:border-accent/40 transition-all"
                title="Wisdom Archives"
            >
                <BookOpen className="w-6 h-6" />
            </button>
            <button 
                onClick={() => router.push("/admin/notifications")}
                className="flex items-center justify-center w-14 h-14 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-foreground/40 hover:text-accent hover:border-accent/40 transition-all font-black"
                title="Manifest Update"
            >
                <Bell className="w-6 h-6" />
            </button>
            <button 
                onClick={() => router.push("/logout")}
                className="flex items-center justify-center w-14 h-14 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-foreground/40 hover:text-red-500 hover:border-red-500/40 transition-all"
                title="Depart Portal"
            >
                <LogOut className="w-6 h-6" />
            </button>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <StatCard label="Seekers" value={stats.totalStudents} icon={<Users />} color="accent" />
            <StatCard label="Wisdom Paths" value={stats.totalCourses} icon={<BookOpen />} color="primary" />
            <StatCard label="Initiations" value={stats.totalEnrollments} icon={<GraduationCap />} color="secondary" />
            <StatCard label="Dakshina" value={stats.revenue} icon={<IndianRupee />} isCurrency color="emerald" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-black/5"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-accent" /> Seeker Growth
                    </h3>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-20">Historical Flow</div>
                </div>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.growthTrend}>
                            <defs>
                                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3F51B5" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#3F51B5" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B', opacity: 0.8 }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B', opacity: 0.5 }}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#000', 
                                    border: 'none', 
                                    borderRadius: '16px', 
                                    fontSize: '11px', 
                                    fontWeight: '900', 
                                    color: '#fff',
                                    padding: '12px 16px'
                                }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ stroke: '#3F51B5', strokeWidth: 2 }}
                            />
                            <Area type="monotone" dataKey="cumulative" stroke="#3F51B5" strokeWidth={4} fillOpacity={1} fill="url(#colorGrowth)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-black/5"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-emerald-500" /> Financial Flow
                    </h3>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-20">Dakshina Stream</div>
                </div>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.financialTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B', opacity: 0.8 }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B', opacity: 0.5 }}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#000', 
                                    border: 'none', 
                                    borderRadius: '16px', 
                                    fontSize: '11px', 
                                    fontWeight: '900', 
                                    color: '#fff',
                                    padding: '12px 16px'
                                }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            />
                            <Bar dataKey="amount" radius={[10, 10, 0, 0]} barSize={40}>
                                {analytics.financialTrend.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#FF9933' : '#FF66CC'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Recent Enrollments */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2 bg-white dark:bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-black/5"
            >
                <div className="flex items-center justify-between mb-10 px-4">
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Recent Initiations</h2>
                    <button className="text-accent text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                        View All <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-4 pb-4 text-[10px] font-black uppercase tracking-widest opacity-30">Student</th>
                                <th className="px-4 pb-4 text-[10px] font-black uppercase tracking-widest opacity-30">Course</th>
                                <th className="px-4 pb-4 text-[10px] font-black uppercase tracking-widest opacity-30">Status</th>
                                <th className="px-4 pb-4 text-right text-[10px] font-black uppercase tracking-widest opacity-30">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50 text-sm">
                            {enrollments.slice(0, 8).map((enroll) => (
                                <tr key={enroll.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-4 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-black">
                                                {enroll.user?.name?.[0] || 'S'}
                                            </div>
                                            <div>
                                                <p className="font-black text-foreground">{enroll.user?.name || "Anonymous Seeker"}</p>
                                                <p className="text-[10px] opacity-40 uppercase tracking-tighter">{enroll.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 font-bold opacity-60 italic">{enroll.course?.title}</td>
                                    <td className="px-4 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${enroll.paid ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {enroll.paid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-6 text-right opacity-40 font-medium whitespace-nowrap">
                                        {enroll.createdAt ? new Date(enroll.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Quick Actions & Notifications */}
            <div className="space-y-10">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-accent p-8 rounded-[3rem] text-white shadow-xl shadow-accent/30 relative overflow-hidden"
                >
                    <TrendingUp className="absolute -right-4 -bottom-4 w-40 h-40 opacity-10 rotate-12" />
                    <h3 className="text-2xl font-black mb-4 tracking-tight">System Health</h3>
                    <p className="text-white/60 text-sm font-medium mb-8 leading-relaxed">
                        The platform is resonating harmoniously. All core systems operational.
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
                        <span className="text-xs font-black uppercase tracking-widest">Resonance OK</span>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-black/5"
                >
                    <h3 className="text-xl font-black mb-8 tracking-tight flex items-center gap-3">
                        <Bell className="w-5 h-5 text-accent" /> Announcements
                    </h3>
                    <div className="space-y-6">
                        <AnnouncementItem title="New Moon Session" time="2h ago" type="System" />
                        <AnnouncementItem title="Enrollment Surge" time="5h ago" type="Market" />
                        <AnnouncementItem title="Server Cleansing" time="Yesterday" type="Maintenance" />
                    </div>
                </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color, isCurrency }: any) {
    const colors: any = {
        accent: "bg-accent/10 text-accent",
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary",
        emerald: "bg-emerald-100 text-emerald-600",
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-black/[0.02] flex flex-col justify-between h-full group"
        >
            <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colors[color]}`}>
                    {icon}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-20">Live Status</div>
            </div>
            <div>
                <p className="text-4xl font-black text-foreground mb-1 tracking-tighter">
                    {isCurrency && "₹"}{value.toLocaleString()}
                </p>
                <p className="text-xs font-black uppercase tracking-widest opacity-40">{label}</p>
            </div>
        </motion.div>
    );
}

function AnnouncementItem({ title, time, type }: any) {
    return (
        <div className="flex justify-between items-start group cursor-pointer">
            <div>
                <p className="font-black text-sm text-foreground transition-colors group-hover:text-accent">{title}</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mt-1">{time} • {type}</p>
            </div>
        </div>
    );
}