'use client';
import Link from 'next/link';
import { ShoppingCart, User, LogOut, Disc3 } from 'lucide-react';
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/');
  };

  if (!isClient) return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#f2f2f2] text-[#0d0d0d] border-b border-[#0d0d0d]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Disc3 className="h-6 w-6 text-[#F95724]" />
              <span className="text-xl font-black tracking-tighter uppercase">
                Nexus<span className="text-[#F95724]">Market</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-[#0d0d0d]/70 hover:text-[#F95724] transition-colors">
              Explore
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/cart" className="relative text-[#0d0d0d]/70 hover:text-[#F95724] transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
                <Link href="/dashboard" className="text-[#0d0d0d]/70 hover:text-[#F95724] transition-colors">
                  <User className="h-5 w-5" />
                </Link>
                <button onClick={handleLogout} className="text-[#0d0d0d]/70 hover:text-[#F95724] transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-[#0d0d0d]/70 hover:text-[#F95724] transition-colors">
                  Log In
                </Link>
                <Link href="/register" className="px-5 py-2 bg-[#0d0d0d] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#F95724] transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
