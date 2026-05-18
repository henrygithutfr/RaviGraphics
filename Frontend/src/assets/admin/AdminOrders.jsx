import { useState, useEffect } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;
import { 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  FileText,
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  CreditCard,
  MessageSquare,
  Image,
  File,
  FileSpreadsheet,
  X,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminOrders() {
  const navigate = useNavigate();
    
    useEffect(() => {
      const token = localStorage.getItem("adminToken");
      const adminData = localStorage.getItem("admin");
      
      if (!token || !adminData) {
        navigate("/admin");
      }
    }, [navigate]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API}/api/admin/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Delete order function
  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`${API}/api/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      fetchOrders();
      setShowDeleteConfirm(null);
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order. Please try again.");
    }
  };

  const getStatusOptions = () => {
    return ["pending_payment", "payment_received", "processing", "design_ready", "shipped", "delivered", "cancelled"];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'processing': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'design_ready': return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'payment_received': return <DollarSign className="w-4 h-4 text-teal-500" />;
      case 'pending_payment': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Package className="w-4 h-4 text-gray-400" />;
    }
  };

  const getFileIcon = (file) => {
    if (file.mimeType?.includes('image')) {
      return <Image className="w-4 h-4 text-blue-500" />;
    } else if (file.originalName?.match(/\.(xls|xlsx)$/i)) {
      return <FileSpreadsheet className="w-4 h-4 text-green-500" />;
    } else if (file.originalName?.match(/\.(pdf)$/i)) {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else if (file.originalName?.match(/\.(psd|ai|cdr)$/i)) {
      return <File className="w-4 h-4 text-purple-500" />;
    }
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const filteredOrders = orders.filter(order => {
    if (filter !== "all" && order.status !== filter) return false;
    if (searchTerm) {
      return order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
             order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             order.customer.phone.includes(searchTerm);
    }
    return true;
  });

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
          <p className="text-sm text-gray-500 mt-1">Manage customer orders and track status</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Orders</option>
            {getStatusOptions().map(status => (
              <option key={status} value={status}>{status.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono font-semibold text-gray-900">{order.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium text-gray-900">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-lg font-bold text-orange-600">₹{order.totalAmount.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:ring-2 focus:ring-orange-500 ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'design_ready' ? 'bg-indigo-100 text-indigo-700' :
                    order.status === 'payment_received' ? 'bg-teal-100 text-teal-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {getStatusOptions().map(status => (
                    <option key={status} value={status}>{status.replace('_', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 text-gray-500 hover:text-orange-600 transition-colors"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(order)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  title="Delete Order"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="px-6 py-3 bg-white flex flex-wrap gap-4 text-sm border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span>{order.orderType === "design_only" ? "Design Only" : "Design + Print"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span>{order.items?.length || 0} item(s)</span>
              </div>
              {order.files && order.files.length > 0 && (
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-600">{order.files.length} file(s) attached</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Order</h3>
              <p className="text-gray-500 mb-4">
                Are you sure you want to delete order <strong className="font-mono">{showDeleteConfirm.orderId}</strong>?
              </p>
              <p className="text-sm text-red-600 mb-6">
                This action cannot be undone. All order data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteOrder(showDeleteConfirm._id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Order Details</h3>
                <p className="text-sm text-gray-500">{selectedOrder.orderId}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Rest of the order details modal remains the same */}
              {/* ... (keep your existing order details modal content) ... */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Type</p>
                    <p className="text-lg font-semibold text-orange-600">
                      {selectedOrder.orderType === "design_only" ? "🎨 Design Only" : "🖨️ Design + Print"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Quantity</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {selectedOrder.items?.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} pieces
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-orange-600">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      selectedOrder.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      selectedOrder.status === 'design_ready' ? 'bg-indigo-100 text-indigo-700' :
                      selectedOrder.status === 'payment_received' ? 'bg-teal-100 text-teal-700' :
                      selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedOrder.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{selectedOrder.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{selectedOrder.customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium">{selectedOrder.customer.address || "N/A"}</p>
                  </div>
                </div>
                {selectedOrder.customer.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-gray-500 text-sm">Notes</p>
                    <p className="text-sm mt-1">{selectedOrder.customer.notes}</p>
                  </div>
                )}
              </div>

              {/* Products */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-500" />
                  Products
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Attached Files */}
              {selectedOrder.files && selectedOrder.files.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Download className="w-4 h-4 text-orange-500" />
                    Attached Files ({selectedOrder.files.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file)}
                          <div>
                            <p className="text-sm font-medium text-gray-800">{file.originalName}</p>
                            <p className="text-xs text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        {file.downloadLink && (
                          <a href={file.downloadLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors">
                            Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}