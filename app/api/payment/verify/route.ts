import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      enrollmentId
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update enrollment and payment records
      await prisma.$transaction([
        prisma.enrollment.update({
          where: { id: enrollmentId },
          data: { paid: true },
        }),
        prisma.payment.update({
          where: { enrollmentId: enrollmentId },
          data: {
            status: "success",
            providerId: razorpay_payment_id, // Store payment ID for reference
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        enrollmentId,
        receiptPath: `/dashboard/receipt/${enrollmentId}`,
      });
    } else {
      return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
