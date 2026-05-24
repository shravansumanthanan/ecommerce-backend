'use client';
import { usePathname } from 'next/navigation';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (pathname.includes('/success')) {
    return <>{children}</>;
  }

  const steps = [
    { id: 'shipping', label: '1. Shipping', active: pathname.includes('/shipping') },
    { id: 'payment', label: '2. Payment', active: pathname.includes('/payment') },
    { id: 'review', label: '3. Review', active: pathname.includes('/review') }
  ];

  return (
    <div className="w-full bg-[#0d0d0d] min-h-screen pt-24 pb-12 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar */}
        <div className="mb-12 border-b border-[#ffffff]/10 pb-8">
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-6">Secure Checkout</h1>
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 w-full h-[1px] bg-[#ffffff]/10 -z-10"></div>
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center bg-[#0d0d0d] px-4">
                <div className={`w-8 h-8 flex items-center justify-center font-bold text-xs border ${step.active ? 'border-[#F95724] text-[#F95724]' : 'border-[#ffffff]/20 text-[#808080]'}`}>
                  {step.id === 'shipping' ? '01' : step.id === 'payment' ? '02' : '03'}
                </div>
                <span className={`mt-2 text-[10px] uppercase tracking-widest font-bold ${step.active ? 'text-white' : 'text-[#808080]'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#1a1a1a] border border-[#ffffff]/10 p-8">
          {children}
        </div>

      </div>
    </div>
  );
}
