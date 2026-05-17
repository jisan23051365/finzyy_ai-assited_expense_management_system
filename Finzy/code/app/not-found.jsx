import React from 'react'
import Link from "next/link";
import { Button } from '@/components/ui/button';

const NotFound = () => {
     return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">

      <h1 className="text-7xl font-bold text-gray-900">404</h1>

      <h2 className="text-2xl font-semibold text-gray-700 mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-500 mt-3 max-w-md">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable. Please check the URL or return to the homepage.
      </p>

      <div className="mt-6">
         <Link href="/">
        <Button className="mt-6 rounded-xl bg-black px-6 py-3 text-white font-medium transition hover:bg-gray-800">
          Return Home
        </Button>
      </Link>
      </div>

    </div>
  );
 
}

export default NotFound