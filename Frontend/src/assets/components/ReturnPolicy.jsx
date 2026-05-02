// ReturnPolicy.jsx
import { RefreshCw, DollarSign, Calendar, CheckCircle, XCircle, AlertCircle, Clock, Mail, Phone, FileText, MessageCircle, Printer } from "lucide-react";

export default function ReturnPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
            <RefreshCw className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Return & Refund Policy</h1>
          <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            {/* Quick Refund Guarantee */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-green-500 rounded-full p-1.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-green-800 font-medium">✨ Our Promise: If you're not satisfied with the design, we'll refund your money in <strong>less than a week</strong> — often within 24 hours!</p>
            </div>

            {/* Overview */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                At Ravi Graphics, customer satisfaction is our priority. This Return & Refund Policy applies to all services offered through our website. We've designed our processes to be fair and transparent, ensuring you feel confident when ordering from us.
              </p>
            </section>

            {/* For Design + Print Orders */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Printer className="w-5 h-5 text-orange-500" />
                For Design + Print Orders
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50/30 rounded-r-lg">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Design Disapproval (Before Printing)
                  </p>
                  <p className="text-gray-700 text-sm mt-1">
                    We send you a design proof for approval. If you disapprove of the design for any reason:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-gray-600 text-sm">
                    <li>You are eligible for a <strong>FULL REFUND</strong></li>
                    <li>Order will be cancelled immediately</li>
                    <li>Refund processed within 1-7 business days</li>
                  </ul>
                </div>

                <div className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-50/30 rounded-r-lg">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    After Design Approval & Printing
                  </p>
                  <p className="text-gray-700 text-sm mt-1">
                    Once you approve the design and we proceed to printing:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-gray-600 text-sm">
                    <li>Refunds are available only for <strong>manufacturing defects</strong> or <strong>damaged products</strong></li>
                    <li>Change of mind or design preference changes may not qualify for refund</li>
                    <li>We will assess each case individually and work toward a fair resolution</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50/30 rounded-r-lg">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Non-Refundable Situations
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-gray-600 text-sm">
                    <li>Errors in design that you approved (e.g., misspellings, wrong colors)</li>
                    <li>Normal wear and tear of printed materials</li>
                    <li>Issues caused by incorrect information you provided</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* For Only Design Orders */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                For Only Design Orders (Digital)
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  The approval process for digital designs is straightforward:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>We share design proofs online for your review</li>
                  <li>If you <strong className="text-green-600">approve</strong> the design, we send final files via WhatsApp or Gmail</li>
                  <li>If you <strong className="text-red-600">disapprove</strong> the design, you receive a full refund (processed within 1-7 business days)</li>
                </ul>
                <p className="text-gray-600 text-sm bg-blue-50 p-3 rounded-lg">
                  <strong>Note:</strong> Once final design files have been delivered to you, refunds are not available unless there is a significant deviation from the approved proof.
                </p>
              </div>
            </section>

            {/* For Quote-Based Orders */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-orange-500" />
                For Quote-Based Orders
              </h2>
              <p className="text-gray-700 mb-3">
                Quote requests are not binding orders, so no payment is collected upfront. Refund terms for quote-based orders are handled on a case-by-case basis:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Before order confirmation: No payment made, no refund needed</li>
                <li>After accepting quote and making payment: Refund terms will be discussed privately during the quote negotiation</li>
                <li>Custom projects may have customized refund policies based on materials ordered, design time invested, etc.</li>
              </ul>
            </section>

            {/* Refund Timeline */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Refund Processing Timeline
              </h2>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
                  <span className="font-medium text-gray-900">Refund Stage</span>
                  <span className="font-medium text-gray-900">Timeframe</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span>Refund Approval</span>
                  <span className="text-green-600">Within 24 hours of disapproval</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span>Razorpay Processing</span>
                  <span>2-5 business days</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Bank/Card Reflection</span>
                  <span>3-7 business days (varies by bank)</span>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  *Total refund time guaranteed less than 7 business days from approval
                </p>
              </div>
            </section>

            {/* How to Request a Refund */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                How to Request a Refund
              </h2>
              <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                <li>Contact us via <strong>email, WhatsApp, or phone call</strong> stating your order number and reason for refund</li>
                <li>Share the design proof you disapproved (if applicable)</li>
                <li>We will acknowledge your request within 24 hours</li>
                <li>Once approved, refund will be initiated to your original payment method</li>
              </ol>
            </section>

            {/* Cancellation Policy */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-orange-500" />
                Cancellation Policy
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong className="text-gray-900">Before Design Work Starts:</strong> Full refund available</li>
                <li><strong className="text-gray-900">During Design Phase:</strong> Refund amount based on work completed</li>
                <li><strong className="text-gray-900">After Design Approval:</strong> Cancellation may not be possible as production has begun</li>
                <li><strong className="text-gray-900">Quote Requests:</strong> Can be cancelled anytime before formal acceptance with no charges</li>
              </ul>
            </section>

            {/* Contact for Refunds */}
            <section className="bg-orange-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-500" />
                Need a Refund or Have Questions?
              </h2>
              <p className="text-gray-700">Our support team is here to help. Contact us through any of these channels:</p>
              <ul className="mt-3 space-y-2 text-gray-700">
                <li>📧 Email: <a href="mailto:refunds@ravigraphics.com" className="text-orange-600 hover:text-orange-700">ravigraphics.odisha@gmail.com</a></li>
                <li>📞 Phone: <a href="tel:+918249007703" className="text-orange-600 hover:text-orange-700">+91 8249007703</a></li>
                <li>💬 WhatsApp: +91 8249007703 (Fastest response)</li>
                <li>🌐 Website: <a href="/contact" className="text-orange-600 hover:text-orange-700">Contact Us form</a></li>
              </ul>
              <div className="mt-4 pt-3 border-t border-orange-200 text-sm text-gray-600">
                <p><strong>Response Guarantee:</strong> We respond to all refund requests within 24 hours on business days.</p>
              </div>
            </section>

            {/* Summary Table */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Quick Reference</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 p-2 text-left">Scenario</th>
                      <th className="border border-gray-200 p-2 text-left">Refund Eligibility</th>
                      <th className="border border-gray-200 p-2 text-left">Timeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 p-2">Design disapproval (Proof stage)</td>
                      <td className="border border-gray-200 p-2 text-green-600">✅ Full Refund</td>
                      <td className="border border-gray-200 p-2">&lt; 7 days</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 p-2">After design approval</td>
                      <td className="border border-gray-200 p-2 text-yellow-600">⚠️ Case-by-case</td>
                      <td className="border border-gray-200 p-2">Varies</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-2">Manufacturing defect</td>
                      <td className="border border-gray-200 p-2 text-green-600">✅ Full Refund/Replacement</td>
                      <td className="border border-gray-200 p-2">&lt; 7 days</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 p-2">Quote request (no payment)</td>
                      <td className="border border-gray-200 p-2 text-gray-500">N/A</td>
                      <td className="border border-gray-200 p-2">N/A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}