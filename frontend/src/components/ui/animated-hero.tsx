"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["something cool", "coming soon", "the future of retail", "next-gen shopping"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-32 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-2 bg-slate-900 border border-white/10 text-blue-400 hover:text-blue-300">
              NexusMarket Launch <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col items-center">
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-black flex flex-col items-center gap-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                We are building
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center h-[1.2em] text-white">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300"
                    initial={{ opacity: 0, y: "-100%" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? "-150%" : "150%",
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-slate-400 max-w-2xl text-center mt-6">
              Get ready for a premium shopping experience. We are crafting a state-of-the-art 
              e-commerce platform featuring high-performance speeds, elegant interface design, 
              and a highly curated catalog. Stay tuned for our grand opening!
            </p>
          </div>
          <div className="flex flex-row gap-3 mt-4">
            <Button size="lg" className="gap-2 border-white/10 hover:bg-white/5" variant="outline">
              Explore Preview <MoveRight className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Join the Waitlist <PhoneCall className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
