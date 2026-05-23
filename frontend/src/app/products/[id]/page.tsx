'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${params.id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  const addToCart = async () => {
    setAdding(true);
    try {
      await api.post('/cart', { product_id: product._id, quantity: 1 });
      router.push('/cart');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart. Please log in first.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  if (!product) return <div className="text-center py-20 text-xl text-slate-400">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition">
        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Store
      </Link>
      
      <div className="glass rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="rounded-2xl overflow-hidden bg-slate-800/50 flex items-center justify-center min-h-[400px]">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
          ) : (
            <ShoppingCart className="h-24 w-24 text-slate-600" />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <span className="text-sm font-semibold text-blue-400 tracking-wider uppercase">{product.category}</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">{product.name}</h1>
          <div className="text-3xl font-bold text-slate-200 mb-6">${product.price.toFixed(2)}</div>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">{product.description}</p>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={addToCart}
              disabled={adding || product.stock === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition shadow-[0_0_20px_rgba(59,130,246,0.4)] flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <div className="text-sm text-slate-400 bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-700">
              <span className="block font-bold text-white">{product.stock}</span>
              in stock
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
