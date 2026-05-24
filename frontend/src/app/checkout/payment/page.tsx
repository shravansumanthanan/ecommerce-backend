'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function PaymentStep() {
  const router = useRouter();
  const [payment, setPayment] = useState({
    method: 'Credit Card',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('checkout_payment');
    if (saved) setPayment(JSON.parse(saved));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payment.cardNumber || !payment.expiry || !payment.cvv) {
      toast.error('All payment fields are required.');
      return;
    }
    localStorage.setItem('checkout_payment', JSON.stringify(payment));
    router.push('/checkout/review');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
        <select 
          value={payment.method}
          onChange={e => setPayment({...payment, method: e.target.value})}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition-colors"
        >
          <option>Credit Card</option>
          <option>PayPal</option>
          <option>Shopcart Pay</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
        <input 
          type="text" 
          value={payment.cardNumber}
          onChange={e => setPayment({...payment, cardNumber: e.target.value})}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition-colors"
          placeholder="0000 0000 0000 0000"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
          <input 
            type="text" 
            value={payment.expiry}
            onChange={e => setPayment({...payment, expiry: e.target.value})}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition-colors"
            placeholder="MM/YY"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
          <input 
            type="password" 
            value={payment.cvv}
            onChange={e => setPayment({...payment, cvv: e.target.value})}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition-colors"
            placeholder="***"
          />
        </div>
      </div>

      <div className="pt-6 flex gap-4">
        <button type="button" onClick={() => router.push('/checkout/shipping')} className="w-1/3 bg-white border border-gray-300 text-gray-700 font-bold py-4 rounded-full hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button type="submit" className="w-2/3 bg-[#004d40] hover:bg-[#00332a] text-white font-bold py-4 rounded-full transition-colors">
          Review Order
        </button>
      </div>
    </form>
  );
}
