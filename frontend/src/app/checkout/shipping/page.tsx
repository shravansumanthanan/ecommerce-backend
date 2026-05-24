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
      <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Information</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
        <input 
          type="text" 
          value={address.fullName}
          onChange={e => setAddress({...address, fullName: e.target.value})}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition-colors"
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
        <input 
          type="text" 
          value={address.street}
          onChange={e => setAddress({...address, street: e.target.value})}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition-colors"
          placeholder="123 Shopping Blvd"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input 
            type="text" 
            value={address.city}
            onChange={e => setAddress({...address, city: e.target.value})}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition-colors"
            placeholder="New York"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
          <input 
            type="text" 
            value={address.postalCode}
            onChange={e => setAddress({...address, postalCode: e.target.value})}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition-colors"
            placeholder="10001"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Country/Region</label>
        <input 
          type="text" 
          value={address.country}
          onChange={e => setAddress({...address, country: e.target.value})}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition-colors"
          placeholder="United States"
        />
      </div>

      <div className="pt-6">
        <button type="submit" className="w-full bg-[#004d40] hover:bg-[#00332a] text-white font-bold py-4 rounded-full transition-colors">
          Proceed to Payment
        </button>
      </div>
    </form>
  );
}
