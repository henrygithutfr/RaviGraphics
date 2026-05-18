import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;
import {
  ChevronLeft,
  ShoppingCart,
  MessageCircle,
  CreditCard,
  Truck,
  ShieldCheck,
  Clock,
  CheckCircle,
  Package,
  FileText,
  User,
  Mail,
  Phone,
  X,
  Sparkles,
  Layers,
  Palette,
  Scissors,
  Printer,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Gift,
  Heart,
  Upload,
  File,
  Image,
  FileSpreadsheet,
  Loader2,
  PenTool,
  Printer as PrinterIcon,
  Info,
  Check,
  Hash,
  MapPin,
  LogIn,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import SEO from "./SEO";

export default function ProductPage() {
  const { categorySlug, productSlug } = useParams();
  const navigate = useNavigate();
  const { user, toggleSaveProduct, isProductSaved, openAuthModal } = useAuth();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Service Type: "design_print" or "design_only" or "quote"
  const [serviceType, setServiceType] = useState(null);

  // Design + Print States
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  // Simple quantity (number of units)
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [hasDesign, setHasDesign] = useState(false);
  const [needsDesign, setNeedsDesign] = useState(false);

  // Design Only States (Now using Quote system)
  const [designBrief, setDesignBrief] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });
  const [designErrors, setDesignErrors] = useState({});
  const [showDesignQuoteModal, setShowDesignQuoteModal] = useState(false);

  // Quote States
  const [quoteData, setQuoteData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });
  const [quoteErrors, setQuoteErrors] = useState({});
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Common States
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalMessage, setAdditionalMessage] = useState("");

  // Check if product has fixed pricing
  const hasFixedPrice = product?.pricing?.type === "fixed";

  // Get pricing from database
  const baseAmount = product?.pricing?.amount || 0;
  const unitString = product?.pricing?.unit || "per 1000";

  const parseBaseQuantity = (unit) => {
    if (!unit) return 1000;
    const match = unit.match(/\d+/);
    return match ? parseInt(match[0]) : 1000;
  };

  const baseQuantity = parseBaseQuantity(unitString);
  const pricePerSet = baseAmount; // Price for one set (base quantity)
  
  // Calculate total quantity and price - ensure numbers
  const totalQuantity = (quantity || 1) * baseQuantity;
  const totalPrice = (quantity || 1) * pricePerSet;
  const maxUnits = 10;

  const designOnlyPrice = parseInt(category?.price_do) || 0;

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/api/services`);
        const allServices = response.data;
        const foundCategory = allServices.find(
          (cat) => cat.slug === categorySlug,
        );

        if (foundCategory) {
          setCategory(foundCategory);
          const foundProduct = foundCategory.services?.find(
            (prod) => prod.slug === productSlug,
          );

          if (foundProduct) {
            setProduct(foundProduct);
            if (foundCategory.options) {
              const defaultOptions = {};
              foundCategory.options.forEach((option) => {
                defaultOptions[option.type] = option.options[0];
              });
              setSelectedOptions(defaultOptions);
            }
          } else {
            setError("Product not found");
          }
        } else {
          setError("Category not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [categorySlug, productSlug]);

  // Reset service type when product changes
  useEffect(() => {
    setServiceType(null);
    setShowOrderForm(false);
    setQuantity(1);
    setUploadedFiles([]);
  }, [product]);

  // Reset files when service type changes
  useEffect(() => {
    setUploadedFiles([]);
  }, [serviceType]);

  // Pre-fill forms with user data
  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
      setDesignBrief((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
      setQuoteData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleOptionChange = (optionType, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionType]: value,
    }));
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= maxUnits) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < maxUnits) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const validateAddress = () => {
    const errors = {};
    if (!shippingAddress.name.trim()) errors.name = "Name is required";
    if (!shippingAddress.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) {
      errors.email = "Invalid email";
    }
    if (!shippingAddress.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(shippingAddress.phone.replace(/\D/g, ""))) {
      errors.phone = "10-digit number required";
    }
    if (!shippingAddress.address.trim()) errors.address = "Address is required";
    if (!shippingAddress.city.trim()) errors.city = "City is required";
    if (!shippingAddress.state.trim()) errors.state = "State is required";
    if (!shippingAddress.pincode.trim()) {
      errors.pincode = "PIN code required";
    } else if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      errors.pincode = "6-digit PIN required";
    }
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDesignBrief = () => {
    const errors = {};
    if (!designBrief.name.trim()) errors.name = "Name is required";
    if (!designBrief.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(designBrief.email)) {
      errors.email = "Invalid email";
    }
    if (!designBrief.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(designBrief.phone.replace(/\D/g, ""))) {
      errors.phone = "10-digit number required";
    }
    if (!designBrief.description.trim())
      errors.description = "Please describe your design needs";
    setDesignErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateQuote = () => {
    const errors = {};
    if (!quoteData.name.trim()) errors.name = "Name is required";
    if (!quoteData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(quoteData.email)) {
      errors.email = "Invalid email";
    }
    if (!quoteData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(quoteData.phone.replace(/\D/g, ""))) {
      errors.phone = "10-digit number required";
    }
    setQuoteErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFilesToCloudinary = async () => {
    if (uploadedFiles.length === 0) return [];

    setUploadingFiles(true);
    const fileLinks = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      setFileUploadProgress(Math.round((i / uploadedFiles.length) * 100));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("orderId", `temp_${Date.now()}`);

      try {
        const response = await axios.post(
          `${API}/api/upload/file`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        if (response.data.success && response.data.files) {
          response.data.files.forEach((uploadedFile) => {
            fileLinks.push({
              originalName: uploadedFile.originalName,
              size: uploadedFile.size,
              mimeType: uploadedFile.mimeType,
              driveLink: uploadedFile.driveLink,
              downloadLink: uploadedFile.downloadLink,
              fileId: uploadedFile.fileId,
            });
          });
        }
      } catch (error) {
        console.error("Upload failed:", error);
        fileLinks.push({
          originalName: file.name,
          size: file.size,
          mimeType: file.type,
          driveLink: null,
          downloadLink: null,
          fileId: `pending_${Date.now()}`,
        });
      }
    }

    setFileUploadProgress(100);
    setTimeout(() => setUploadingFiles(false), 500);
    return fileLinks;
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay payment for Design + Print
  const handleRazorpayPayment = async (createdOrder) => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load payment gateway. Please try again.");
        return;
      }

      const razorpayKeyId = "rzp_test_SgYjNK1csR68XU";

      if (!razorpayKeyId) {
        alert("Payment configuration error. Please contact support.");
        return;
      }

      const razorpayOrderResponse = await axios.post(
        `${API}/api/payments/create-order`,
        {
          amount: createdOrder.totalAmount,
          orderId: createdOrder._id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      const options = {
        key: razorpayKeyId,
        amount: razorpayOrderResponse.data.amount,
        currency: razorpayOrderResponse.data.currency,
        name: "Ravi Graphics",
        description: `Order #${createdOrder.orderId}`,
        order_id: razorpayOrderResponse.data.orderId,
        handler: async (response) => {
          await axios.post(
            `${API}/api/payments/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDatabaseId: createdOrder._id,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );
          navigate(`/order-confirmation/${createdOrder._id}`);
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: "#f97316" },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      alert("Payment initialization failed. Please try again.");
    }
  };

  // Submit Design + Print Order
  const handleDesignPrintSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal("login");
      return;
    }
    if (!validateAddress()) return;

    setIsSubmitting(true);
    const uploadedFileLinks = await uploadFilesToCloudinary();

    // Ensure we have valid numbers
    const orderTotalAmount = Number(totalPrice);
    const orderItemPrice = Number(pricePerSet);
    const orderItemQuantity = Number(totalQuantity);

    console.log("Order Details:", {
      totalPrice: orderTotalAmount,
      pricePerSet: orderItemPrice,
      quantity: orderItemQuantity,
      product: product?.name
    });

    const orderPayload = {
      orderType: "design_print",
      customer: {
        name: shippingAddress.name,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: `${shippingAddress.address}, ${shippingAddress.landmark ? shippingAddress.landmark + ", " : ""}${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`,
        notes: additionalMessage,
      },
      items: [
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          categorySlug: category.slug,
          quantity: orderItemQuantity,
          price: orderItemPrice,
          currency: "INR",
          unit: "piece",
          options: selectedOptions,
          image: product.images?.[0] || "",
        },
      ],
      totalAmount: orderTotalAmount,
      paymentMethod: "razorpay",
      files: uploadedFileLinks,
    };

    try {
      const response = await axios.post(
        `${API}/api/orders/create`,
        orderPayload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (response.data.success) {
        setShowOrderForm(false);
        setServiceType(null);
        await handleRazorpayPayment(response.data.order);
      }
    } catch (error) {
      console.error("Order error:", error);
      alert(
        error.response?.data?.error ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Design Only Quote Request (NEW - using quote system)
  const handleDesignOnlyQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal("login");
      return;
    }
    if (!validateDesignBrief()) return;

    setIsSubmitting(true);
    const uploadedFileLinks = await uploadFilesToCloudinary();

    const quotePayload = {
      customer: {
        name: designBrief.name,
        email: designBrief.email,
        phone: designBrief.phone,
      },
      projectDetails: {
        productName: product.name,
        categoryName: category?.name,
        description: `DESIGN ONLY REQUEST: ${designBrief.description}\n\nProduct: ${product.name}\nCategory: ${category?.name}\nSelected Options: ${JSON.stringify(selectedOptions, null, 2)}`,
        options: selectedOptions,
        quantity: 1,
        productType: "design_only_service",
      },
      files: uploadedFileLinks,
      status: "pending",
    };

    try {
      await axios.post(
        `${API}/api/quotes/create`,
        quotePayload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setShowDesignQuoteModal(false);
      setServiceType(null);
      alert("✅ Design quote request sent! We'll contact you within 24 hours.");
    } catch (error) {
      console.error("Design quote error:", error);
      alert("Failed to send quote request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Quote Request (for regular quote option)
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!user || !token) {
      openAuthModal("login");
      return;
    }

    if (!validateQuote()) return;

    setIsSubmitting(true);
    const uploadedFileLinks = await uploadFilesToCloudinary();

    const quotePayload = {
      customer: {
        name: quoteData.name,
        email: quoteData.email,
        phone: quoteData.phone,
      },
      projectDetails: {
        productName: product.name,
        categoryName: category?.name,
        description: quoteData.description,
        options: selectedOptions,
        quantity: 1,
        productType: product.slug || product.name,
      },
      files: uploadedFileLinks,
      status: "pending",
    };

    try {
      await axios.post(
        `${API}/api/quotes/create`,
        quotePayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setShowQuoteModal(false);
      setServiceType(null);
      alert("✅ Quote request sent! We'll contact you within 24 hours.");
    } catch (error) {
      console.error("Quote error:", error);
      alert("Failed to send quote request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    setShowOrderForm(true);
  };

  const handleProceedToDesignQuote = () => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    setShowDesignQuoteModal(true);
  };

  const handleProceedToQuote = () => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    setShowQuoteModal(true);
  };

  const getOptionIcon = (optionType) => {
    const icons = {
      Paper: FileText,
      Finish: Palette,
      Corners: Scissors,
      Size: Package,
      Binding: Layers,
      Print: Printer,
    };
    const IconComponent = icons[optionType] || Package;
    return <IconComponent className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center text-red-600">
          {error || "Product not found"}
        </div>
        <div className="text-center mt-4">
          <Link to="/services" className="text-orange-600 hover:underline">
            ← Back to services
          </Link>
        </div>
      </div>
    );
  }

  const seoTitle = product?.name
  ? `${product.name} Printing in Odisha | Ravi Graphics`
  : "Printing Services in Odisha | Ravi Graphics";

const seoDescription = product?.description
  ? `${product.description}. High-quality ${product.name.toLowerCase()} printing with fast turnaround in Odisha.`
  : "Professional printing and graphic design services including business cards, banners, brochures, posters and more.";

  return (
    <>
    <SEO title={seoTitle} description={seoDescription} />
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-orange-600">
          Home
        </Link>
        <span>/</span>
        <Link to="/services" className="hover:text-orange-600">
          Services
        </Link>
        <span>/</span>
        <Link
          to={`/services/${category.slug}`}
          className="hover:text-orange-600"
        >
          {category.name}
        </Link>
        <span>/</span>
        <span className="text-orange-600 font-medium">{product.name}</span>
      </div>

      {/* Login Warning Banner */}
      {!user && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <LogIn className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-amber-800 font-medium">
                Please log in to place orders or request quotes
              </p>
              <p className="text-amber-600 text-sm">
                You need to be logged in to proceed with any purchase or quote
                request.
              </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden mb-4 border border-gray-200">
            <img
              src={
                product.images?.[selectedImage] ||
                `https://picsum.photos/seed/${product.slug}/500/500`
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === idx
                      ? "border-orange-500"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={() => {
              if (!user) openAuthModal("login");
              else toggleSaveProduct(product.id);
            }}
            className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md transition-all z-10 ${
              isProductSaved(product.id)
                ? "text-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${isProductSaved(product.id) ? "fill-red-500" : ""}`}
            />
          </button>
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-orange-600 font-medium">
                {category.name}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {product.description ||
                "Premium quality printing and design service."}
            </p>
          </div>

          {/* Options Selection */}
          {category.options && category.options.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-800">
                  Customize Your Product
                </h3>
              </div>
              <div className="space-y-4">
                {category.options.map((option, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      {getOptionIcon(option.type)}
                      <span>{option.type}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleOptionChange(option.type, opt)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                            selectedOptions[option.type] === opt
                              ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                              : "bg-white text-gray-700 border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Type Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              How would you like to proceed?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Design + Print Card */}
              {hasFixedPrice && baseAmount > 0 && (
                <button
                  onClick={() => setServiceType("design_print")}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    serviceType === "design_print"
                      ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                      : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/30"
                  }`}
                >
                  <PrinterIcon
                    className={`w-8 h-8 mb-3 ${serviceType === "design_print" ? "text-orange-500" : "text-gray-400"}`}
                  />
                  <p
                    className={`font-bold text-lg ${serviceType === "design_print" ? "text-orange-600" : "text-gray-800"}`}
                  >
                    Design + Print
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Complete solution - design + printing + shipping
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      📦 Physical delivery
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      🖨️ Print included
                    </span>
                  </div>
                  <p className="text-orange-600 font-bold mt-3">
                    ₹{baseAmount} for {baseQuantity.toLocaleString()} pieces
                  </p>
                </button>
              )}

              {/* Design Only Card - NOW A QUOTE BUTTON instead of payment */}
              {hasFixedPrice && designOnlyPrice > 0 && (
                <button
                  onClick={() => {
                    setServiceType("design_only");
                    setUploadedFiles([]);
                  }}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    serviceType === "design_only"
                      ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                      : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/30"
                  }`}
                >
                  <MessageCircle
                    className={`w-8 h-8 mb-3 ${serviceType === "design_only" ? "text-orange-500" : "text-gray-400"}`}
                  />
                  <p
                    className={`font-bold text-lg ${serviceType === "design_only" ? "text-orange-600" : "text-gray-800"}`}
                  >
                    Design Only
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Professional design - digital files only
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      💻 Digital delivery
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      🎨 Custom design service
                    </span>
                  </div>
                  <p className="text-purple-600 font-bold mt-3">
                    Request Quote • Starting from ₹{designOnlyPrice.toLocaleString()}
                  </p>
                </button>
              )}

              {/* Quote Request Card */}
              <button
                onClick={() => setServiceType("quote")}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  !hasFixedPrice ? "col-span-1" : ""
                } ${
                  serviceType === "quote"
                    ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/30"
                }`}
              >
                <MessageCircle
                  className={`w-8 h-8 mb-3 ${serviceType === "quote" ? "text-orange-500" : "text-gray-400"}`}
                />
                <p
                  className={`font-bold text-lg ${serviceType === "quote" ? "text-orange-600" : "text-gray-800"}`}
                >
                  {hasFixedPrice ? "Custom Quote" : "Request a Quote"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {hasFixedPrice
                    ? "Get a custom price for bulk or special requirements"
                    : "Get a personalized price for your needs"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                    📋 Custom pricing
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                    💬 We'll contact you
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Design + Print Details - Same as before */}
          {serviceType === "design_print" &&
            hasFixedPrice &&
            baseAmount > 0 && (
              <div className="space-y-4">
                {!user && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LogIn className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-700">
                        Login required to proceed with order
                      </span>
                    </div>
                    <button
                      onClick={() => openAuthModal("login")}
                      className="text-sm bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600"
                    >
                      Login
                    </button>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Order Quantity
                      </h3>
                      <p className="text-sm text-gray-500">
                        {baseQuantity.toLocaleString()} pieces per set
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Price per set</p>
                      <p className="font-semibold text-gray-900">
                        ₹{pricePerSet.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-40"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max={maxUnits}
                        className="w-16 text-center outline-none border-x border-gray-300 py-2"
                      />
                      <button
                        onClick={incrementQuantity}
                        disabled={quantity >= maxUnits}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <div className="hidden md:flex gap-2">
                      {[1, 2, 5, 10].map((val) => (
                        <button
                          key={val}
                          onClick={() => setQuantity(val)}
                          className={`px-3 py-1.5 rounded-lg text-sm border ${
                            quantity === val
                              ? "bg-orange-500 text-white border-orange-500"
                              : "bg-white text-gray-600 border-gray-300 hover:border-orange-400"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="my-4 border-t"></div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Total Sets</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Total Pieces</span>
                      <span className="font-medium">
                        {totalQuantity.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-gray-800 font-medium">
                        Total Price
                      </span>
                      <span className="text-2xl font-bold text-orange-600">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Design Option */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Do you have a design ready?
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setHasDesign(true);
                        setNeedsDesign(false);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        hasDesign
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-orange-300"
                      }`}
                    >
                      <Check className="w-5 h-5 mx-auto mb-1 text-green-500" />
                      <p className="font-medium">Yes, I have a design</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload your files
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNeedsDesign(true);
                        setHasDesign(false);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        needsDesign
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-orange-300"
                      }`}
                    >
                      <PenTool className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                      <p className="font-medium">Need design help</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Our designer will contact you
                      </p>
                    </button>
                  </div>
                </div>

                {/* File Upload */}
                {hasDesign && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-orange-500" />
                      Upload Design Files
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors bg-white">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="fileUploadMain"
                        accept="*/*"
                      />
                      <label
                        htmlFor="fileUploadMain"
                        className="cursor-pointer block"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                          AI, PSD, PDF, JPG, PNG, CDR, EPS
                        </p>
                      </label>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-white p-2 rounded-lg border"
                          >
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4 text-gray-500" />
                              <span className="text-sm truncate">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-400">
                                ({(file.size / 1024).toFixed(0)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Message */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={additionalMessage}
                    onChange={(e) => setAdditionalMessage(e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    placeholder="Any special requirements or notes..."
                  />
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handleProceedToCheckout}
                  className={`w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    !user
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg"
                  }`}
                >
                  {!user ? (
                    <>
                      <LogIn className="w-5 h-5" />
                      Login to Proceed • ₹{totalPrice.toLocaleString()}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Proceed to Checkout • ₹{totalPrice.toLocaleString()}
                    </>
                  )}
                </button>
              </div>
            )}

          {/* Design Only Details - NOW A QUOTE REQUEST FORM instead of payment */}
          {serviceType === "design_only" &&
            hasFixedPrice &&
            designOnlyPrice > 0 && (
              <div className="space-y-4">
                {!user && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LogIn className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-700">
                        Login required to request a design quote
                      </span>
                    </div>
                    <button
                      onClick={() => openAuthModal("login")}
                      className="text-sm bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600"
                    >
                      Login
                    </button>
                  </div>
                )}

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    Design Service Quote
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get a custom quote for professional design services
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Starting from ₹{designOnlyPrice.toLocaleString()}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    <p className="font-medium text-blue-800">How it works:</p>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1 ml-6 list-disc">
                    <li>Fill out the form below with your requirements</li>
                    <li>Our design team will review your request</li>
                    <li>We'll send you a custom quote within 24 hours</li>
                    <li>Once approved, we'll start working on your design</li>
                    <li>Final files delivered in print-ready formats</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-500" />
                    Tell us about your design needs
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={designBrief.name}
                      onChange={(e) =>
                        setDesignBrief({ ...designBrief, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      disabled={!user}
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={designBrief.email}
                      onChange={(e) =>
                        setDesignBrief({
                          ...designBrief,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      disabled={!user}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={designBrief.phone}
                      onChange={(e) =>
                        setDesignBrief({
                          ...designBrief,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      disabled={!user}
                    />
                    <textarea
                      placeholder="Describe your design requirements in detail *
(e.g., type of design, color preferences, text/content, deadline, reference images, etc.)"
                      value={designBrief.description}
                      onChange={(e) =>
                        setDesignBrief({
                          ...designBrief,
                          description: e.target.value,
                        })
                      }
                      rows="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      disabled={!user}
                    />
                  </div>
                </div>

                {/* File Upload for Reference Materials */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-orange-500" />
                    Upload Reference Files (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors bg-white">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="designOnlyFileUpload"
                      accept="*/*"
                    />
                    <label
                      htmlFor="designOnlyFileUpload"
                      className="cursor-pointer block"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        Logo, inspiration, brand guidelines, etc.
                      </p>
                    </label>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white p-2 rounded-lg border"
                        >
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4 text-gray-500" />
                            <span className="text-sm truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({(file.size / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Request Quote Button */}
                <button
                  onClick={handleProceedToDesignQuote}
                  className={`w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    !user
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg"
                  }`}
                >
                  {!user ? (
                    <>
                      <LogIn className="w-5 h-5" />
                      Login to Request Quote
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      Request Design Quote
                    </>
                  )}
                </button>
              </div>
            )}

          {/* Quote CTA Button (for regular quote option) */}
          {serviceType === "quote" && (
            <button
              onClick={handleProceedToQuote}
              className={`w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                !user
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg"
              }`}
            >
              {!user ? (
                <>
                  <LogIn className="w-5 h-5" />
                  Login to Request Quote
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Request Quote
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Checkout Modal - Design + Print (same as before) */}
      {showOrderForm && serviceType === "design_print" && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowOrderForm(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Complete Your Order</h2>
                <p className="text-sm text-gray-500">{product.name}</p>
              </div>
              <button
                onClick={() => setShowOrderForm(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDesignPrintSubmit} className="p-6 space-y-5">
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Quantity:</span>
                    <span className="font-medium">
                      {quantity} set{quantity !== 1 ? "s" : ""} (
                      {totalQuantity.toLocaleString()} pieces)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Price per set:</span>
                    <span>₹{pricePerSet.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-orange-600 pt-2 border-t border-orange-200">
                    <span>Total Amount:</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  Shipping Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      name="name"
                      placeholder="Full Name *"
                      value={shippingAddress.name}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          name: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${addressErrors.name ? "border-red-500" : "border-gray-300"}`}
                    />
                    {addressErrors.name && (
                      <p className="text-red-500 text-xs">
                        {addressErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      name="email"
                      placeholder="Email *"
                      value={shippingAddress.email}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          email: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${addressErrors.email ? "border-red-500" : "border-gray-300"}`}
                    />
                    {addressErrors.email && (
                      <p className="text-red-500 text-xs">
                        {addressErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      name="phone"
                      placeholder="Phone *"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phone: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${addressErrors.phone ? "border-red-500" : "border-gray-300"}`}
                    />
                    {addressErrors.phone && (
                      <p className="text-red-500 text-xs">
                        {addressErrors.phone}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <input
                      name="address"
                      placeholder="Street Address *"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          address: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${addressErrors.address ? "border-red-500" : "border-gray-300"}`}
                    />
                    {addressErrors.address && (
                      <p className="text-red-500 text-xs">
                        {addressErrors.address}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      name="landmark"
                      placeholder="Landmark"
                      value={shippingAddress.landmark}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          landmark: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <input
                      name="city"
                      placeholder="City *"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${addressErrors.city ? "border-red-500" : "border-gray-300"}`}
                    />
                    {addressErrors.city && (
                      <p className="text-red-500 text-xs">
                        {addressErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      name="state"
                      placeholder="State *"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          state: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${addressErrors.state ? "border-red-500" : "border-gray-300"}`}
                    />
                    {addressErrors.state && (
                      <p className="text-red-500 text-xs">
                        {addressErrors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      name="pincode"
                      placeholder="PIN Code *"
                      value={shippingAddress.pincode}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          pincode: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${addressErrors.pincode ? "border-red-500" : "border-gray-300"}`}
                    />
                    {addressErrors.pincode && (
                      <p className="text-red-500 text-xs">
                        {addressErrors.pincode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || uploadingFiles}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting || uploadingFiles ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
                {isSubmitting || uploadingFiles
                  ? "Processing..."
                  : `Pay ₹{totalPrice.toLocaleString()} & Place Order`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Design Only Quote Modal */}
      {showDesignQuoteModal && serviceType === "design_only" && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDesignQuoteModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Request Design Quote</h2>
                <p className="text-sm text-gray-500">{product.name}</p>
              </div>
              <button
                onClick={() => setShowDesignQuoteModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDesignOnlyQuoteSubmit} className="p-6 space-y-5">
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Service:</span>
                  <span className="font-medium">Design Only Service</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Starting from:</span>
                  <span className="font-semibold text-purple-600">₹{designOnlyPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We'll review your requirements and send a custom quote
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Contact Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {designBrief.name || "Not provided"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {designBrief.email || "Not provided"}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {designBrief.phone || "Not provided"}
                  </p>
                  <p>
                    <strong>Requirements:</strong>{" "}
                    {designBrief.description
                      ? designBrief.description.substring(0, 100)
                      : "Not provided"}
                    {designBrief.description?.length > 100 ? "..." : ""}
                  </p>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Uploaded Files ({uploadedFiles.length})
                  </h3>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="text-sm text-gray-600">
                      📎 {file.name}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || uploadingFiles}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting || uploadingFiles ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MessageCircle className="w-5 h-5" />
                )}
                {isSubmitting || uploadingFiles
                  ? "Sending..."
                  : "Submit Quote Request"}
              </button>

              <p className="text-xs text-gray-400 text-center">
                By proceeding, you agree to our terms and conditions
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Quote Request Modal (for regular quote option) */}
      {showQuoteModal && serviceType === "quote" && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQuoteModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Request a Quote</h2>
                <p className="text-sm text-gray-500">{product.name}</p>
              </div>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="p-6 space-y-4">
              <div className="bg-purple-50 rounded-lg p-3 text-sm text-purple-700">
                Tell us about your requirements and we'll get back to you with a
                custom quote.
              </div>

              <div>
                <input
                  placeholder="Full Name *"
                  value={quoteData.name}
                  onChange={(e) =>
                    setQuoteData({ ...quoteData, name: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${quoteErrors.name ? "border-red-500" : "border-gray-300"}`}
                />
                {quoteErrors.name && (
                  <p className="text-red-500 text-xs">{quoteErrors.name}</p>
                )}
              </div>
              <div>
                <input
                  placeholder="Email *"
                  value={quoteData.email}
                  onChange={(e) =>
                    setQuoteData({ ...quoteData, email: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${quoteErrors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {quoteErrors.email && (
                  <p className="text-red-500 text-xs">{quoteErrors.email}</p>
                )}
              </div>
              <div>
                <input
                  placeholder="Phone Number *"
                  value={quoteData.phone}
                  onChange={(e) =>
                    setQuoteData({ ...quoteData, phone: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${quoteErrors.phone ? "border-red-500" : "border-gray-300"}`}
                />
                {quoteErrors.phone && (
                  <p className="text-red-500 text-xs">{quoteErrors.phone}</p>
                )}
              </div>
              <div>
                <textarea
                  placeholder="Describe your requirements (quantity, size, material, etc.)"
                  value={quoteData.description}
                  onChange={(e) =>
                    setQuoteData({ ...quoteData, description: e.target.value })
                  }
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Reference Files (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="quoteFileUpload"
                    accept="*/*"
                  />
                  <label
                    htmlFor="quoteFileUpload"
                    className="cursor-pointer block"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Click to upload</p>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || uploadingFiles}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting || uploadingFiles ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MessageCircle className="w-5 h-5" />
                )}
                {isSubmitting || uploadingFiles
                  ? "Sending..."
                  : "Submit Quote Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}