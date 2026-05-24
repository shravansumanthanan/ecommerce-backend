'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { username, email, password });
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border border-[#ffffff]/10 bg-[#1a1a1a] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Tech accents */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F95724] to-transparent opacity-50"></div>
          <div className="absolute top-4 left-4 w-2 h-2 bg-[#F95724] rounded-full"></div>
          
          <h2 className="text-4xl font-black text-white text-center mb-2 tracking-tighter uppercase">Registration</h2>
          <p className="text-center text-[#808080] text-xs font-bold uppercase tracking-widest mb-12">New Personnel Clearance</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#808080] uppercase tracking-widest mb-2">Designation Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#ffffff]/10 p-4 text-white focus:outline-none focus:border-[#F95724] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#808080] uppercase tracking-widest mb-2">Email Identity</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#ffffff]/10 p-4 text-white focus:outline-none focus:border-[#F95724] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#808080] uppercase tracking-widest mb-2">Security Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#ffffff]/10 p-4 text-white focus:outline-none focus:border-[#F95724] transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#F95724] hover:bg-[#d84618] text-white font-bold uppercase tracking-widest py-4 transition-colors shadow-[0_0_15px_rgba(249,87,36,0.2)] mt-8"
            >
              Establish Clearance
            </button>
          </form>
          <div className="mt-8 text-center border-t border-[#ffffff]/10 pt-8">
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-[#808080] hover:text-[#F95724] transition-colors">
              Existing Personnel? Authenticate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
