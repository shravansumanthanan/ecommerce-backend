'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function ReviewStep() {
  const router = useRouter();
  const [shipping, setShipping] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [cart, setCart] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('checkout_shipping');
    const p = localStorage.getItem('checkout_payment');
    if (!s || !p) {
      toast.error('Incomplete data. Please finish previous steps.');
      router.push('/checkout/shipping');
      return;
    }
    setShipping(JSON.parse(s));
    setPayment(JSON.parse(p));

    api.get('/cart').then(res => setCart(res.data)).catch(() => {
      toast.error('Failed to load cart data.');
    });
  }, [router]);

  const executeOrder = async () => {
    setProcessing(true);
    try {
      const payload = {
        shipping_address: shipping,
        payment_info: payment
      };
      const res = await api.post('/checkout', payload);
      // Clean up local storage
      localStorage.removeItem('checkout_shipping');
      localStorage.removeItem('checkout_payment');
      
      toast.success('Order executed successfully.');
      router.push(`/checkout/success?order_id=${res.data.order_id}`);
    } catch (err: any) {
      toast.error(err.message || 'Execution failed.');
      setProcessing(false);
    }
  };

  if (!cart) return <div className="animate-pulse h-32 bg-[#0d0d0d]"></div>;

  const total = cart.items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-black uppercase tracking-wider mb-6">Order Review</h2>
      
      {/* Items */}
      <div className="border border-[#ffffff]/10 p-6 bg-[#0d0d0d]">
        <h3 className="text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-4 border-b border-[#ffffff]/10 pb-2">Manifest Items</h3>
        {cart.items.map((item: any) => (
          <div key={item.product_id} className="flex justify-between items-center mb-4 last:mb-0">
            <div className="text-sm">
              <span className="font-bold">{item.product.name}</span>
              <span className="text-[#808080] ml-2">x{item.quantity}</span>
            </div>
            <div className="font-bold text-[#F95724]">${(item.product.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t border-[#ffffff]/10 flex justify-between items-center">
          <span className="text-sm font-bold uppercase tracking-widest">Total Value</span>
          <span className="text-2xl font-black text-white">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Shipping Summary */}
        <div className="border border-[#ffffff]/10 p-6 bg-[#0d0d0d]">
          <h3 className="text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-4 border-b border-[#ffffff]/10 pb-2 flex justify-between">
            Shipping
            <button onClick={() => router.push('/checkout/shipping')} className="text-[#F95724] hover:underline">Edit</button>
          </h3>
          <div className="text-sm text-white space-y-1">
            <p>{shipping?.fullName}</p>
            <p>{shipping?.street}</p>
            <p>{shipping?.city}, {shipping?.postalCode}</p>
            <p>{shipping?.country}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border border-[#ffffff]/10 p-6 bg-[#0d0d0d]">
          <h3 className="text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-4 border-b border-[#ffffff]/10 pb-2 flex justify-between">
            Payment
            <button onClick={() => router.push('/checkout/payment')} className="text-[#F95724] hover:underline">Edit</button>
          </h3>
          <div className="text-sm text-white space-y-1">
            <p>{payment?.method}</p>
            <p className="tracking-widest">**** **** **** {payment?.cardNumber?.slice(-4)}</p>
            <p>Exp: {payment?.expiry}</p>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={executeOrder} 
          disabled={processing}
          className="w-full bg-[#F95724] hover:bg-[#d84618] text-white font-bold uppercase tracking-widest py-6 text-lg transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {processing ? 'Processing Transaction...' : 'Execute Transaction'}
        </button>
      </div>
    </div>
  );
}
