'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-16">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Welcome to NexusMarket
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Discover premium products with next-generation shopping experience.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="glass rounded-2xl overflow-hidden group hover:-translate-y-1 transition duration-300">
              <div className="aspect-w-16 aspect-h-9 bg-slate-800 relative">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="object-cover w-full h-64" />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-slate-700/50">
                    <ShoppingCart className="h-12 w-12 text-slate-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                <Link href={`/products/${product._id}`} className="block w-full text-center py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition font-medium">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
