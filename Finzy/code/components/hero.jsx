"use client";
// 1st module dashboard
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";

// Dynamic Pages
const HeroSection = () => {
  // client component add
  const imageRef = useRef();
  // this code add for banner simulation
  useEffect(() => {
    const imageElement = imageRef.current;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    // Hero section start from here
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-5xl lg:text-[70px] pb-6 gradient gradient-title">
          Take Control of Your Finances
          <br /> with AI Insights
        </h1>
        <p className="text-base italic text-gray-600 mb-8 max-w-2xl mx-auto">
          Track your income and expenses effortlessly with AI-powered insights
          that help you understand your spending habits, predict future costs
          and make smarter financial decisions every day
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-black text-white px-8 py-3 rounded-xl
hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)]
hover:-translate-y-0.5
transition-all duration-300"
            >
              Get Started
            </Button>
          </Link>

          <Link href="/">
            <Button
              size="lg"
              className="px-8 py-3 rounded-xl
hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)]
hover:-translate-y-0.5
transition-all duration-300"
              variant="outline"
            >
              Github Repo
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner.png"
              alt="Dashboard Preview"
              width={1080}
              height={720}
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
