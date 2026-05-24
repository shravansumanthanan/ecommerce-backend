'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ShippingStep() {
  const router = useRouter();
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('checkout_shipping');
    if (saved) setAddress(JSON.parse(saved));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.street || !address.city || !address.postalCode || !address.country) {
      toast.error('All shipping fields are required.');
      return;
    }
    localStorage.setItem('checkout_shipping', JSON.stringify(address));
    router.push('/checkout/payment');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-black uppercase tracking-wider mb-6">Shipping Data</h2>
      
      <div>
        <label className="block text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-2">Recipient Name</label>
        <input 
          type="text" 
          value={address.fullName}
          onChange={e => setAddress({...address, fullName: e.target.value})}
          className="w-full bg-[#0d0d0d] border border-[#ffffff]/10 p-4 text-sm focus:outline-none focus:border-[#F95724] transition-colors"
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-2">Street Address</label>
        <input 
          type="text" 
          value={address.street}
          onChange={e => setAddress({...address, street: e.target.value})}
          className="w-full bg-[#0d0d0d] border border-[#ffffff]/10 p-4 text-sm focus:outline-none focus:border-[#F95724] transition-colors"
          placeholder="123 Sector 4"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-2">City/Zone</label>
          <input 
            type="text" 
            value={address.city}
            onChange={e => setAddress({...address, city: e.target.value})}
            className="w-full bg-[#0d0d0d] border border-[#ffffff]/10 p-4 text-sm focus:outline-none focus:border-[#F95724] transition-colors"
            placeholder="Neo-Tokyo"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-2">Postal Code</label>
          <input 
            type="text" 
            value={address.postalCode}
            onChange={e => setAddress({...address, postalCode: e.target.value})}
            className="w-full bg-[#0d0d0d] border border-[#ffffff]/10 p-4 text-sm focus:outline-none focus:border-[#F95724] transition-colors"
            placeholder="90210"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-2">Country/Region</label>
        <input 
          type="text" 
          value={address.country}
          onChange={e => setAddress({...address, country: e.target.value})}
          className="w-full bg-[#0d0d0d] border border-[#ffffff]/10 p-4 text-sm focus:outline-none focus:border-[#F95724] transition-colors"
          placeholder="United States"
        />
      </div>

      <div className="pt-6">
        <button type="submit" className="w-full bg-[#F95724] hover:bg-[#d84618] text-white font-bold uppercase tracking-widest py-4 transition-colors">
          Proceed to Payment
        </button>
      </div>
    </form>
  );
}
