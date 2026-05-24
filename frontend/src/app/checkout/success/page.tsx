'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <CheckCircle className="w-20 h-20 text-[#004d40] mb-6" />
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Thank you for shopping with us. Your order has been received and is being processed.
      </p>
      
      {orderId && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 inline-block w-full max-w-md">
          <p className="text-xs text-gray-500 uppercase font-medium mb-1">Order Number</p>
          <p className="font-mono text-gray-900 font-bold">{orderId}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button 
          onClick={() => router.push('/dashboard')} 
          className="bg-[#004d40] text-white px-8 py-3 rounded-full font-bold hover:bg-[#00332a] transition-colors"
        >
          View Order History
        </button>
        <button 
          onClick={() => router.push('/')} 
          className="bg-white border border-[#004d40] text-[#004d40] px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default function SuccessStep() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#004d40]"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
