import { NextRequest, NextResponse } from "next/server";

import Order from "@/models/order.model";
import connectDb from "@/lib/connectDb";
import { enqueueOrderStatusEmail } from "@/lib/queue";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { orderId, approve, rejectionReason } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { message: "orderId is required" },
        { status: 400 }
      );
    }

    if (typeof approve !== "boolean") {
      return NextResponse.json(
        { message: "approve must be true or false" },
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

    if (order.orderStatus !== "return_requested") {
      return NextResponse.json(
        { message: "Return request must be pending to approve/reject" },
        { status: 400 }
      );
    }

    if (!approve) {
      if (
        !rejectionReason ||
        typeof rejectionReason !== "string" ||
        !rejectionReason.trim()
      ) {
        return NextResponse.json(
          { message: "Rejection reason is required when rejecting a return" },
          { status: 400 }
        );
      }

      order.orderStatus = "return_rejected";
      order.rejectionReason = rejectionReason.trim();
      await order.save();

      const email = (order as any).buyer?.email || (order as any).address?.email;
      if (email) {
        try {
          await enqueueOrderStatusEmail({
            email,
            name: order.address?.name || (order as any).buyer?.name || "Customer",
            orderId: order._id.toString(),
            status: "return_rejected",
          });
        } catch (emailError) {
          console.error("Failed to queue return rejection email", emailError);
        }
      }

      return NextResponse.json(
        {
          success: true,
          message: "Return rejected",
          order,
        },
        { status: 200 }
      );
    }

    order.orderStatus = "return_approved";
    order.rejectionReason = null;
    await order.save();

    const email = (order as any).buyer?.email || (order as any).address?.email;
    if (email) {
      try {
        await enqueueOrderStatusEmail({
          email,
          name: order.address?.name || (order as any).buyer?.name || "Customer",
          orderId: order._id.toString(),
          status: "return_approved",
        });
      } catch (emailError) {
        console.error("Failed to queue return approval email", emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Return approved",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Approve return error:", error);
    return NextResponse.json(
      { message: "Failed to approve/reject return" },
      { status: 500 }
    );
  }
}