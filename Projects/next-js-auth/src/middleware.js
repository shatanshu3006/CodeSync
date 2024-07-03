import { NextResponse } from "next/server";
export async function middleware(req){
    const cookie=req.cookies.get('token');

    if(!cookie && req.url.includes("/profile")){
        return NextResponse.redirect(new URL('/login',req.url))
    }
}