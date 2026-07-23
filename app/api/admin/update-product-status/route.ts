import { auth } from "@/auth";
import connectDb from "@/lib/connectDb";
import { sendProductStatusEmail } from "@/lib/mailer";
import { enqueueProductApprovalEmail } from "@/lib/queue";

import Product from "@/models/product.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    // ✅ Check Admin Session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const adminUser = await User.findById(session.user.id);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { message: "Only admin can approve products" },
        { status: 403 }
      );
    }

    // ✅ Body Data
    const { productId, status, rejectedReason } = await req.json();

    if (!productId || !status) {
      return NextResponse.json(
        { message: "productId and status are required" },
        { status: 400 }
      );
    }

    // ✅ Find Product
    const product = await Product.findById(productId).populate("vendor");

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const vendor = await User.findById(product.vendor);

    // ✅ UPDATE LOGIC (SAME AS VENDOR)
    if (status === "approved") {
      product.verificationStatus = "approved";
      product.isActive = true;
      product.approvedAt = new Date();
      product.rejectedReason = undefined;
    }

    if (status === "rejected") {
      product.verificationStatus = "rejected";
      product.isActive = false;
      product.rejectedReason = rejectedReason || "Rejected by Admin";
    }

    if (status === "approved" || status === "rejected") {
      const emailPayload = {
        email: vendor?.email,
        name: vendor?.name || "Vendor",
        productName: product.title,
        status,
        rejectedReason: product.rejectedReason,
        sendDirectly: true,
      };

      if (vendor?.email) {
        try {
          await sendProductStatusEmail(emailPayload);
          console.log("[ROUTE] Direct product status email sent", {
            status,
            email: vendor.email,
            productId,
          });
        } catch (directEmailError) {
          console.error("Direct product status email failed", directEmailError);
        }

        try {
          await enqueueProductApprovalEmail(emailPayload);
        } catch (emailError) {
          console.error("Failed to queue product status email", emailError);
        }
      }
    }

    await product.save();

    return NextResponse.json(
      { message: "Product status updated", product },
      { status: 200 }
    );
  } catch (error) {
    console.error("PRODUCT APPROVAL ERROR:", error);
    return NextResponse.json(
      { message: "Product approval error", error },
      { status: 500 }
    );
  }
}
