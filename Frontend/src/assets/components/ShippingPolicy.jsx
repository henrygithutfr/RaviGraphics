// ShippingPolicy.jsx
import { Truck, MapPin, Clock, Package, Calendar, CheckCircle, Mail, Phone, Globe, Info } from "lucide-react";
import SEO from "./SEO";

export default function ShippingPolicy() {
  return (
    <>
    <SEO 
      title="Shipping Policy | Ravi Graphics"
      description="Learn about shipping timelines, delivery process and charges for printing orders from Ravi Graphics across Odisha and India."
    />
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
            <Truck className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shipping Policy</h1>
          <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            {/* Free Shipping Notice */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-green-500 rounded-full p-1.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-green-800 font-medium">🎉 Currently offering <strong>FREE SHIPPING</strong> on all orders! No minimum purchase required.</p>
            </div>

            {/* Overview */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-orange-500" />
                Shipping Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">
                This Shipping Policy applies to all physical products ordered through Ravi Graphics under the "Design + Print" service option. Digital designs ("Only Design" service) are delivered electronically and do not require physical shipping.
              </p>
            </section>

            {/* Shipping Methods */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                Shipping Methods & Carriers
              </h2>
              <p className="text-gray-700 mb-3">
                We partner with reliable shipping carriers to ensure your printed materials arrive safely and on time. Depending on your location and order size, we may use:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Registered postal services for smaller packages</li>
                <li>Courier services like DTDC, Delhivery, or Blue Dart for faster delivery</li>
                <li>Specialized freight services for bulk orders</li>
              </ul>
            </section>

            {/* Delivery Areas */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-500" />
                Delivery Areas
              </h2>
              <p className="text-gray-700">
                We currently ship across India. For international shipping inquiries, please contact us directly through our quote request system to discuss feasibility and shipping costs.
              </p>
            </section>

            {/* Processing Time */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Order Processing Time
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700"><strong className="text-gray-900">Design Creation:</strong> After payment confirmation, we begin designing. The design timeline varies based on complexity (typically 1-5 business days).</p>
                <p className="text-gray-700"><strong className="text-gray-900">Design Approval:</strong> We send you a design proof. Your approval is required before we proceed to printing.</p>
                <p className="text-gray-700"><strong className="text-gray-900">Printing:</strong> Once approved, printing takes 2-7 business days depending on order quantity and complexity.</p>
                <p className="text-gray-700"><strong className="text-gray-900">Total Processing:</strong> Please allow 3-12 business days from payment to shipment dispatch.</p>
              </div>
            </section>

            {/* Delivery Time */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                Delivery Time
              </h2>
              <p className="text-gray-700 mb-3">After dispatch, delivery typically takes:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong className="text-gray-900">Local (within city):</strong> 1-3 business days</li>
                <li><strong className="text-gray-900">Regional (within state):</strong> 2-5 business days</li>
                <li><strong className="text-gray-900">National (across India):</strong> 3-7 business days</li>
              </ul>
              <p className="text-gray-600 text-sm mt-3 bg-amber-50 p-3 rounded-lg">
                <strong className="text-amber-800">Note:</strong> These are estimated timelines. Actual delivery may vary based on carrier performance, weather conditions, or unforeseen circumstances.
              </p>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Shipping Address
              </h2>
              <p className="text-gray-700 mb-3">
                You can provide your shipping address in two ways:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong className="text-gray-900">On Website:</strong> During checkout, you can enter your address details.</li>
                <li><strong className="text-gray-900">Via Private Communication:</strong> If you haven't provided address details on the website, we will contact you via WhatsApp or email to collect shipping information before dispatching your order.</li>
              </ul>
              <p className="text-gray-700 mt-3">
                <strong className="text-red-600">Important:</strong> Please ensure your shipping address is accurate and complete. We are not responsible for delays or losses caused by incorrect addresses.
              </p>
            </section>

            {/* Order Tracking */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-500" />
                Order Tracking
              </h2>
              <p className="text-gray-700">
                Once your order is shipped, we will provide you with a tracking number (if available) via email or WhatsApp. You can also track your order status through our <a href="/track-order" className="text-orange-600 hover:text-orange-700 underline">Track Order</a> page.
              </p>
            </section>

            {/* Shipping for Quote Orders */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                Shipping for Quote-Based Orders
              </h2>
              <p className="text-gray-700">
                For orders placed through our quote request system, shipping terms (including costs, timelines, and carriers) will be discussed and agreed upon privately based on your specific requirements (quantity, materials, destination, etc.).
              </p>
            </section>

            {/* Damaged or Lost Items */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Damaged or Lost Items</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong className="text-gray-900">Damaged Items:</strong> If your order arrives damaged, please notify us within 48 hours of delivery with photos of the damage. We will arrange for a replacement or refund.</li>
                <li><strong className="text-gray-900">Lost Packages:</strong> If your package is lost in transit, we will work with the carrier to locate it. If officially declared lost, we will reprint and reship at no cost to you.</li>
              </ul>
            </section>

            {/* Contact */}
            <section className="bg-orange-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-500" />
                Shipping Questions?
              </h2>
              <p className="text-gray-700">If you have any questions about shipping:</p>
              <ul className="mt-3 space-y-1 text-gray-700">
                <li>📧 Email: <a href="mailto:shipping@ravigraphics.com" className="text-orange-600 hover:text-orange-700">ravigraphics.odisha@gmail.com</a></li>
                <li>📞 Phone: <a href="tel:+918249007703" className="text-orange-600 hover:text-orange-700">+91 8249007703</a></li>
                <li>💬 WhatsApp: Available on the same number for quick queries</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}