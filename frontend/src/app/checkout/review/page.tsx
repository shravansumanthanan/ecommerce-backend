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
      localStorage.removeItem('checkout_shipping');
      localStorage.removeItem('checkout_payment');
      
      toast.success('Order placed successfully.');
      router.push(`/checkout/success?order_id=${res.data.order_id}`);
    } catch (err: any) {
      toast.error(err.message || 'Execution failed.');
      setProcessing(false);
    }
  };

  if (!cart) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#004d40]"></div></div>;

  const total = cart.items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Review Order</h2>
      
      {/* Items */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 border-b border-gray-200 pb-2">Items Summary</h3>
        {cart.items.map((item: any) => (
          <div key={item.product_id} className="flex justify-between items-center mb-4 last:mb-0">
            <div className="text-sm text-gray-900">
              <span className="font-medium">{item.product.name}</span>
              <span className="text-gray-500 ml-2">x{item.quantity}</span>
            </div>
            <div className="font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <span className="font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Summary */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 border-b border-gray-200 pb-2 flex justify-between">
            Shipping
            <button onClick={() => router.push('/checkout/shipping')} className="text-[#004d40] hover:underline text-xs capitalize">Edit</button>
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-900">{shipping?.fullName}</p>
            <p>{shipping?.street}</p>
            <p>{shipping?.city}, {shipping?.postalCode}</p>
            <p>{shipping?.country}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 border-b border-gray-200 pb-2 flex justify-between">
            Payment
            <button onClick={() => router.push('/checkout/payment')} className="text-[#004d40] hover:underline text-xs capitalize">Edit</button>
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-900">{payment?.method}</p>
            <p>**** **** **** {payment?.cardNumber?.slice(-4)}</p>
            <p>Exp: {payment?.expiry}</p>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={executeOrder} 
          disabled={processing}
          className="w-full bg-[#004d40] hover:bg-[#00332a] text-white font-bold py-4 rounded-full text-lg transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {processing ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
