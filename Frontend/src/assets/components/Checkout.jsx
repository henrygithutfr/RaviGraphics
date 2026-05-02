import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  CreditCard,
  Truck,
  Clock,
  ShieldCheck,
  ArrowRight,
  X,
  QrCode,
  Building2,
  Banknote,
  AlertCircle,
  CheckCircle,
  Loader2,
  ShoppingBag,
  User,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import axios from "axios";

export default function Checkout() {
  const { user, cartItems, getCartTotal, clearCart } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: ""
  });
  const [formErrors, setFormErrors] = useState({});

  // Safety checks - ensure cartItems exists
  const safeCartItems = cartItems || [];
  const safeTotalAmount = getCartTotal ? getCartTotal() : 0;
  const itemCount = safeCartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.pincode.trim()) {
      errors.pincode = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = "Please enter a valid 6-digit PIN code";
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handlePlaceOrder = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    const orderPayload = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        notes: formData.notes
      },
      items: safeCartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        categorySlug: item.categorySlug,
        quantity: item.quantity,
        price: item.price,
        currency: item.currency,
        unit: item.unit,
        options: item.options || {}
      })),
      totalAmount: safeTotalAmount,
      paymentMethod: paymentMethod,
      status: "pending_payment"
    };

    try {
      const response = await axios.post("https://localhost:4001/api/orders/create", orderPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        setOrderData(response.data.order);
        setShowPaymentModal(true);
      } else {
        alert("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      alert(error.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirm = async () => {
    try {
      const response = await axios.post(`https://localhost:4001/api/orders/${orderData._id}/payment`, {
        paymentMethod: paymentMethod,
        transactionId: `TXN_${Date.now()}`
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        clearCart();
        navigate(`/order-confirmation/${orderData._id}`);
      }
    } catch (error) {
      console.error("Payment confirmation error:", error);
      alert("Payment confirmation failed. Please contact support.");
    }
  };

  // Show empty cart state
  if (safeCartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/services">
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p className="text-gray-500 mb-8">Complete your order and make payment</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              Customer Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-500" />
              Shipping Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Street address, building, apartment"
                />
                {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      formErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      formErrors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    maxLength="6"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      formErrors.pincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.pincode && <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Notes (Optional)</h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Any special instructions for your order..."
            />
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {safeCartItems.map((item) => (
                <div key={item.productId} className="flex gap-3 pb-3 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={item.image || "https://picsum.photos/50/50"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-xs text-orange-600">₹{item.price} / {item.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₹{(item.price || 0) * (item.quantity || 0)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                <span className="text-gray-900">₹{safeTotalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (GST)</span>
                <span className="text-gray-900">Included</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                <span>Total</span>
                <span className="text-orange-600">₹{safeTotalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-500"
                  />
                  <QrCode className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-gray-800">UPI / QR Code</p>
                    <p className="text-xs text-gray-500">Pay using Google Pay, PhonePe, Paytm</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-500"
                  />
                  <Building2 className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-gray-800">Bank Transfer / NEFT</p>
                    <p className="text-xs text-gray-500">Direct bank transfer</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-500"
                  />
                  <Banknote className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-gray-800">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when you receive</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Place Order • ₹{safeTotalAmount.toLocaleString()}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Secure payment guaranteed
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && orderData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
                <p className="text-sm text-gray-500">Order #{orderData.orderId}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {paymentMethod === "upi" && (
                <div className="text-center">
                  <div className="bg-white p-4 rounded-xl border-2 border-dashed border-orange-200 mb-4">
                    <div className="bg-gray-100 w-48 h-48 mx-auto flex items-center justify-center rounded-lg">
                      <QrCode className="w-32 h-32 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Scan QR code to pay</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-gray-700">UPI ID:</p>
                    <p className="text-lg font-mono font-semibold text-orange-600">ravigraphics@okhdfcbank</p>
                    <p className="text-xs text-gray-500 mt-1">Amount: ₹{safeTotalAmount.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={handlePaymentConfirm}
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    I have made the payment
                  </button>
                </div>
              )}

              {paymentMethod === "bank" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-700 mb-2">Bank Details:</p>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">Bank:</span> HDFC Bank</p>
                      <p><span className="text-gray-500">Account Name:</span> Ravi Graphics</p>
                      <p><span className="text-gray-500">Account Number:</span> 50200012345678</p>
                      <p><span className="text-gray-500">IFSC Code:</span> HDFC0001234</p>
                      <p><span className="text-gray-500">UPI ID:</span> ravigraphics@okhdfcbank</p>
                    </div>
                  </div>
                  <button
                    onClick={handlePaymentConfirm}
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    Confirm Payment
                  </button>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="text-center">
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-700">You have selected Cash on Delivery</p>
                    <p className="text-sm text-gray-500 mt-1">Pay when you receive your order</p>
                  </div>
                  <button
                    onClick={handlePaymentConfirm}
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    Confirm Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}