'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Cpu, Search, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProductsCatalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Search & Filter State
  const [keywords, setKeywords] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keywords) params.append('keywords', keywords);
      if (category) params.append('category', category);
      if (minPrice) params.append('min_price', minPrice);
      if (maxPrice) params.append('max_price', maxPrice);
      params.append('page', page.toString());
      
      const res: any = await api.get(`/products/search?${params.toString()}`);
      // Based on interceptor, res is the backend's data object {status, data, meta}
      setProducts(res.data || []);
      if (res.meta) {
        setTotalPages(Math.ceil(res.meta.total / res.meta.per_page));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load module catalog');
    } finally {
      setLoading(false);
    }
  }, [keywords, category, minPrice, maxPrice, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchProducts();
  };

  const addToCart = async (e: React.MouseEvent, productId: string, product: any) => {
    e.preventDefault(); // Prevent navigating to the product link
    setAddingToCart(productId);
    try {
      if (!localStorage.getItem('token')) {
        const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        const existing = guestCart.find((i: any) => i.product_id === productId);
        if (existing) {
          existing.quantity += 1;
        } else {
          guestCart.push({ product_id: productId, quantity: 1, product });
        }
        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
        toast.success('Module added to offline manifest');
      } else {
        await api.post('/cart', { product_id: productId, quantity: 1 });
        toast.success('Module added to manifest');
      }
    } catch (err) {
      console.error(err);
      toast.error('System Error: Could not process request.');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="w-full bg-[#0d0d0d] min-h-screen pt-24 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-[#ffffff]/10 pb-8 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">Module Catalog</h1>
            <p className="text-[#808080] text-xs font-bold uppercase tracking-widest">Browse Available Hardware & Software</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <form onSubmit={handleSearch} className="space-y-6">
              
              {/* Search */}
              <div>
                <label className="block text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-2">Search Query</label>
                <div className="relative">
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Enter keywords..."
                    className="w-full bg-[#1a1a1a] border border-[#ffffff]/10 p-3 pl-10 text-sm text-white focus:outline-none focus:border-[#F95724] transition-colors placeholder-[#808080]/50"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-[#808080]" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-2">Category Filter</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#ffffff]/10 p-3 text-sm text-white focus:outline-none focus:border-[#F95724] transition-colors appearance-none rounded-none"
                >
                  <option value="">All Categories</option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="neural-link">Neural Link</option>
                  <option value="cybernetics">Cybernetics</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-2">Price Threshold ($)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 bg-[#1a1a1a] border border-[#ffffff]/10 p-2 text-sm text-center text-white focus:outline-none focus:border-[#F95724] transition-colors"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 bg-[#1a1a1a] border border-[#ffffff]/10 p-2 text-sm text-center text-white focus:outline-none focus:border-[#F95724] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#F95724] hover:bg-[#d84618] text-white font-bold uppercase tracking-widest text-[10px] py-3 transition-colors flex items-center justify-center border border-[#F95724]"
              >
                <Filter className="h-3 w-3 mr-2" /> Apply Filters
              </button>
            </form>
          </div>

          {/* Main Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-none h-12 w-12 border-4 border-[#1a1a1a] border-t-[#F95724]"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="border border-[#ffffff]/10 bg-[#1a1a1a] p-16 text-center">
                <p className="text-sm text-[#808080] mb-2 uppercase font-bold tracking-widest">No Modules Found</p>
                <p className="text-xs text-[#808080]">Adjust your search parameters and try again.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: any) => (
                    <Link key={product._id} href={`/products/${product._id}`} className="group block">
                      <div className="bg-[#1a1a1a] border border-[#ffffff]/10 h-full flex flex-col transition-all duration-300 hover:border-[#F95724]/50 relative overflow-hidden">
                        
                        {/* Status Label */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-[#0d0d0d] border border-[#ffffff]/10 px-2 py-1 text-[8px] font-bold tracking-widest uppercase text-[#F95724]">
                            {product.category || 'GENERIC'}
                          </span>
                        </div>

                        {/* Image Container */}
                        <div className="h-48 w-full bg-[#0d0d0d] flex items-center justify-center relative overflow-hidden border-b border-[#ffffff]/10">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="object-cover w-full h-full mix-blend-luminosity opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                            />
                          ) : (
                            <Cpu className="w-12 h-12 text-[#F95724] opacity-20 group-hover:opacity-50 transition-opacity" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-50"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2 line-clamp-1">{product.name}</h3>
                          <div className="flex justify-between items-end mt-auto pt-4">
                            <div>
                              <p className="text-[10px] text-[#808080] uppercase tracking-widest font-bold mb-1">Value</p>
                              <p className="text-2xl font-black tracking-tighter text-[#F95724]">${product.price.toFixed(2)}</p>
                            </div>
                            <button
                              onClick={(e) => addToCart(e, product._id, product)}
                              disabled={addingToCart === product._id || product.stock === 0}
                              className="text-[10px] uppercase tracking-widest font-bold text-white border border-[#ffffff]/20 px-3 py-2 hover:bg-[#F95724] hover:border-[#F95724] transition-colors disabled:opacity-50"
                            >
                              {addingToCart === product._id ? 'Processing...' : product.stock === 0 ? 'Depleted' : 'Add Module'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center space-x-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-[#ffffff]/10 text-xs font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-[#1a1a1a] transition-colors"
                    >
                      Prev
                    </button>
                    <span className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#808080]">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-[#ffffff]/10 text-xs font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-[#1a1a1a] transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
