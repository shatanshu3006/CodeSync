import React from 'react'
import Link from 'next/link'
import { cookies } from 'next/headers'
const Navbar = () => {
    const cookie=cookies().get('token')

  return (
   <nav className='bg-slate-100 py-8'>
       <div className="max-w-screen-xl mx-auto px-5 flex
       justify-between items-center" >
           <Link href="/" className='text-lg font-bold'>nxtauth</Link>


           <ul className='flex gap-3'>
               {cookie ? (
               <>
               <li>
                   <Link href="/profile">Profile</Link>
               </li>

               <li>
                   <Link href="#" className='text-red-700'>Logout</Link>
               </li>

               </>
               ): (
               <li>
                   <Link href="/login">Login</Link>
               </li>
               )
               }
           </ul>
        </div>
   </nav>
  )
}

export default Navbar
