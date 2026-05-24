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
      toast.error('Clearance Required');
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
        toast.error('Failed to load transaction history.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router]);

  if (loading) return <div className="flex justify-center py-32 bg-[#0d0d0d] min-h-screen"><div className="animate-spin rounded-none h-12 w-12 border-4 border-[#1a1a1a] border-t-[#F95724]"></div></div>;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4 mr-2" />;
      case 'Processing': return <Package className="w-4 h-4 mr-2" />;
      case 'Shipped': return <Truck className="w-4 h-4 mr-2" />;
      case 'Delivered': return <CheckCircle className="w-4 h-4 mr-2" />;
      default: return <Clock className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <div className="w-full bg-[#0d0d0d] min-h-screen pt-24 pb-12 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-[#ffffff]/10 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">Nexus Terminal</h1>
            <p className="text-[#808080] text-xs font-bold uppercase tracking-widest">
              Operator: {user?.username} // SYS_ACCESS: GRANTED
            </p>
          </div>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="text-[10px] font-bold text-white border border-[#ffffff]/20 px-4 py-2 hover:bg-[#F95724] hover:border-[#F95724] transition-colors uppercase tracking-widest"
          >
            Log Out
          </button>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center">
            <span className="w-2 h-2 bg-[#F95724] mr-3 animate-pulse"></span>
            Transaction Log
          </h2>

          {orders.length === 0 ? (
            <div className="border border-[#ffffff]/10 bg-[#1a1a1a] p-16 text-center">
              <p className="text-sm text-[#808080] mb-2 uppercase font-bold tracking-widest">No Transactions Found</p>
              <p className="text-xs text-[#808080]">Your operational history is clear.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => (
                <div key={order._id} className="border border-[#ffffff]/10 bg-[#1a1a1a] p-6 hover:border-[#F95724]/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#ffffff]/10 pb-4 mb-4 gap-4">
                    <div>
                      <p className="text-[10px] text-[#808080] uppercase tracking-widest font-bold mb-1">Transaction ID</p>
                      <p className="font-mono text-sm">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#808080] uppercase tracking-widest font-bold mb-1">Date Logged</p>
                      <p className="font-mono text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#808080] uppercase tracking-widest font-bold mb-1">Total Value</p>
                      <p className="font-black text-[#F95724]">${order.total_price.toFixed(2)}</p>
                    </div>
                    <div>
                      <div className={`inline-flex items-center px-3 py-1 text-[10px] uppercase font-bold tracking-widest border
                        ${order.status === 'Pending' ? 'text-[#eab308] border-[#eab308]/30' : 
                          order.status === 'Delivered' ? 'text-green-500 border-green-500/30' : 
                          'text-white border-[#ffffff]/20'}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-3 border-b border-[#ffffff]/10 pb-2">Modules Acquired</h3>
                      <div className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm font-medium">
                            <span><span className="text-[#808080] mr-2">x{item.quantity}</span> Product ID: <span className="font-mono">{item.product_id}</span></span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {order.shipping_address && (
                       <div>
                         <h3 className="text-[10px] font-bold text-[#808080] uppercase tracking-widest mb-3 border-b border-[#ffffff]/10 pb-2">Drop Location</h3>
                         <div className="text-sm space-y-1">
                           <p>{order.shipping_address.fullName}</p>
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
