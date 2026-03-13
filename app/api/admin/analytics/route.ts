import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all successful payments for financial trends
    const successfulPayments = await prisma.payment.findMany({
      where: { status: "success" },
      orderBy: { createdAt: "asc" },
      select: { amount: true, createdAt: true },
    });

    // Fetch all student enrollments for growth trends
    const studentEnrollments = await prisma.enrollment.findMany({
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });

    // Aggregate findings by month
    const aggregateByMonth = (data: { createdAt: Date }[]) => {
        const months: Record<string, number> = {};
        data.forEach(item => {
            const date = new Date(item.createdAt);
            const key = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
            months[key] = (months[key] || 0) + ( (item as any).amount || 1 );
        });
        return Object.entries(months).map(([name, value]) => ({ name, value }));
    };

    // Helper for time-series growth (cumulative)
    const getGrowthData = (data: { createdAt: Date }[]) => {
        const counts: Record<string, number> = {};
        let total = 0;
        data.forEach(item => {
            const date = new Date(item.createdAt);
            const key = date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
            total++;
            counts[key] = total; // Cumulative growth
        });
        return Object.entries(counts).map(([date, cumulative]) => ({ date, cumulative }));
    };

    // Helper for financial trends (daily revenue)
    const getFinancialData = (data: { amount: number, createdAt: Date }[]) => {
        const revenue: Record<string, number> = {};
        data.forEach(item => {
            const date = new Date(item.createdAt);
            const key = date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
            revenue[key] = (revenue[key] || 0) + item.amount;
        });
        return Object.entries(revenue).map(([date, amount]) => ({ date, amount }));
    };

    const growthTrend = getGrowthData(studentEnrollments);
    const financialTrend = getFinancialData(successfulPayments);

    return NextResponse.json({
        growthTrend,
        financialTrend
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Failed to generate analytics" }, { status: 500 });
  }
}
