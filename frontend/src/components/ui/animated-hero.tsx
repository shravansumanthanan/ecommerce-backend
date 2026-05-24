"use client";

import { Button } from "@/components/ui/button";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

function Hero() {
  return (
    <div className="relative w-full bg-[#1a1a1a] text-white pt-32 pb-48 overflow-hidden z-0">
      {/* Brutalist angled bottom border using clip-path */}
      <div 
        className="absolute inset-0 bg-[#f2f2f2] text-[#0d0d0d] z-0" 
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 85%)' }}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="flex flex-col space-y-6">
            <div className="text-sm font-bold uppercase tracking-widest text-[#808080] mb-2 flex items-center space-x-4">
              <span>01</span>
              <span className="w-12 h-[1px] bg-[#0d0d0d]"></span>
              <span>Available Now</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none text-[#0d0d0d] min-h-[1em] pb-2">
              <TypewriterEffect 
                words={[{ text: "NXS-01" }, { text: "NEXUSMARKET" }, { text: "BUILDING COOL THINGS" }]} 
                className="text-[#0d0d0d]" 
                cursorClassName="bg-[#0d0d0d]" 
              />
            </h1>
            <p className="text-xl md:text-2xl font-bold tracking-tight text-[#F95724] mt-[-10px] uppercase">
              Coming Soon
            </p>
            
            <p className="text-base leading-relaxed text-[#0d0d0d]/70 max-w-md mt-8 border-l-2 border-[#0d0d0d]/20 pl-4 font-medium uppercase font-mono text-sm tracking-tight">
              &gt; _SYSTEM INIT
              <br/>
              &gt; MODULES COMPILING
              <br/>
              &gt; PREPARING NEXT-GEN ECOMMERCE ENGINE...
            </p>
            
            <div className="pt-8 flex items-center space-x-6">
              <Button size="lg" className="bg-[#F95724] hover:bg-[#d84618] text-white rounded-none px-8 py-6 text-sm tracking-widest uppercase font-bold shadow-[0_0_20px_rgba(249,87,36,0.3)] border border-[#F95724]">
                Order Now
              </Button>
              <div className="flex flex-col text-[#0d0d0d]">
                <span className="text-3xl font-black tracking-tighter">$709<span className="text-lg">.00</span></span>
                <span className="text-xs uppercase tracking-widest text-[#808080] font-bold">Base Price</span>
              </div>
            </div>
          </div>

          {/* Right Image/Graphic Column */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-[#F95724]/10 blur-[100px] rounded-full z-0"></div>
            
            <div className="relative w-full max-w-lg aspect-square bg-[#0d0d0d] border border-[#ffffff]/10 flex items-center justify-center overflow-hidden shadow-2xl z-10">
              {/* Abstract Representation of a device/product */}
              <div className="w-[85%] h-[85%] border border-[#ffffff]/5 bg-[#1a1a1a] p-6 relative flex flex-col justify-between">
                <div className="w-full h-1/2 bg-[#0d0d0d] border border-[#ffffff]/5 mb-4 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute w-32 h-32 border border-[#808080]/20 rounded-full"></div>
                   <div className="absolute w-4 h-4 bg-[#F95724] rounded-full bottom-4 right-4 shadow-[0_0_10px_rgba(249,87,36,1)]"></div>
                   <div className="absolute top-2 left-2 text-[10px] text-[#808080] font-mono">SYS.CORE</div>
                </div>
                <div className="grid grid-cols-4 gap-2 h-[30%]">
                  <div className="bg-[#0d0d0d] border border-[#ffffff]/5"></div>
                  <div className="bg-[#0d0d0d] border border-[#ffffff]/5 relative"><div className="absolute top-1 left-1 w-1 h-1 bg-[#F95724] rounded-full"></div></div>
                  <div className="bg-[#0d0d0d] border border-[#ffffff]/5"></div>
                  <div className="bg-[#0d0d0d] border border-[#ffffff]/5"></div>
                </div>
              </div>
              
              {/* Decorative Tech Elements */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#F95724]"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#F95724]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Transition Label */}
      <div className="absolute bottom-4 left-8 z-10 flex items-center space-x-4">
         <div className="w-8 h-[1px] bg-[#808080]"></div>
         <span className="text-[10px] text-[#808080] font-bold tracking-widest uppercase">Scroll to Interface</span>
      </div>
    </div>
  );
}

export { Hero };
