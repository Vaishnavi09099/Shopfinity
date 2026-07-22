import connectDb from "@/lib/connectDb"
import Order from "@/models/order.model"

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

let stripe: Stripe | null = null;

function getStripe() {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripe;
}

export async function POST(req:NextRequest){
    const sig = req.headers.get("stripe-signature")
    const rawBody = await req.text()
    let event;
    
    try {
         event = getStripe().webhooks.constructEvent(
            rawBody,sig!,process.env.STRIPE_WEBHOOK_KEY!
        )
    } catch (error) {
        console.log("signature verification failed",error)
    }

    if(event?.type === "checkout.session.completed"){
        const session = event.data.object
        await connectDb()
        await Order.findByIdAndUpdate(session?.metadata?.orderId,{
            isPaid:true
        })
    }
    return NextResponse.json({recieved:true},{status:200})
}