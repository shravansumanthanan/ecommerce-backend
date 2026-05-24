'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { ChevronDown, Heart, SlidersHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

  const addToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault(); // prevent link navigation if placed inside one
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        await api.post('/cart', { product_id: productId, quantity: 1 });
        toast.success('Added to Cart');
      } catch (err) {
        toast.error('Failed to add to cart');
      }
    } else {
      // Guest cart logic
      const cartStr = localStorage.getItem('guest_cart');
      let cart = cartStr ? JSON.parse(cartStr) : [];
      const existing = cart.find((i: any) => i.product_id === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ product_id: productId, quantity: 1 });
      }
      localStorage.setItem('guest_cart', JSON.stringify(cart));
      toast.success('Added to Cart (Guest)');
    }
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner */}
        <div className="bg-[#f0e8d5] rounded-xl overflow-hidden mb-12 relative flex items-center min-h-[400px]">
          <div className="w-1/2 p-12 lg:p-20 z-10">
            <h1 className="text-4xl lg:text-6xl font-bold text-[#004d40] leading-tight mb-8">
              Grab Upto 50% Off On Selected Headphone
            </h1>
            <button className="bg-[#004d40] text-white px-8 py-3 rounded-full font-medium hover:bg-[#00332a] transition-colors">
              Buy Now
            </button>
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full flex justify-end">
            <img 
              src="/images/hero.png" 
              alt="Woman listening to headphones" 
              className="h-full object-cover object-left"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between mb-12 gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {['Headphone Type', 'Price', 'Review', 'Color', 'Material', 'Offer'].map(filter => (
              <button key={filter} className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700 flex items-center hover:bg-gray-50">
                {filter} <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
              </button>
            ))}
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700 flex items-center hover:bg-gray-50">
              All Filters <SlidersHorizontal className="ml-2 w-4 h-4 text-gray-400" />
            </button>
          </div>
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700 flex items-center hover:bg-gray-50">
            Sort by <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Section Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Headphones For You!</h2>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#004d40]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl p-4 relative group hover:shadow-lg transition-shadow duration-300">
                {/* Heart Icon */}
                <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Heart className="w-4 h-4 text-gray-500" />
                </button>

                <Link href={`/products/${product._id}`} className="block">
                  {/* Image Container */}
                  <div className="bg-gray-50 rounded-lg aspect-square mb-4 flex items-center justify-center overflow-hidden p-4">
                    <img 
                      src={product.image_url || '/api/placeholder/400/400'} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 truncate pr-4">{product.name}</h3>
                    <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-3 truncate">{product.description}</p>
                  
                  {/* Stars */}
                  <div className="flex items-center mb-4">
                    <div className="flex text-green-500 text-sm">
                      ★★★★★
                    </div>
                    <span className="text-xs text-gray-500 ml-2">(121)</span>
                  </div>
                </Link>
                
                {/* Add to Cart */}
                <button 
                  onClick={(e) => addToCart(product._id, e)}
                  className="w-32 bg-white border border-gray-900 text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
