import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Package, Eye, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function MyOrders() {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token || !user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 401) {
          // Token expired, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  // If not logged in, show login prompt
  if (!user && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Login to view orders</h2>
        <p className="text-gray-500 mb-6">Please login to see your order history</p>
        <button 
          onClick={() => openAuthModal('login')}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Login / Sign Up
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
        <Link to="/services">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
            Start Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
      <p className="text-gray-500 mb-8">Track and manage your orders</p>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono font-semibold text-gray-900">{order.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-lg font-bold text-orange-600">₹{order.totalAmount.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <Link to={`/order-confirmation/${order._id}`}>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </Link>
            </div>

            {/* Order Items Preview */}
            <div className="px-6 py-4">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {order.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 min-w-[200px]">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden">
                      <img src={item.image || "https://picsum.photos/40/40"} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex items-center justify-center bg-gray-50 rounded-lg p-2 min-w-[80px]">
                    <p className="text-sm text-gray-500">+{order.items.length - 3} more</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Status helper functions
const getStatusIcon = (status) => {
  switch (status) {
    case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />;
    case 'processing': return <Clock className="w-5 h-5 text-blue-500" />;
    case 'payment_received': return <CheckCircle className="w-5 h-5 text-teal-500" />;
    case 'pending_payment': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    default: return <Package className="w-5 h-5 text-gray-400" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'shipped': return 'bg-purple-100 text-purple-700';
    case 'processing': return 'bg-blue-100 text-blue-700';
    case 'payment_received': return 'bg-teal-100 text-teal-700';
    case 'pending_payment': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-600';
  }
};