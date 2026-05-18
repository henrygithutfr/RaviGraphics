import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from "lucide-react";
const API = import.meta.env.VITE_API_URL;

export default function VerifyOTP({ email, onBack, onVerified }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API}/api/auth/verify-otp`, {
        email,
        otp
      });

      if (response.data.success) {
        // Store user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        if (onVerified) {
          onVerified(response.data.user);
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    
    try {
      await axios.post("http://localhost:4001/api/auth/resend-verification", { email });
      alert("New verification code sent to your email!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 text-orange-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
        <p className="text-sm text-gray-500 mt-1">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-sm font-medium text-gray-700">{email}</p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Verification Code
          </label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="000000"
            autoFocus
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <XCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            "Verify & Continue"
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend Code"}
          </button>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </button>
      </form>
    </div>
  );
}