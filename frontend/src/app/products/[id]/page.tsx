'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Truck, RotateCcw } from 'lucide-react';

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);

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
        toast.success('Added to Cart (Guest)');
      } else {
        await api.post('/cart', { product_id: product._id, quantity });
        toast.success('Added to Cart');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add to cart.');
    }
  };

  const buyNow = async () => {
    await addToCart();
    router.push('/checkout/shipping');
  };

  if (loading) return <div className="flex justify-center py-32 min-h-screen bg-white"><div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#004d40]"></div></div>;
  if (!product) return <div className="text-center py-32 bg-white min-h-screen text-gray-500 font-medium">Product not found</div>;

  const colors = ['bg-red-400', 'bg-gray-800', 'bg-green-200', 'bg-gray-200', 'bg-blue-300'];
  const monthly = (product.price / 6).toFixed(2);

  return (
    <div className="w-full bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-12 flex space-x-2">
          <Link href="/">Electronics</Link>
          <span>/</span>
          <Link href="/">Audio</Link>
          <span>/</span>
          <Link href="/">Headphones</Link>
          <span>/</span>
          <span className="font-bold text-gray-900">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Images */}
          <div>
            <div className="bg-[#f5f5f5] rounded-xl flex items-center justify-center p-12 aspect-square mb-6 overflow-hidden">
              <img 
                src={product.image_url || '/api/placeholder/800/800'} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="bg-[#f5f5f5] rounded-lg p-4 aspect-square flex items-center justify-center cursor-pointer hover:border-[#004d40] border border-transparent transition-colors">
                   <img src={product.image_url || '/api/placeholder/200/200'} className="w-full h-full object-contain" />
                 </div>
               ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col pt-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4 leading-relaxed max-w-lg">{product.description}</p>
            
            <div className="flex items-center mb-8">
              <div className="flex text-green-500 text-sm">★★★★★</div>
              <span className="text-sm text-gray-500 ml-2">(121)</span>
            </div>
            
            <div className="mb-8 border-b border-gray-200 pb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ${product.price.toFixed(2)} <span className="font-normal text-xl">or {monthly}/month</span>
              </h2>
              <p className="text-sm text-gray-500">Suggested payments with 6 months special financing</p>
            </div>
            
            {/* Colors */}
            <div className="mb-8 border-b border-gray-200 pb-8">
              <h3 className="font-bold text-gray-900 mb-4">Choose a Color</h3>
              <div className="flex space-x-4">
                {colors.map((color, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`w-10 h-10 rounded-full border-2 ${selectedColor === idx ? 'border-[#004d40] p-1' : 'border-transparent'}`}
                  >
                    <div className={`w-full h-full rounded-full ${color}`}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-6 mb-12">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-gray-500 hover:text-gray-900 px-2"
                >
                  -
                </button>
                <span className="font-bold text-gray-900 mx-4 w-4 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-gray-500 hover:text-gray-900 px-2"
                >
                  +
                </button>
              </div>
              
              <div className="text-sm">
                <p>Only <span className="text-orange-500 font-bold">12 Items</span> Left!</p>
                <p className="text-gray-500">Don't miss it</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={buyNow}
                className="flex-1 bg-[#004d40] text-white px-8 py-4 rounded-full font-bold hover:bg-[#00332a] transition-colors"
              >
                Buy Now
              </button>
              <button 
                onClick={addToCart}
                className="flex-1 bg-white border border-[#004d40] text-[#004d40] px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors"
              >
                Add to Cart
              </button>
            </div>
            
            {/* Delivery Info */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-start">
                <Truck className="text-orange-500 w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Free Delivery</h4>
                  <Link href="#" className="text-sm text-gray-500 underline hover:text-[#004d40]">Enter your Postal code for Delivery Availability</Link>
                </div>
              </div>
              <div className="p-6 flex items-start">
                <RotateCcw className="text-orange-500 w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Return Delivery</h4>
                  <p className="text-sm text-gray-500">Free 30days Delivery Returns. <Link href="#" className="underline hover:text-[#004d40]">Details</Link></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
