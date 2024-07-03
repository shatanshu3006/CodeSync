"use client"
import React,{useState} from "react";
import Link from "next/link";
import toast,{ Toaster } from "react-hot-toast";

const Login=()=>{
    const [data,setData]=useState({email:"",password:""})

	// •	The spread operator ... is used to copy all properties from the current data object into the new state object.
	// •	This ensures that any existing properties in data are retained.
    const inputOnChange=(name,value)=>{
        setData((data)=>({
            ...data,
            [name]:value
        }))
    };
    const formSubmit= async(e)=>{
        //In this code, e.preventDefault() in the formSubmit function prevents the default form submission behavior, which would typically refresh the page. 
        //This allows the form data to be handled via JavaScript instead.
        e.preventDefault();
        // console.log(data);


        // sending the date to our api endpoints that we have defined as post and get 
        const options={method:"POST",body:JSON.stringify(data)};
        const res=await (await fetch("/api/login",options)).json();     //fetch returns a promise so we have to await it , and then we want a json as res that is also a promise so we have to await it too


        if(res['status']==='success'){
            toast.success('Login Successful')
            //and now empty the values 
            setData({email:"",password:""});

            //now we want to redairect by maybe say 1.5 second later to profile page
            setTimeout(()=>{
                window.location.href="/profile"
            },1500)
        }
        else if(res['status']==='fail'){
            toast.error("Login Failed!");
        }
    };


    return (
        <>
        <form action="" className="max-w-md bg-slate-100 p-5 rounded-lg mx-auto" onSubmit={formSubmit} >
            <div className="mb-5 ">
                <label htmlFor="email" className="block mb-3">Your Email</label>
                <input id="email" type="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required
                placeholder="name@mail.com"
                onChange={(e)=>inputOnChange('email',e.target.value.toLowerCase())}
                />

            </div>
            <div className="mb-5 ">
                <label htmlFor="password" className="block mb-3">Your Password</label>
                <input id="password" type="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required
                placeholder="Password"
                onChange={(e)=>inputOnChange('password',e.target.value)}
                />

            </div>
            
                <button type="submit" className="bg-blue-700 text-white px-5 py-3 rounded-lg w-full ">Submit</button>
            <p className="py-5 px-20">{`Don't have an account?`} <Link href='/signup' className="text-blue-700 font-medium">Sign Up</Link></p>
        </form>
        <Toaster position="bottom-right" reverseOrder={false}></Toaster>
        </>
    )
}

export default Login