'use client';
import Link from 'next/link';
import { ShoppingCart, User, Search, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  if (!isClient) return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white text-gray-900 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-[#004d40]" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-2xl font-bold text-[#004d40]">
                Shopcart
              </span>
            </Link>
          </div>

          {/* Center Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <button className="flex items-center font-medium text-gray-800 hover:text-[#004d40]">
              Categories <ChevronDown className="ml-1 w-4 h-4" />
            </button>
            <Link href="#" className="font-medium text-gray-800 hover:text-[#004d40]">Deals</Link>
            <Link href="#" className="font-medium text-gray-800 hover:text-[#004d40]">What's New</Link>
            <Link href="#" className="font-medium text-gray-800 hover:text-[#004d40]">Delivery</Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input 
              type="text" 
              placeholder="Search Product" 
              className="w-full bg-gray-100 rounded-full py-2.5 px-6 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#004d40]/20 transition-all"
            />
            <Search className="absolute right-4 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            <button onClick={handleAuthClick} className="flex items-center space-x-2 text-gray-800 hover:text-[#004d40] font-medium">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">Account</span>
            </button>
            
            <Link href="/cart" className="flex items-center space-x-2 text-gray-800 hover:text-[#004d40] font-medium">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}
