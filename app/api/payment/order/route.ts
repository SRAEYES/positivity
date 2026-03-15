import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { userId, courseId, amount } = await req.json();

    if (!userId || !courseId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Amount in Razorpay is in paise (1 INR = 100 paise)
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}_${courseId}`,
    };

    const order = await razorpay.orders.create(options);

    // Create enrollment and payment together properly
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        paid: false,
        payment: {
          create: {
            provider: "razorpay",
            providerId: order.id,
            amount: amount,
            status: "pending",
          }
        }
      },
      include: {
        payment: true
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      enrollmentId: enrollment.id
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
  }
}
