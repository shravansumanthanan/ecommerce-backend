'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Trash2, CreditCard, ArrowRight } from 'lucide-react';
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

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  const items = cart?.items || [];
  const total = items.reduce((sum: number, item: any) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-xl text-slate-400 mb-6">Your cart is empty.</p>
          <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
            Continue Shopping <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: any) => (
              <div key={item.product_id} className="glass p-6 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product?.image_url ? (
                      <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-700/50">
                        <span className="text-xs text-slate-500">No Img</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{item.product?.name || 'Unknown Product'}</h3>
                    <p className="text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-lg font-bold">${((item.product?.price || 0) * item.quantity).toFixed(2)}</div>
                  <button onClick={() => removeItem(item.product_id)} className="text-red-400 hover:text-red-300 p-2 bg-red-400/10 rounded-lg transition">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-xl sticky top-24">
              <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-white font-bold text-xl pt-4 border-t border-slate-700">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center transition shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              >
                <CreditCard className="mr-2 h-5 w-5" /> Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
