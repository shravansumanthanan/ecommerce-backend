'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="border border-[#ffffff]/10 bg-[#1a1a1a] p-8 md:p-16 shadow-2xl text-center relative overflow-hidden">
      {/* Tech accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F95724] to-transparent opacity-50"></div>
      
      <div className="mb-8 flex justify-center">
        <div className="w-24 h-24 rounded-full border border-[#F95724]/30 flex items-center justify-center bg-[#F95724]/10 relative">
          <div className="absolute inset-0 rounded-full animate-ping border border-[#F95724] opacity-20"></div>
          <CheckCircle2 className="h-12 w-12 text-[#F95724]" />
        </div>
      </div>
      
      <h2 className="text-4xl font-black text-white text-center mb-4 tracking-tighter uppercase">Transaction Verified</h2>
      <p className="text-center text-[#808080] text-sm uppercase tracking-widest leading-relaxed mb-12">
        Payment successfully processed.<br/>
        Systems are preparing your modules.
      </p>

      {orderId && (
        <div className="mb-12 border-y border-[#ffffff]/10 py-6">
          <span className="block text-xs font-bold text-[#808080] uppercase tracking-widest mb-2">Order Reference Code</span>
          <code className="text-[#F95724] font-mono text-lg bg-[#0d0d0d] px-4 py-2 border border-[#F95724]/20 block max-w-xs mx-auto break-all">
            {orderId}
          </code>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-[#808080] hover:text-white font-bold uppercase tracking-widest transition-colors text-xs"
        >
          Return to Hub <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Suspense fallback={<div className="flex justify-center"><div className="animate-spin rounded-none h-12 w-12 border-4 border-[#1a1a1a] border-t-[#F95724]"></div></div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
