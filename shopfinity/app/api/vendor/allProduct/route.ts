
import connectDb from "@/lib/connectDb";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    // ✅ sirf vendors fetch honge
    const products = await Product.find().populate("vendor","name email shopName").sort({ createdAt: -1 });

    return NextResponse.json(
        products,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch vendors",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
