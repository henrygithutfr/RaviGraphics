import { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  LogIn,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function AuthModal() {
  const {
    showAuthModal,
    closeAuthModal,
    authMode,
    setAuthMode,
    login,
    signup,
  } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // OTP Verification States
  const [showOTP, setShowOTP] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (!showAuthModal) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email && !formData.phone) {
      newErrors.email = "Email or phone is required";
    }
    return newErrors;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    return newErrors;
  };

  // Handle OTP Verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter the 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    try {
      const response = await axios.post(
        "http://localhost:4001/api/auth/verify-otp",
        {
          email: pendingEmail,
          otp: otpCode,
        },
      );

      if (response.data.success) {
        // Store user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Close modal and reload
        closeAuthModal();
        window.location.reload();
      }
    } catch (err) {
      setOtpError(
        err.response?.data?.error ||
          "Invalid verification code. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    setIsResending(true);
    setOtpError("");

    try {
      await axios.post("http://localhost:4001/api/auth/resend-verification", {
        email: pendingEmail,
      });
      alert("New verification code sent to your email!");
    } catch (err) {
      setOtpError(
        err.response?.data?.error || "Failed to resend code. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let validationErrors = {};
    if (authMode === "login") {
      validationErrors = validateLogin();
    } else {
      validationErrors = validateSignup();
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    if (authMode === "login") {
      const result = await login(formData.email, formData.phone);

      if (result.requiresVerification) {
        setPendingEmail(formData.email);
        setShowOTP(true);
        setIsLoading(false);
        return;
      }

      if (!result.success && result.error) {
        setErrors({ email: result.error });
      }
    } else {
      const result = await signup(formData.name, formData.email, formData.phone);

      // Check if verification is required (OTP method)
      if (result.requiresVerification) {
        setPendingEmail(formData.email);
        setShowOTP(true);
        setIsLoading(false);
        return;
      }

      // Old method - just show success message
      if (result.success && result.message) {
        alert(result.message);
        setAuthMode("login");
        setFormData({ name: "", email: "", phone: "" });
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(false);
  };

  const switchMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
    setErrors({});
    setFormData({ name: "", email: "", phone: "" });
    setShowOTP(false);
    setOtpCode("");
    setOtpError("");
  };

  const handleBackToLogin = () => {
    setShowOTP(false);
    setOtpCode("");
    setOtpError("");
  };

  // OTP Verification Screen
  if (showOTP) {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={closeAuthModal}
      >
        <div
          className="bg-white rounded-2xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={closeAuthModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-6">
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-orange-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-900">
                Verify Your Email
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-sm font-medium text-gray-700 mt-1">
                {pendingEmail}
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, ""));
                    setOtpError("");
                  }}
                  className="w-full text-center text-2xl tracking-[0.5em] font-mono px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="000000"
                  autoFocus
                />
              </div>

              {otpError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isVerifying ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Verify & Continue"
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-sm mt-2"
              >
                ← Back to Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Regular Auth Modal (Login/Signup)
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={closeAuthModal}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <LogIn className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900">
              {authMode === "login" ? "Welcome Back!" : "Create Account"}
            </h2>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {authMode === "signup" && (
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
          )}

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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-500" />
              Phone Number {authMode === "signup" && "*"}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="10-digit mobile number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : authMode === "login" ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="p-6 pt-0 text-center">
          <p className="text-sm text-gray-600">
            {authMode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              onClick={switchMode}
              className="text-orange-600 font-medium hover:underline"
            >
              {authMode === "login" ? "Sign Up" : "Login"}
            </button>
          </p>
          <p className="text-xs text-gray-400 mt-3">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
