import { NextRequest, NextResponse } from "next/server";

import Order from "@/models/order.model";
import connectDb from "@/lib/connectDb";
import { enqueueOrderStatusEmail } from "@/lib/queue";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { message: "orderId is required" },
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

    if (order.orderStatus !== "return_approved") {
      return NextResponse.json(
        { message: "Return must be approved before refund can be completed" },
        { status: 400 }
      );
    }

    let returnedAmount = 0;

    for (const item of order.products) {
      returnedAmount += item.price * item.quantity;
    }

    order.orderStatus = "returned";
    order.returnedAmount = returnedAmount;
    order.refundedAt = new Date();

    await order.save();

    const email = (order as any).buyer?.email || (order as any).address?.email;
    if (email) {
      try {
        await enqueueOrderStatusEmail({
          email,
          name: order.address?.name || (order as any).buyer?.name || "Customer",
          orderId: order._id.toString(),
          status: "returned",
        });
      } catch (emailError) {
        console.error("Failed to queue refund completion email", emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Refund completed",
        returnedAmount,
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Complete refund error:", error);
    return NextResponse.json(
      { message: "Failed to complete refund" },
      { status: 500 }
    );
  }
}