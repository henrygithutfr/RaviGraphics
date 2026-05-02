// TermsConditions.jsx
import { FileText, Scale, CreditCard, RefreshCw, AlertTriangle, Shield, Clock, Mail, Phone, Printer, Download } from "lucide-react";

export default function TermsConditions() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Terms & Conditions</h1>
          <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            {/* Agreement */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Scale className="w-5 h-5 text-orange-500" />
                Agreement to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using Ravi Graphics ("we", "our", "us") website and services, you agree to be bound by these Terms & Conditions. If you disagree with any part of these terms, you may not access our services.
              </p>
            </section>

            {/* Services Overview */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Printer className="w-5 h-5 text-orange-500" />
                Our Services
              </h2>
              <p className="text-gray-700 mb-3">We offer three types of services for fixed-price products:</p>
              <div className="space-y-3 mt-3">
                <div className="border-l-4 border-orange-400 pl-4 py-2 bg-orange-50/30 rounded-r-lg">
                  <p className="font-semibold text-gray-900">1. Design + Print</p>
                  <p className="text-gray-600 text-sm">Includes both design creation and physical printing with offline shipping and delivery.</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50/30 rounded-r-lg">
                  <p className="font-semibold text-gray-900">2. Only Design</p>
                  <p className="text-gray-600 text-sm">Digital design only, delivered online via WhatsApp or email.</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4 py-2 bg-green-50/30 rounded-r-lg">
                  <p className="font-semibold text-gray-900">3. Request a Quote</p>
                  <p className="text-gray-600 text-sm">For custom requirements, bulk orders, or non-fixed price services.</p>
                </div>
              </div>
            </section>

            {/* Pricing & Payment */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                Pricing & Payment
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700"><strong className="text-gray-900">Fixed Price Products:</strong> Full payment is required before order processing. Payments are securely processed through Razorpay, a third-party payment gateway.</p>
                <p className="text-gray-700"><strong className="text-gray-900">Quote Requests:</strong> There is no charge for submitting a quote request. Quotes are not binding offers until formally accepted by both parties.</p>
                <p className="text-gray-700"><strong className="text-gray-900">Quote Acceptance:</strong> Once you agree to a quote through private communication, payment terms will be discussed and agreed upon privately.</p>
                <p className="text-gray-700"><strong className="text-gray-900">Shipping Charges:</strong> Currently, we offer free delivery on all orders. We reserve the right to modify this policy with prior notice.</p>
              </div>
            </section>

            {/* Order Process */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Order & Approval Process</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>You select a product/service and choose your preferred option (Design+Print, Only Design, or Request Quote).</li>
                <li>For fixed-price products, you complete payment via Razorpay.</li>
                <li>We create the design based on your requirements.</li>
                <li>We send you a design proof for approval.</li>
                <li>If you approve, we proceed with printing (if applicable) and shipping.</li>
                <li>If you disapprove, we process a refund (see Refund Policy below).</li>
              </ol>
            </section>

            {/* Shipping & Delivery */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Shipping & Delivery</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>For Design+Print orders, physical products are shipped to the address you provide.</li>
                <li>If you haven't provided location details on the website, we will contact you privately to obtain shipping information.</li>
                <li>Delivery timelines will be communicated after design approval.</li>
                <li>Digital designs are delivered online within the agreed timeframe.</li>
                <li>For quote-based orders, shipping arrangements are made privately based on your requirements.</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You retain ownership of any original designs or artwork you provide.</li>
                <li>Upon full payment, you receive a license to use the designs we create for your intended purpose.</li>
                <li>We retain the right to display your completed work in our portfolio unless you request otherwise.</li>
                <li>You may not resell our designs as your own stock artwork.</li>
              </ul>
            </section>

            {/* Refund & Cancellation */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-orange-500" />
                Refund & Cancellation
              </h2>
              <p className="text-gray-700 mb-3">Please refer to our <a href="/return-policy" className="text-orange-600 hover:text-orange-700 underline">Return Policy</a> for complete details. Key points:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>If you disapprove of the design proof, you are eligible for a full refund.</li>
                <li>Refunds are processed within 1-7 business days.</li>
                <li>Once a design is approved and production begins, refunds may not be available.</li>
                <li>Quote requests can be canceled at any time before formal acceptance.</li>
              </ul>
            </section>

            {/* User Obligations */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                User Obligations
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You must provide accurate and complete information for order processing.</li>
                <li>You are responsible for obtaining necessary permissions for any copyrighted material you submit.</li>
                <li>You may not use our services for illegal or prohibited purposes.</li>
                <li>You agree not to reverse engineer or copy our website's design or functionality.</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, Ravi Graphics shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount you paid for the specific service giving rise to the claim.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in [Your City], India.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. Your continued use of our services after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-orange-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-500" />
                Contact Us
              </h2>
              <p className="text-gray-700">For questions about these Terms & Conditions:</p>
              <ul className="mt-3 space-y-1 text-gray-700">
                <li>📧 Email: <a href="mailto:legal@ravigraphics.com" className="text-orange-600 hover:text-orange-700">ravigraphics.odisha@gmail.com</a></li>
                <li>📞 Phone: <a href="tel:+918249007703" className="text-orange-600 hover:text-orange-700">+91 8249007703</a></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}