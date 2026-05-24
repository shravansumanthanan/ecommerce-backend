'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Trash2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (productId: string) => {
    try {
      await api.delete(`/cart/${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await api.post('/order/checkout', {});
      router.push(`/checkout/success?order_id=${res.data.order_id}`);
    } catch (err: any) {
      alert(err.message || 'Checkout failed');
    }
  };

  if (loading) return <div className="flex justify-center py-20 bg-[#0d0d0d] min-h-screen"><div className="animate-spin rounded-none h-12 w-12 border-4 border-[#1a1a1a] border-t-[#F95724]"></div></div>;

  const items = cart?.items || [];
  const total = items.reduce((sum: number, item: any) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <div className="w-full bg-[#0d0d0d] min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-start mb-16 border-b border-[#ffffff]/10 pb-8">
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase mr-4">Active<br/>Manifest</h1>
          <div className="flex flex-col mt-2 border-l border-[#F95724] pl-4">
             <span className="text-sm font-bold uppercase tracking-widest text-[#F95724]">SYS_CART</span>
             <span className="text-xs uppercase tracking-wider text-[#808080] mt-1">{items.length} Modules Selected</span>
          </div>
        </div>
        
        {items.length === 0 ? (
          <div className="border border-[#ffffff]/10 bg-[#1a1a1a] p-16 text-center">
            <p className="text-xl text-[#808080] mb-8 uppercase font-bold tracking-widest">Manifest is Empty</p>
            <Link href="/" className="inline-flex items-center text-[#F95724] hover:text-[#d84618] font-bold uppercase tracking-widest transition-colors">
              Return to Storefront <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item: any) => (
                <div key={item.product_id} className="flex flex-col sm:flex-row items-center border border-[#ffffff]/10 bg-[#0d0d0d] p-6 hover:border-[#F95724]/30 transition-colors">
                  <div className="w-full sm:w-32 h-32 bg-[#1a1a1a] flex-shrink-0 relative overflow-hidden mb-4 sm:mb-0">
                    {item.product?.image_url ? (
                      <img src={item.product.image_url} alt={item.product?.name} className="object-cover w-full h-full mix-blend-luminosity opacity-70" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center border border-[#ffffff]/5">
                        <div className="w-2 h-2 bg-[#F95724] rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="sm:ml-8 flex-grow w-full text-center sm:text-left">
                    <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">{item.product?.name || 'Unknown Module'}</h3>
                    <p className="text-[#808080] text-xs uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                    <p className="text-xl font-black text-white tracking-tighter sm:mb-4">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => removeItem(item.product_id)}
                      className="text-[#808080] hover:text-[#F95724] transition-colors p-2 border border-transparent hover:border-[#F95724]/20"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="border border-[#ffffff]/10 bg-[#0d0d0d] p-8 sticky top-24">
                <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 pb-6 border-b border-[#ffffff]/10">Transaction Summary</h2>
                
                <div className="space-y-4 mb-8 text-sm font-bold uppercase tracking-widest">
                  <div className="flex justify-between text-[#808080]">
                    <span>Subtotal</span>
                    <span className="text-white">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#808080]">
                    <span>Processing</span>
                    <span className="text-white">Calculated at Checkout</span>
                  </div>
                  <div className="border-t border-[#ffffff]/10 pt-4 mt-4 flex justify-between items-end">
                    <span className="text-[#808080]">Total Value</span>
                    <span className="text-4xl font-black text-white tracking-tighter">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#F95724] hover:bg-[#d84618] text-white font-bold uppercase tracking-widest py-4 flex items-center justify-center transition-colors shadow-[0_0_20px_rgba(249,87,36,0.2)]"
                >
                  Execute Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
