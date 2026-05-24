'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ShoppingCart, ArrowLeft, Cpu } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
      if (!localStorage.getItem('token')) {
        const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        const existing = guestCart.find((i: any) => i.product_id === product._id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          guestCart.push({ product_id: product._id, quantity, product });
        }
        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
        toast.success('Module added to offline manifest');
      } else {
        await api.post('/cart', { product_id: product._id, quantity });
        toast.success('Module added to manifest');
      }
    } catch (err) {
      console.error(err);
      toast.error('System Error: Could not process request.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20 bg-[#0d0d0d] min-h-screen"><div className="animate-spin rounded-none h-12 w-12 border-4 border-[#1a1a1a] border-t-[#F95724]"></div></div>;
  if (!product) return <div className="text-center py-20 text-[#808080] bg-[#0d0d0d] min-h-screen font-bold uppercase tracking-widest">Product not found</div>;

  return (
    <div className="w-full bg-[#0d0d0d] min-h-screen pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center text-[#808080] hover:text-[#F95724] mb-12 transition-colors font-bold uppercase tracking-widest text-xs">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Terminal
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border border-[#ffffff]/10 p-8 md:p-12">
          {/* Image Panel */}
          <div className="bg-[#1a1a1a] border border-[#ffffff]/10 flex items-center justify-center min-h-[500px] relative overflow-hidden group">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="object-cover w-full h-full absolute inset-0 mix-blend-luminosity opacity-70 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-700" />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Cpu className="w-16 h-16 text-[#F95724] opacity-50" />
                <span className="text-[#808080] text-xs font-bold uppercase tracking-widest">No Visual Data</span>
              </div>
            )}
            
            {/* Tech Overlays */}
            <div className="absolute top-4 left-4 text-[10px] text-[#F95724] font-bold uppercase tracking-widest border border-[#F95724] px-2 py-1">
              SYS_IMG_01
            </div>
            <div className="absolute bottom-4 right-4 text-[10px] text-[#808080] font-bold uppercase tracking-widest">
              [ {product._id.slice(0, 8)} ]
            </div>
          </div>

          {/* Details Panel */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center mb-6 space-x-4">
              <span className="text-xs font-bold text-[#F95724] tracking-widest uppercase border border-[#F95724]/30 px-3 py-1 bg-[#F95724]/10">
                {product.category}
              </span>
              <span className={`text-xs font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {product.stock > 0 ? 'Systems Nominal' : 'Depleted'}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter leading-none">
              {product.name}
            </h1>
            
            <div className="flex items-baseline mb-8 mt-4 border-l-2 border-[#F95724] pl-4">
              <span className="text-4xl font-black text-white tracking-tighter">${product.price.toFixed(2)}</span>
              <span className="ml-2 text-xs text-[#808080] uppercase tracking-widest font-bold">Base Value</span>
            </div>
            
            <div className="border-t border-[#ffffff]/10 py-8 mb-8">
               <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Module Specifications</h3>
               <p className="text-[#808080] leading-relaxed text-sm">
                 {product.description}
               </p>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex items-center border border-[#ffffff]/20">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-full flex items-center justify-center text-white hover:text-[#F95724] hover:bg-[#1a1a1a] transition-colors font-bold text-xl"
                >-</button>
                <span className="w-12 text-center text-white font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-full flex items-center justify-center text-white hover:text-[#F95724] hover:bg-[#1a1a1a] transition-colors font-bold text-xl"
                >+</button>
              </div>
              <button
                onClick={addToCart}
                disabled={product.stock === 0 || adding}
                className="flex-grow bg-[#F95724] hover:bg-[#d84618] text-white font-bold uppercase tracking-widest py-6 px-8 transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(249,87,36,0.4)]"
              >
              {adding ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : product.stock > 0 ? (
                <><ShoppingCart className="mr-3 h-5 w-5" /> Initialize Checkout</>
              ) : (
                'Inventory Depleted'
              )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
