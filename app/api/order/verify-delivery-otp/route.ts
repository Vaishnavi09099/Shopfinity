import { NextRequest, NextResponse } from "next/server";

import Order from "@/models/order.model";
import connectDb from "@/lib/connectDb";
import { enqueueOrderStatusEmail } from "@/lib/queue";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId, otp } = await req.json();

    if (!orderId || !otp) {
      return NextResponse.json(
        { message: "orderId and otp required" },
        { status: 400 }
      );
    }

    // ✅ Redis se OTP nikaalo
    const storedOtp = await redis.get(`otp:${orderId}`);

    if (!storedOtp || storedOtp !== otp) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

   
    const order = await Order.findById(orderId).populate("buyer");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ Guard: sirf "shipped" status wale order hi delivered mark ho sakte hain
    if (order.orderStatus !== "shipped") {
      return NextResponse.json(
        {
          message: `Order cannot be marked delivered from status "${order.orderStatus}"`,
        },
        { status: 400 }
      );
    }

    // ✅ SUCCESS → MARK DELIVERED
    order.orderStatus = "delivered";
    order.isPaid = true;
    order.deliveryDate = new Date();

    await order.save();

    // ✅ OTP ka kaam khatam, Redis se hata do
    await redis.del(`otp:${orderId}`);

    const email = (order as any).buyer?.email || (order as any).address?.email;
    if (email) {
      try {
        await enqueueOrderStatusEmail({
          email,
          name: order.address?.name || (order as any).buyer?.name || "Customer",
          orderId: order._id.toString(),
          status: "delivered",
        });
      } catch (emailError) {
        console.error("Failed to queue delivered order status email", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order delivered successfully",
      deliveryDate: order.deliveryDate,
      order,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { message: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}