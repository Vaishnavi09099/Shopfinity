import { NextResponse } from "next/server";
import { auth } from "@/auth";

import User from "@/models/user.model";
import connectDb from "@/lib/connectDb";

export async function POST(req: Request) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {withUserId} = await req.json();

    if (!withUserId) {
      return NextResponse.json(
        { message: "with user id required" },
        { status: 400 }
      );
    }

    const user = await User.findById(session.user.id).populate(
      "chats.with",
      "name image role shopName"
    );

    const chat = user?.chats?.find(
      (c:any) => String(c.with?._id) === String(withUserId)
    );

    return NextResponse.json(chat?.messages || []);
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
