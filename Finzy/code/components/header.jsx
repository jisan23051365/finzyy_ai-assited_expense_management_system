// Used Claerk for middle ware User Authentication
import { SignedIn, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

const Header = async() => {
  // check user form lib.checkuser.js file/ database check
await checkUser();
  return (
    <div className="fixed top-0 w-full bg-white/93 backdrop-blur-md z-50 border-b">
      {/* Create Navigation bar */}
      <nav className="container mx-auto px-6 py-4 h-20 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt="Finzy logo"
            height={80}
            width={180}
            className="h-18 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center space-x-4">

          <SignedIn>
            {/* DashBoard  */}
            <Link href={"/dashboard"} className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
              <Button variant="outline">
                <LayoutDashboard size={18}/>
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            {/* Transaction */}
            <Link href={"/transaction/create"}>
              <Button className="flex items-center gap-2">
                <PenBox size={18}/>
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>

          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{
              elements:{
                avatarBox:"w-10 h-10"
              }
            }} />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};

export default Header;