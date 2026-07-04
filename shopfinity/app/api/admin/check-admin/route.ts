
import connectDb from "@/lib/connectDb";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
    try{
          await connectDb();

  const admin = await User.findOne({ role: "admin" });

  return NextResponse.json({
    exists: !!admin,
  });


    }catch(err){
        return NextResponse.json({
            message:`check-admin error ${err}`
        },{status:500})

    }

}
