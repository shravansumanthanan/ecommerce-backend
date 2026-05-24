'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      toast.error('Please log in');
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));

    const fetchOrders = async () => {
      try {
        const res: any = await api.get('/orders');
        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load order history.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router]);

  if (loading) return <div className="flex justify-center py-32 bg-[#f8f9fa] min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#004d40]"></div></div>;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5 mr-2 text-yellow-500" />;
      case 'Processing': return <Package className="w-5 h-5 mr-2 text-blue-500" />;
      case 'Shipped': return <Truck className="w-5 h-5 mr-2 text-purple-500" />;
      case 'Delivered': return <CheckCircle className="w-5 h-5 mr-2 text-green-500" />;
      default: return <Clock className="w-5 h-5 mr-2 text-gray-500" />;
    }
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pt-24 pb-20">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-500 text-sm">
              Welcome back, <span className="font-semibold text-gray-900">{user?.username}</span>
            </p>
          </div>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="text-sm font-medium text-red-600 bg-red-50 px-6 py-2 rounded-full hover:bg-red-100 transition-colors"
          >
            Log Out
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
            Order History
          </h2>

          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
              <button 
                onClick={() => router.push('/')}
                className="text-[#004d40] font-medium hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => (
                <div key={order._id} className="border border-gray-100 rounded-lg p-6 hover:border-[#004d40]/30 transition-colors">
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Order Number</p>
                      <p className="font-mono text-sm text-gray-900">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Date Placed</p>
                      <p className="text-sm text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Total Amount</p>
                      <p className="font-bold text-gray-900">${order.total_price.toFixed(2)}</p>
                    </div>
                    <div>
                      <div className="flex items-center text-sm font-medium text-gray-900 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-3">Items</h3>
                      <div className="space-y-3">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              <span className="font-medium mr-2 text-gray-900">{item.quantity}x</span> 
                              Product <span className="font-mono text-xs">{item.product_id}</span>
                            </span>
                            <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {order.shipping_address && (
                       <div>
                         <h3 className="text-sm font-bold text-gray-900 mb-3">Shipping Address</h3>
                         <div className="text-sm text-gray-600 space-y-1">
                           <p className="font-medium text-gray-900">{order.shipping_address.fullName}</p>
                           <p>{order.shipping_address.street}</p>
                           <p>{order.shipping_address.city}, {order.shipping_address.postalCode}</p>
                         </div>
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
