//middleware file hai ye

import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";



export async function proxy(req: NextRequest) {
    const {pathname} = req.nextUrl;
    const publicRoutes  = ["/register","/login","/signup","/unauthorized","/api/auth","/favicon.ico","/_next"];
    if(publicRoutes.some(route=>pathname.startsWith(route))){
     return NextResponse.next();
    //is line se request aage jaegi server pr
    }
    // const session = await auth()
    // if (!session) {
    //     const loginUrl = new URL("/login", req.url);
    //     loginUrl.searchParams.set("callbackUrl", req.url);
    //     return NextResponse.redirect(loginUrl);
    // }
    // const role = session.user?.role
    // if( pathname.startsWith("/user")  && role!=="user" ){
    //     return NextResponse.redirect(new URL("/unauthorized",req.url))
    // }
    // if( pathname.startsWith("/delivery")  && role!=="deliveryBoy"  ){
    //     return NextResponse.redirect(new URL("/unauthorized",req.url))
    // }
    // if( pathname.startsWith("/admin")  && role!=="admin" ){
    //     return NextResponse.redirect(new URL("/unauthorized",req.url))
    // }

    
    return NextResponse.next();



}
export const config = {
    matcher:      "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|svg|webp|ico)$).*)",
};

//request jati hai middleware k pas fir server pr
//re----middleware---server

//login register authentication api  home ke liye middleware me kuch bhi nahi karna hai