// here we create the api for endpoints 
// we will make post and get requests for the api 

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

//temporary POST and GET functions for testing
// export async function POST(){
//     return NextResponse.json({
//         message:"POST request for login"
//     })
// }

// export async function GET(){
//     return NextResponse.json({
//         message:"GET request for logout"
//     })
// }

// Actual code for API
//login 

export async function POST(req){
    
    try{
        const prisma=new PrismaClient();
        const reqBody= await req.json();
        const {email}=reqBody;
        if(!email){
            return NextResponse.json({
                status: "fail",
                message: "Email is required.",
            });
        }
        
        const result=await prisma.users.findUnique({
            where: {
                email:email,
                
            },
        });
        //console.log(result);

        if(!result){
            return NextResponse.json({
                status:"fail",
                data:reqBody,
                message:"No user found!"
            });
        }
        else{
            const expireDuration=new Date(Date.now()+12*60*60*1000);    //in milliseconds
            const cookieString=`token=${result["email"]}; expires=${expireDuration};path=/`;
            //•	The cookie string is constructed with the user’s email as the token, an expiration time of 12 hours, and a path of /, meaning it will be sent with every request to the server.
            //•	The cookie is included in the headers of the response, so it is set in the user’s browser.
            return NextResponse.json({
                status:"success",
                message:"Login Successful"
            },
            {
                headers:{"set-cookie":cookieString},
            });
        }

    }catch(error){
        return NextResponse.json({
            status:"error",
            data:error,
        });
    }
}

//logout
export async function GET(req){
    let expireDuration= new Date(Date.now-12*60*60*1000);        //in milliseconds
    const response= NextResponse.redirect(new URL('/',req.url),303);
    response.cookies.set('token','',{expires:expireDuration});
    return response;
}