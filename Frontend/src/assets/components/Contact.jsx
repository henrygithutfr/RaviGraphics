import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SEO from "./SEO";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Sparkles,
  Heart,
  Building2,
  Globe,
  LogIn
} from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // Adjust the import path as needed
const API = import.meta.env.VITE_API_URL;

export default function Contact() {
  const { user, openAuthModal } = useAuth(); // Add this line to get auth functions
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const phoneNumber = "8249007703";
  const emailAddress = "ravigraphics.odisha@gmail.com";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    // Clear submit error when user starts typing
    if (submitError) setSubmitError("");
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }
    return errors;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    // CHECK IF USER IS LOGGED IN FIRST
    if (!user) {
      openAuthModal("login");
      return;
    }
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Using EmailJS or a backend endpoint
      // Option 1: Send to your backend (recommended)
      const response = await axios.post(`${API}/api/contact`, {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        subject: `Contact Form Submission from ${formData.name}`,
        userId: user.id // Optional: send user ID to track which user sent the message
      });

      if (response.data.success) {
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitError("Failed to send message. Please try again or contact us directly via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = `Hello! I'm interested in your printing services. Could you please provide more information?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:+91${phoneNumber}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${emailAddress}?subject=Inquiry about Printing Services&body=Hello,%0A%0AI would like to know more about your services.%0A%0AThank you.`;
  };

  return (
    <>
    <SEO 
      title="Contact Us - Get in Touch"
      description="Get in touch with Ravi Graphics. Call, email, or visit our office in Brahmapur, Odisha. We're here to help with all your printing needs."
    />
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-amber-100 pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-6 text-center mt-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our services, need a quote, or just want to say hello.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-orange-600 font-medium">Contact Us</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* Login Warning Banner - Show when user is not logged in */}
        {!user && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <LogIn className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-amber-800 font-medium">Please log in to send us a message</p>
                <p className="text-amber-600 text-sm">You need to be logged in to use the contact form.</p>
              </div>
            </div>
            <button
              onClick={() => openAuthModal("login")}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login Now
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* WhatsApp Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">WhatsApp</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Quick replies on WhatsApp. Click the button below to start a conversation.
              </p>
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </button>
            </div>

            {/* Phone Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Call Us</h3>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                Monday to Saturday, 10 AM - 8 PM
              </p>
              <p className="text-xl font-bold text-gray-900 mb-3">+91 {phoneNumber}</p>
              <button
                onClick={handlePhoneClick}
                className="w-full bg-orange-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </button>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Email Us</h3>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                Send us an email and we'll respond within 24 hours.
              </p>
              <p className="text-sm text-gray-700 mb-3 break-all">{emailAddress}</p>
              <button
                onClick={handleEmailClick}
                className="w-full bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </button>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Saturday:</span>
                  <span className="text-gray-800 font-medium">10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday:</span>
                  <span className="text-gray-800 font-medium">11:00 AM - 02:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold text-gray-900">Send us a Message</h2>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                {/* Login requirement notice */}
                {!user && (
                  <p className="text-amber-600 text-xs mt-2 flex items-center gap-1">
                    <LogIn className="w-3 h-3" />
                    You need to be logged in to submit this form
                  </p>
                )}
                {user && (
                  <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Logged in as {user.name || user.email}
                  </p>
                )}
              </div>

              <form onSubmit={handleEmailSubmit} className="p-6 space-y-5">
                {/* Success Message */}
                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-700">Message sent successfully! We'll get back to you soon.</p>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-700">{submitError}</p>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-500" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    } ${!user ? 'bg-gray-50' : ''}`}
                    placeholder="Enter your full name"
                    disabled={!user} // Optional: disable fields when not logged in
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-500" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    } ${!user ? 'bg-gray-50' : ''}`}
                    placeholder="you@example.com"
                    disabled={!user} // Optional: disable fields when not logged in
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-500" />
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none ${
                      formErrors.message ? 'border-red-500' : 'border-gray-300'
                    } ${!user ? 'bg-gray-50' : ''}`}
                    placeholder="Tell us about your requirements, questions, or feedback..."
                    disabled={!user} // Optional: disable fields when not logged in
                  />
                  {formErrors.message && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    Minimum 10 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !user}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    !user
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:-translate-y-0.5'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {!user ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      Login to Send Message
                    </>
                  ) : isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                {/* Login link for non-logged in users */}
                {!user && (
                  <p className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => openAuthModal("login")}
                      className="text-orange-600 hover:underline font-medium"
                    >
                      Login here
                    </button>
                  </p>
                )}
              </form>
            </div>

            {/* Location / Additional Info */}
            <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Our Office</h3>
                  <p className="text-gray-600 text-sm">
                   Gundumala Street, R.C, Church Road, near Kalimani Apartment <br />
Brahmapur, Odisha 760001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}