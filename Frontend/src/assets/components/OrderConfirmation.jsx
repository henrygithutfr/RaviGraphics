import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Package, Truck, Clock, Printer, Download, Share2 } from "lucide-react";
const API = import.meta.env.VITE_API_URL;

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${API}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrder(response.data.order);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order not found</h2>
        <Link to="/services" className="text-orange-600 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500">Thank you for your order. We'll notify you when it ships.</p>
      </div>

      {/* Order Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="text-lg font-mono font-semibold text-gray-900">{order.orderId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-xl font-bold text-orange-600">₹{order.totalAmount.toLocaleString()}</p>
          </div>
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
              order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
              order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {order.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="py-4">
          <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
          <p className="text-gray-600 text-sm">{order.customer.address}</p>
          <p className="text-gray-600 text-sm mt-1">📞 {order.customer.phone} | ✉️ {order.customer.email}</p>
        </div>
      </div>

      {/* Order Timeline */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Order Timeline</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Order Placed</p>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-400">Payment Confirmed</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-400">Order Processed</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-400">Shipped</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/my-orders">
          <button className="px-6 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
            View All Orders
          </button>
        </Link>
        <Link to="/services">
          <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
}