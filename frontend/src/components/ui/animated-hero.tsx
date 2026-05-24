"use client";

import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function Hero() {
  return (
    <div className="relative w-full bg-[#f2f2f2] text-[#0d0d0d] pt-32 pb-48 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="flex flex-col space-y-6 z-10">
            <div className="text-sm font-bold uppercase tracking-widest text-[#808080] mb-2 flex items-center space-x-4">
              <span>01</span>
              <span className="w-12 h-[1px] bg-[#0d0d0d]"></span>
              <span>Available Now</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none">
              NXS-01
            </h1>
            <p className="text-xl md:text-2xl font-medium tracking-tight text-[#0d0d0d]/80 uppercase mt-[-10px]">
              The Ultimate E-Commerce Engine
            </p>
            
            <p className="text-sm md:text-base leading-relaxed tracking-wide text-[#808080] max-w-md mt-8 border-l border-[#0d0d0d]/20 pl-4">
              A POWERFUL EXPERIENCE ENGINE DESIGNED TO TRANSFORM 
              YOUR DIGITAL STOREFRONT INTO PURE INSTINCT.
            </p>
            
            <div className="pt-8 flex items-center space-x-6">
              <Button size="lg" className="bg-[#F95724] hover:bg-[#d84618] text-white rounded-none px-8 py-6 text-sm tracking-widest uppercase font-bold">
                Order Now
              </Button>
              <div className="flex flex-col">
                <span className="text-3xl font-bold tracking-tighter">$709<span className="text-lg">.00</span></span>
                <span className="text-xs uppercase tracking-widest text-[#808080] font-bold">Base Price</span>
              </div>
            </div>
          </div>

          {/* Right Image/Graphic Column */}
          <div className="relative z-10 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-square bg-[#e5e5e5] border border-[#0d0d0d]/10 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700">
              {/* Abstract Representation of a device/product */}
              <div className="w-3/4 h-3/4 bg-[#f2f2f2] border-2 border-[#0d0d0d]/10 rounded-xl p-6 relative shadow-inner">
                <div className="w-full h-1/2 bg-[#0d0d0d] rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute w-32 h-32 border border-[#808080]/30 rounded-full"></div>
                   <div className="absolute w-4 h-4 bg-[#F95724] rounded-full bottom-4 right-4"></div>
                </div>
                <div className="grid grid-cols-4 gap-2 h-1/3">
                  <div className="bg-[#e5e5e5] rounded-full"></div>
                  <div className="bg-[#e5e5e5] rounded-full"></div>
                  <div className="bg-[#e5e5e5] rounded-full"></div>
                  <div className="bg-[#e5e5e5] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transition Shape */}
      <div className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl">
          <path d="M0 120L1440 120V60C1440 60 1100 60 900 60C850 60 830 0 720 0C610 0 590 60 540 60C340 60 0 60 0 60V120Z" fill="#0d0d0d"/>
        </svg>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold tracking-widest uppercase">
          Get Started
        </div>
      </div>
    </div>
  );
}

export { Hero };
