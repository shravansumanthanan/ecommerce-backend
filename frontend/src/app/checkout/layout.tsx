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
    <div className="w-full bg-[#f8f9fa] min-h-screen pt-24 pb-20 text-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Secure Checkout</h1>
          <div className="flex justify-between items-center relative px-8">
            <div className="absolute left-0 top-1/2 w-full h-[2px] bg-gray-200 -z-10"></div>
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center bg-[#f8f9fa] px-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step.active ? 'bg-[#004d40] text-white border-4 border-green-100' : 'bg-gray-200 text-gray-500'}`}>
                  {step.id === 'shipping' ? '1' : step.id === 'payment' ? '2' : '3'}
                </div>
                <span className={`mt-3 text-xs font-bold ${step.active ? 'text-[#004d40]' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {children}
        </div>

      </div>
    </div>
  );
}
