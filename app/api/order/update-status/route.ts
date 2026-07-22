import { NextRequest, NextResponse } from "next/server";

import Order from "@/models/order.model";
import { sendDeliveryOtpEmail } from "@/lib/mailer";
import connectDb from "@/lib/connectDb";
import { enqueueOrderStatusEmail } from "@/lib/queue";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId, status } = await req.json();

    const order = await Order.findById(orderId).populate("buyer");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (status === "confirmed" || status === "shipped") {
      if (order.orderStatus !== status) {
        order.orderStatus = status;
        await order.save();

        const email = (order.buyer as any)?.email || (order.address as any)?.email;
        if (email) {
          try {
            await enqueueOrderStatusEmail({
              email,
              name: order.address?.name || (order.buyer as any)?.name || "Customer",
              orderId: order._id.toString(),
              status,
            });
          } catch (emailError) {
            console.error("Failed to queue order status email", emailError);
          }
        }
      }
      return NextResponse.json({ message: "Status updated" });
    }

    if (status === "delivered") {
      // ✅ Guard: sirf "shipped" status se hi delivery OTP generate ho sakta hai
      if (order.orderStatus !== "shipped") {
        return NextResponse.json(
          {
            message: `Cannot generate delivery OTP from status "${order.orderStatus}"`,
          },
          { status: 400 }
        );
      }

      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      // ✅ Redis me store karo, 10 min expiry ke saath
      await redis.set(`otp:${orderId}`, otp, "EX", 600);

      const email = (order.buyer as any)?.email || (order.address as any)?.email;
      if (!email) {
        return NextResponse.json(
          { message: "Buyer email not found" },
          { status: 400 }
        );
      }

      await sendDeliveryOtpEmail(email, otp);

      return NextResponse.json({
        success: true,
        message: "OTP sent to buyer email",
      });
    }

    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}