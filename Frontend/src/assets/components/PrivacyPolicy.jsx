// PrivacyPolicy.jsx
import { Shield, Lock, Eye, Database, Globe, Mail, Users, Camera, FileText, Clock } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At Ravi Graphics ("we", "our", "us"), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our printing and graphic design services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>

            {/* Information Collection */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-500" />
                Information We Collect
              </h2>
              <p className="text-gray-700 mb-3">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong className="text-gray-900">Personal Information:</strong> Name, email address, phone number, shipping address, billing address.</li>
                <li><strong className="text-gray-900">Design Files:</strong> Artwork, logos, images, and other design assets you upload or share with us.</li>
                <li><strong className="text-gray-900">Transaction Information:</strong> Payment details processed through Razorpay (we do not store full payment credentials).</li>
                <li><strong className="text-gray-900">Usage Data:</strong> IP address, browser type, pages visited, time spent on our website.</li>
                <li><strong className="text-gray-900">Communication Data:</strong> Messages, quotes, and correspondence via email, WhatsApp, or our contact forms.</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-500" />
                How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>To process and fulfill your printing and design orders</li>
                <li>To respond to quote requests and communicate about your projects</li>
                <li>To send design proofs and seek your approval</li>
                <li>To process refunds and manage order cancellations</li>
                <li>To improve our services and customer experience</li>
                <li>To send order updates and shipping notifications</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            {/* Sharing of Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                Sharing Your Information
              </h2>
              <p className="text-gray-700 mb-3">We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong className="text-gray-900">Third-Party Service Providers:</strong> Razorpay for payment processing, shipping carriers for delivery.</li>
                <li><strong className="text-gray-900">Legal Authorities:</strong> When required by law or to protect our rights.</li>
                <li><strong className="text-gray-900">Business Transfers:</strong> In connection with a merger, sale, or acquisition.</li>
              </ul>
              <p className="text-gray-700 mt-3 text-sm bg-amber-50 p-3 rounded-lg">
                <strong className="text-amber-800">Note:</strong> We never sell your personal information to third parties for marketing purposes.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-500" />
                Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information. Payments are processed through Razorpay's secure PCI-compliant gateway. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h2>
              <p className="text-gray-700 mb-3">Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>
              <p className="text-gray-700 mt-3">To exercise these rights, contact us at <a href="mailto:privacy@ravigraphics.com" className="text-orange-600 hover:text-orange-700">privacy@ravigraphics.com</a></p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-500" />
                Cookies
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
              </p>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Updates to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-orange-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-500" />
                Contact Us
              </h2>
              <p className="text-gray-700">If you have questions about this Privacy Policy, please contact us:</p>
              <ul className="mt-3 space-y-1 text-gray-700">
                <li>📧 Email: <a href="mailto:privacy@ravigraphics.com" className="text-orange-600 hover:text-orange-700">ravigraphics.odisha@gmail.com</a></li>
                <li>📞 Phone: <a href="tel:+918249007703" className="text-orange-600 hover:text-orange-700">+91 8249007703</a></li>
                <li>📍 Address: Ravi Graphics, [Your Full Address]</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Settings import at top
import { Settings } from "lucide-react";