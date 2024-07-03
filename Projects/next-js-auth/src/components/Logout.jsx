import React from 'react'
import Link from 'next/link'

export const Logout = () => {
    const logout=async ()=>{
        const options={method:"GET"}
        await fetch("/api/login",options);
        window.location.reload();
    }
  return (
    <Link href="#" className='text-red-600' onClick={logout}>Logout</Link>
  )
}

export default Logout
