"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Shield, Calendar, Hash, Receipt } from "lucide-react";

type ReceiptResponse = {
  enrollment: {
    id: number;
    createdAt: string;
    paid: boolean;
    course: {
      id: number;
      title: string;
      description?: string | null;
      price: number;
      pricingType: string;
      timeslot?: string | null;
      startDate?: string | null;
    };
    payment?: {
      provider: string;
      providerId?: string | null;
      amount: number;
      status: string;
      createdAt: string;
    } | null;
    user: {
      id: number;
      email: string;
      name?: string | null;
    };
  };
};

export default function ReceiptPage() {
  const router = useRouter();
  const params = useParams<{ enrollmentId: string }>();

  const enrollmentId = useMemo(() => Number(params?.enrollmentId), [params]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReceiptResponse | null>(null);

  useEffect(() => {
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
    if (!user?.id) {
      router.replace("/login");
      return;
    }

    if (!enrollmentId || Number.isNaN(enrollmentId)) {
      setError("Invalid receipt id");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/payment/receipt?enrollmentId=${enrollmentId}&userId=${user.id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load receipt");
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load receipt");
      } finally {
        setLoading(false);
      }
    })();
  }, [enrollmentId, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border rounded-[2.5rem] p-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Receipt className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-black uppercase tracking-widest text-foreground/50">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border rounded-[2.5rem] p-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
            <XCircle className="w-6 h-6 text-destructive" />
          </div>
          <h1 className="text-2xl font-black mb-2">Receipt unavailable</h1>
          <p className="text-sm text-foreground/60 font-medium">{error || "Could not load receipt."}</p>
          <div className="mt-8 flex gap-3 justify-center">
            <button
              onClick={() => router.push("/dashboard/enrolled")}
              className="px-6 py-3 rounded-2xl font-black bg-primary text-white"
            >
              Go to Enrolled
            </button>
            <button
              onClick={() => router.push("/courses")}
              className="px-6 py-3 rounded-2xl font-black bg-white/70 dark:bg-zinc-900/40 border border-border"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const enrollment = data.enrollment;
  const payment = enrollment.payment;

  const status = payment?.status || (enrollment.paid ? "success" : "pending");
  const isSuccess = enrollment.paid && status === "success";

  const formattedDate = new Date(payment?.createdAt || enrollment.createdAt).toLocaleString();
  const amountRupees = payment?.amount ?? Math.round(enrollment.course.price || 0);

  return (
    <div className="min-h-screen px-6 md:px-12 py-14">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em]">
              <Shield className="w-3.5 h-3.5" />
              Payment Receipt
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-4">DharmaVeda Receipt</h1>
            <p className="text-foreground/60 font-medium mt-2">A professional record of your course initiation.</p>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest border ${
            isSuccess
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
              : "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20"
          }`}>
            {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
            {isSuccess ? "Payment Successful" : "Payment Pending"}
          </div>
        </div>

        <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border rounded-[2.75rem] overflow-hidden">
          <div className="p-10 md:p-12 border-b border-border">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">{enrollment.course.title}</h2>
            {enrollment.course.description ? (
              <p className="mt-3 text-foreground/60 font-medium leading-relaxed">{enrollment.course.description}</p>
            ) : null}

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-border bg-white/50 dark:bg-zinc-950/20 p-6">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground/50">
                  <Hash className="w-4 h-4" />
                  Receipt / Enrollment ID
                </div>
                <div className="mt-2 text-lg font-black">#{enrollment.id}</div>
              </div>

              <div className="rounded-3xl border border-border bg-white/50 dark:bg-zinc-950/20 p-6">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground/50">
                  <Calendar className="w-4 h-4" />
                  Date
                </div>
                <div className="mt-2 text-lg font-black">{formattedDate}</div>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-12 grid md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-border bg-white/50 dark:bg-zinc-950/20 p-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground/60">Payer</h3>
              <div className="mt-4 space-y-1">
                <div className="text-lg font-black">{enrollment.user.name || "Seeker"}</div>
                <div className="text-sm text-foreground/60 font-medium">{enrollment.user.email}</div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-white/50 dark:bg-zinc-950/20 p-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground/60">Payment</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/60 font-semibold">Amount</span>
                  <span className="text-lg font-black">₹{amountRupees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/60 font-semibold">Provider</span>
                  <span className="text-sm font-black uppercase tracking-widest">{payment?.provider || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/60 font-semibold">Transaction ID</span>
                  <span className="text-sm font-black">{payment?.providerId || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/60 font-semibold">Status</span>
                  <span className="text-sm font-black uppercase tracking-widest">{status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-10 md:px-12 pb-12">
            <div className="rounded-3xl bg-primary/10 border border-primary/20 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-primary">Next steps</div>
                <div className="text-sm font-semibold text-foreground/70 mt-1">
                  {isSuccess
                    ? "You can access your course from Enrolled." 
                    : "Complete payment to unlock course access."}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/dashboard/enrolled")}
                  className="px-6 py-3 rounded-2xl font-black bg-primary text-white"
                >
                  Go to Enrolled
                </button>
                <button
                  onClick={() => router.push("/courses")}
                  className="px-6 py-3 rounded-2xl font-black bg-white/70 dark:bg-zinc-900/40 border border-border"
                >
                  Browse Courses
                </button>
              </div>
            </div>

            <p className="mt-6 text-xs text-foreground/50 font-semibold">
              This receipt is generated automatically from your transaction record.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
