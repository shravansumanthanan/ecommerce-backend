'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Trash2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Cart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      if (!localStorage.getItem('token')) {
        const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        setCart({ items: guestCart });
        setLoading(false);
        return;
      }
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
      if (!localStorage.getItem('token')) {
        let guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        guestCart = guestCart.filter((i: any) => i.product_id !== productId);
        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
        fetchCart();
        return;
      }
      await api.delete(`/cart/${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (productId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) {
      removeItem(productId);
      return;
    }
    try {
      if (!localStorage.getItem('token')) {
        let guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        const existing = guestCart.find((i: any) => i.product_id === productId);
        if (existing) existing.quantity = newQty;
        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
        fetchCart();
        return;
      }
      await api.put(`/cart/${productId}`, { quantity: newQty });
      fetchCart();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update quantity');
    }
  };

  const handleCheckout = () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please log in to checkout');
      router.push('/login');
      return;
    }
    router.push('/checkout/shipping');
  };

  if (loading) return <div className="flex justify-center py-32 bg-[#f8f9fa] min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#004d40]"></div></div>;

  const items = cart?.items || [];
  const total = items.reduce((sum: number, item: any) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({items.length})</h1>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-16 text-center border border-gray-200 shadow-sm">
            <p className="text-xl text-gray-500 mb-6">Your cart is currently empty.</p>
            <Link href="/" className="inline-flex items-center bg-[#004d40] text-white px-6 py-3 rounded-full font-bold hover:bg-[#00332a] transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item: any) => (
                <div key={item.product_id} className="flex flex-col sm:flex-row items-center bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="w-full sm:w-32 h-32 bg-[#f5f5f5] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden mb-4 sm:mb-0 p-2">
                    <img src={item.product?.image_url || '/api/placeholder/150/150'} alt={item.product?.name} className="object-contain w-full h-full" />
                  </div>
                  
                  <div className="sm:ml-6 flex-grow w-full text-center sm:text-left">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{item.product?.name || 'Unknown Product'}</h3>
                    <p className="text-sm text-gray-500 mb-4">{item.product?.category}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start">
                      <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.quantity, -1)}
                          className="text-gray-500 hover:text-gray-900 px-2"
                        >-</button>
                        <span className="font-bold text-gray-900 mx-2 w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.quantity, 1)}
                          className="text-gray-500 hover:text-gray-900 px-2"
                        >+</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto h-full px-4">
                    <button 
                      onClick={() => removeItem(item.product_id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-2 sm:mb-8"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <p className="text-xl font-bold text-gray-900">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-green-500 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-medium text-gray-900">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-end">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#004d40] hover:bg-[#00332a] text-white font-bold py-4 rounded-full transition-colors mb-4"
                >
                  Checkout
                </button>
                <div className="flex justify-center items-center space-x-2">
                  <span className="text-xs text-gray-500">Secure Payments</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
