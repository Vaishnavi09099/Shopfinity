import { NextRequest, NextResponse } from "next/server";

import Order from "@/models/order.model";
import connectDb from "@/lib/connectDb";
import { enqueueOrderStatusEmail } from "@/lib/queue";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { orderId, reason } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { message: "orderId is required" },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== "string" || !reason.trim()) {
      return NextResponse.json(
        { message: "Return reason is required" },
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

    if (order.orderStatus !== "delivered") {
      return NextResponse.json(
        { message: "Only delivered orders can be returned" },
        { status: 400 }
      );
    }

    order.orderStatus = "return_requested";
    order.returnReason = reason.trim();
    order.rejectionReason = null;

    await order.save();

    const email = (order as any).buyer?.email || (order as any).address?.email;
    if (email) {
      try {
        await enqueueOrderStatusEmail({
          email,
          name: order.address?.name || (order as any).buyer?.name || "Customer",
          orderId: order._id.toString(),
          status: "return_requested",
        });
      } catch (emailError) {
        console.error("Failed to queue return request email", emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Return request received",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Request return error:", error);
    return NextResponse.json(
      { message: "Failed to request return" },
      { status: 500 }
    );
  }
}