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

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // ❌ Already cancelled or returned
    if (order.orderStatus === "cancelled") {
      return NextResponse.json(
        { message: "Cancelled order cannot be returned" },
        { status: 400 }
      );
    }

    if (order.orderStatus === "returned") {
      return NextResponse.json(
        { message: "Order already returned" },
        { status: 400 }
      );
    }

    // ❌ Only delivered orders can be returned
    if (order.orderStatus !== "delivered") {
      return NextResponse.json(
        { message: "Only delivered orders can be returned" },
        { status: 400 }
      );
    }

    // ✅ CALCULATE RETURNED AMOUNT (PRODUCTS ONLY)
    let returnedAmount = 0;

    for (const item of order.products) {
      returnedAmount += item.price * item.quantity;
    }

 
    order.orderStatus = "returned";
    order.returnedAmount = returnedAmount;

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
        console.error("Failed to queue returned order status email", emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order returned successfully",
        returnedAmount,
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Return order error:", error);
    return NextResponse.json(
      { message: "Failed to return order" },
      { status: 500 }
    );
  }
}
