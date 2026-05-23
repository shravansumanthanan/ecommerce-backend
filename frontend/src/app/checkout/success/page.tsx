'use client';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccess() {
  return (
    <div className="flex justify-center items-center py-20 px-4 min-h-[60vh]">
      <div className="glass w-full max-w-lg p-10 rounded-2xl text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-20 w-20 text-green-400" />
        </div>
        <h1 className="text-3xl font-extrabold mb-4">Order Confirmed!</h1>
        <p className="text-slate-400 mb-8">
          Thank you for your purchase. We've received your order and are getting it ready for shipment.
        </p>
        <Link href="/" className="inline-flex justify-center items-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          Continue Shopping <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
