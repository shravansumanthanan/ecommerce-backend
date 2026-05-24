'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Hero } from '@/components/ui/animated-hero';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full bg-[#0d0d0d] min-h-screen">
      <Hero />
      
      {/* Intro Text Banner */}
      <div className="border-b border-[#ffffff]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="text-[#808080] text-sm uppercase tracking-widest font-bold mb-4 md:mb-0">
            NexusMarket is a high-performance<br/>
            e-commerce engine that turns<br/>
            shopping into pure instinct.
          </div>
          <div className="flex gap-4">
            <div className="w-32 h-24 bg-[#F95724] flex items-center justify-center flex-col">
              <span className="text-3xl font-black text-white">75<span className="text-lg">%</span></span>
              <span className="text-[10px] text-white/80 uppercase font-bold tracking-widest">Efficiency</span>
            </div>
            <div className="w-32 h-24 border border-[#ffffff]/10 flex items-center justify-center flex-col">
               <span className="text-3xl font-black text-white">16<span className="text-lg">%</span></span>
               <span className="text-[10px] text-[#808080] uppercase font-bold tracking-widest">Growth</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Section Header */}
        <div className="flex items-start mb-16">
          <h2 className="text-7xl font-bold tracking-tighter text-white mr-4">03<span className="text-[#F95724]">/</span></h2>
          <div className="flex flex-col mt-2">
             <span className="text-sm font-bold uppercase tracking-widest text-[#F95724]">Storefront</span>
             <span className="text-xs uppercase tracking-wider text-[#808080] mt-1">Available Products</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-none h-12 w-12 border-4 border-[#1a1a1a] border-t-[#F95724]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product._id} className="group border border-[#ffffff]/10 bg-[#0d0d0d] hover:border-[#F95724]/50 transition-colors duration-300">
                <div className="aspect-w-4 aspect-h-3 bg-[#1a1a1a] relative overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="object-cover w-full h-64 mix-blend-luminosity opacity-70 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-500" />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center">
                       <div className="w-20 h-20 border border-[#ffffff]/10 rounded-full flex items-center justify-center">
                         <div className="w-2 h-2 bg-[#F95724] rounded-full"></div>
                       </div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-[#0d0d0d] border border-[#ffffff]/10 px-2 py-1 text-xs font-bold text-white tracking-widest">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">{product.name}</h3>
                  </div>
                  <p className="text-[#808080] text-sm mb-6 line-clamp-2 uppercase tracking-wide leading-relaxed">{product.description}</p>
                  <Link href={`/products/${product._id}`} className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-white hover:text-[#F95724] transition-colors group-hover:translate-x-2 duration-300">
                    View Specs <ArrowUpRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Marquee Footer / Data Grid */}
      <div className="border-t border-[#ffffff]/10 py-20 mt-12">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-[#ffffff]/10 p-8 flex flex-col justify-between h-48">
               <h4 className="text-5xl font-black text-white tracking-tighter">&gt;230<span className="text-[#F95724]">K</span></h4>
               <p className="text-[10px] text-[#808080] uppercase tracking-widest font-bold">Active Users Globally</p>
            </div>
            <div className="border border-[#ffffff]/10 p-8 flex flex-col justify-between h-48">
               <h4 className="text-5xl font-black text-white tracking-tighter">320<span className="text-[#F95724]">+</span></h4>
               <p className="text-[10px] text-[#808080] uppercase tracking-widest font-bold">Hardware Integrations</p>
            </div>
            <div className="bg-[#F95724] p-8 flex flex-col justify-center items-center h-48 hover:bg-[#d84618] cursor-pointer transition-colors">
               <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center mb-4">
                 <div className="w-2 h-2 bg-white rounded-full"></div>
               </div>
               <p className="text-xs text-white uppercase tracking-widest font-bold text-center">Read The<br/>Full Docs</p>
            </div>
         </div>
      </div>
    </div>
  );
}
