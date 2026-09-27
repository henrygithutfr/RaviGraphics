import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
import {
  Printer,
  Upload,
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  Clock,
  Send,
  AlertCircle,
  X,
  Shield,
  Truck,
  Sparkles,
  Mail,
  Phone,
  MessageCircle,
  Loader2,
  User,
  Package,
  Hash,
  Layers,
  PenTool,
  LogIn
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SEO from "./SEO";

function Quote() {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedProductOptions, setSelectedProductOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({}); // Track selected options
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    productType: "",
    quantity: "",
    colorType: "full-color",
    size: "",
    material: "",
    finishing: [],
    turnaround: "standard",
    designStatus: "need-design",
    description: "",
    budget: "",
    agreeTerms: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const finishingOptions = [
    { value: "uv-coating", label: "UV Coating" },
    { value: "lamination-matte", label: "Matte Lamination" },
    { value: "lamination-glossy", label: "Glossy Lamination" },
    { value: "foil-stamping", label: "Foil Stamping" },
    { value: "embossing", label: "Embossing" },
    { value: "die-cut", label: "Die Cut" },
  ];

  // Fetch all services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API}/api/services`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // Auto-fill product info from localStorage (when coming from product page)
  useEffect(() => {
    const savedProductData = localStorage.getItem('quoteProductData');
    if (savedProductData) {
      const productData = JSON.parse(savedProductData);
      setFormData(prev => ({
        ...prev,
        productType: productData.categoryName || "",
        description: `Product: ${productData.productName}\nQuantity: ${productData.quantity} pieces\nOptions: ${JSON.stringify(productData.options, null, 2)}`,
        quantity: productData.quantity?.toString() || "",
      }));
      localStorage.removeItem('quoteProductData');
    }
  }, []);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // When product type changes, load its options and reset selected options
  useEffect(() => {
    if (formData.productType) {
      const selectedCategory = services.find(
        cat => cat.name === formData.productType || cat.slug === formData.productType
      );
      if (selectedCategory && selectedCategory.options) {
        setSelectedProductOptions(selectedCategory.options);
        setShowOptions(true);
        setSelectedOptions({}); // Reset selected options when product type changes
      } else {
        setSelectedProductOptions([]);
        setShowOptions(false);
        setSelectedOptions({});
      }
    } else {
      setSelectedProductOptions([]);
      setShowOptions(false);
      setSelectedOptions({});
    }
  }, [formData.productType, services]);

  // Update description whenever selected options change
  useEffect(() => {
    const optionsList = Object.entries(selectedOptions)
      .filter(([_, value]) => value) // Only include selected options
      .map(([type, value]) => `${type}: ${value}`)
      .join("\n");
    
    if (optionsList) {
      // Get the base description without previous options
      let baseDescription = formData.description;
      // Remove any existing options from description
      const optionsPattern = /^(?:[^:]+: [^\n]+\n?)+$/gm;
      baseDescription = baseDescription.replace(optionsPattern, '').trim();
      
      setFormData(prev => ({
        ...prev,
        description: baseDescription ? `${baseDescription}\n\nSelected Options:\n${optionsList}` : `Selected Options:\n${optionsList}`
      }));
    }
  }, [selectedOptions]);

  const handleOptionSelect = (optionType, optionValue) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionType]: prev[optionType] === optionValue ? null : optionValue // Toggle off if same option clicked
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFinishingChange = (value) => {
    setFormData(prev => ({
      ...prev,
      finishing: prev.finishing.includes(value)
        ? prev.finishing.filter(f => f !== value)
        : [...prev.finishing, value]
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFilesToCloudinary = async () => {
    if (uploadedFiles.length === 0) return [];
    
    setUploadingFiles(true);
    const fileLinks = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      setFileUploadProgress(Math.round((i / uploadedFiles.length) * 100));
      
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await axios.post(`${API}/api/upload/file`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (response.data.success && response.data.files) {
          response.data.files.forEach(uploadedFile => {
            fileLinks.push({
              originalName: uploadedFile.originalName,
              size: uploadedFile.size,
              mimeType: uploadedFile.mimeType,
              driveLink: uploadedFile.driveLink,
              downloadLink: uploadedFile.downloadLink,
              fileId: uploadedFile.fileId
            });
          });
        } else if (response.data.success) {
          fileLinks.push({
            originalName: file.name,
            size: file.size,
            mimeType: file.type,
            driveLink: response.data.driveLink,
            downloadLink: response.data.downloadLink,
            fileId: `cloudinary_${Date.now()}_${file.name}`
          });
        }
      } catch (error) {
        console.error("Upload failed for file:", file.name, error);
        fileLinks.push({
          originalName: file.name,
          size: file.size,
          mimeType: file.type,
          driveLink: null,
          downloadLink: null,
          fileId: `pending_${Date.now()}`
        });
      }
    }
    
    setFileUploadProgress(100);
    setTimeout(() => setUploadingFiles(false), 500);
    return fileLinks;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.productType) newErrors.productType = "Please select a product type";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token || !user) {
      openAuthModal("login");
      return;
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const uploadedFileLinks = await uploadFilesToCloudinary();
    
    const quotePayload = {
      customer: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || ""
      },
      projectDetails: {
        productType: formData.productType,
        quantity: parseInt(formData.quantity) || 0,
        colorType: formData.colorType,
        size: formData.size,
        material: formData.material,
        finishing: formData.finishing,
        turnaround: formData.turnaround,
        designStatus: formData.designStatus,
        description: formData.description,
        budget: formData.budget,
        selectedOptions: selectedOptions, // Include selected options
        availableOptions: selectedProductOptions
      },
      files: uploadedFileLinks,
      status: "pending"
    };

    try {
      const response = await axios.post(`${API}/api/quotes/create`, quotePayload, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSubmitStatus("success");
        setFormData({
          fullName: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          company: "",
          productType: "",
          quantity: "",
          colorType: "full-color",
          size: "",
          material: "",
          finishing: [],
          turnaround: "standard",
          designStatus: "need-design",
          description: "",
          budget: "",
          agreeTerms: false,
        });
        setUploadedFiles([]);
        setShowOptions(false);
        setSelectedOptions({});
        
        setTimeout(() => {
          setSubmitStatus(null);
          navigate("/");
        }, 3000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus(null), 3000);
      }
    } catch (error) {
      console.error("Quote submission error:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <SEO 
      title="Request a Quote for Printing & Design | Ravi Graphics"
      description="Request a custom quote for printing and graphic design services in Odisha. Get pricing for business cards, banners, brochures, posters and bulk printing with fast response."
    />
       
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Request a Quote</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Tell us about your printing project and we will get back to you within 24 hours
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Login Warning Banner - Show when user is not logged in */}
        {!user && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <LogIn className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-amber-800 font-medium">Please log in to request a quote</p>
                <p className="text-amber-600 text-sm">You need to be logged in to submit a quote request.</p>
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
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              {/* Login status indicator in form header */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Quote Request Form</h2>
                  {user ? (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <Check className="w-3 h-3" />
                      <span>Logged in as {user.name || user.email}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      <LogIn className="w-3 h-3" />
                      <span>Please login to submit</span>
                    </div>
                  )}
                </div>
                {!user && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    You must be logged in to submit a quote request
                  </p>
                )}
              </div>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Quote Request Sent Successfully!</p>
                    <p className="text-sm text-green-600">We will respond within 24 hours.</p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">Submission Failed</p>
                    <p className="text-sm text-red-600">Please try again or contact us directly.</p>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!user}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      } ${!user ? 'bg-gray-50' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!user}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } ${!user ? 'bg-gray-50' : ''}`}
                      placeholder="john@company.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!user}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } ${!user ? 'bg-gray-50' : ''}`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={!user}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${!user ? 'bg-gray-50' : ''}`}
                      placeholder="Your Company"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Project Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Type <span className="text-red-500">*</span>
                    </label>
                    {loadingServices ? (
                      <div className="text-center py-4 text-gray-500">Loading services...</div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {services.map((category) => (
                          <button
                            key={category._id || category.slug}
                            type="button"
                            onClick={() => {
                              if (!user) {
                                openAuthModal("login");
                                return;
                              }
                              handleChange({ target: { name: "productType", value: category.name } });
                              setSelectedOptions({});
                            }}
                            disabled={!user}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                              formData.productType === category.name
                                ? "bg-orange-500 text-white shadow-sm"
                                : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    )}
                    {errors.productType && <p className="text-red-500 text-xs mt-1">{errors.productType}</p>}
                  </div>

                  {/* Product Options - Dynamic from selected category */}
                  {showOptions && selectedProductOptions.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-orange-500" />
                        Available Options for {formData.productType}
                      </h3>
                      <div className="space-y-3">
                        {selectedProductOptions.map((option, idx) => (
                          <div key={idx}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {option.type} <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {option.options && option.options.map((opt, optIdx) => (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => {
                                    if (!user) {
                                      openAuthModal("login");
                                      return;
                                    }
                                    handleOptionSelect(option.type, opt);
                                  }}
                                  disabled={!user}
                                  className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                                    selectedOptions[option.type] === opt
                                      ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                                      : "bg-white text-gray-700 border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                                  } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      {Object.keys(selectedOptions).length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Selected options have been added to description
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        disabled={!user}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                          errors.quantity ? "border-red-500" : "border-gray-300"
                        } ${!user ? 'bg-gray-50' : ''}`}
                        placeholder="e.g., 500"
                      />
                      {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color Type
                      </label>
                      <select
                        name="colorType"
                        value={formData.colorType}
                        onChange={handleChange}
                        disabled={!user}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${!user ? 'bg-gray-50' : ''}`}
                      >
                        <option value="full-color">Full Color (CMYK)</option>
                        <option value="spot-color">Spot Color (Pantone)</option>
                        <option value="black-white">Black & White</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size / Dimensions
                      </label>
                      <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        disabled={!user}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${!user ? 'bg-gray-50' : ''}`}
                        placeholder="e.g., A4, 5x7 inches, Custom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Material / Paper Type
                      </label>
                      <input
                        type="text"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        disabled={!user}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${!user ? 'bg-gray-50' : ''}`}
                        placeholder="e.g., 300gsm, Vinyl, Premium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Finishing Options
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {finishingOptions.map(option => (
                        <label
                          key={option.value}
                          className={`flex items-center gap-2 p-2 rounded-lg border border-gray-200 ${!user ? 'opacity-50' : 'hover:bg-gray-50 cursor-pointer'}`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.finishing.includes(option.value)}
                            onChange={() => handleFinishingChange(option.value)}
                            disabled={!user}
                            className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Turnaround Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "express", label: "Express", days: "1-2 days" },
                        { value: "standard", label: "Standard", days: "3-5 days" },
                        { value: "economy", label: "Economy", days: "7-10 days" },
                      ].map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            if (!user) {
                              openAuthModal("login");
                              return;
                            }
                            handleChange({ target: { name: "turnaround", value: option.value } });
                          }}
                          disabled={!user}
                          className={`p-3 rounded-lg text-center transition-all ${
                            formData.turnaround === option.value
                              ? "bg-orange-500 text-white shadow-sm"
                              : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                          } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <p className="font-medium text-sm">{option.label}</p>
                          <p className="text-xs opacity-80 mt-1">{option.days}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Design Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!user) {
                            openAuthModal("login");
                            return;
                          }
                          handleChange({ target: { name: "designStatus", value: "have-design" } });
                        }}
                        disabled={!user}
                        className={`p-3 rounded-lg text-center transition-all ${
                          formData.designStatus === "have-design"
                            ? "bg-orange-500 text-white shadow-sm"
                            : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                        } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <p className="text-sm font-medium">I have a design ready</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!user) {
                            openAuthModal("login");
                            return;
                          }
                          handleChange({ target: { name: "designStatus", value: "need-design" } });
                        }}
                        disabled={!user}
                        className={`p-3 rounded-lg text-center transition-all ${
                          formData.designStatus === "need-design"
                            ? "bg-orange-500 text-white shadow-sm"
                            : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                        } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <p className="text-sm font-medium">I need design help</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Upload Files
                </h2>
                <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${!user ? 'opacity-50' : 'hover:border-orange-400 transition'}`}>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept="*/*"
                    disabled={!user}
                  />
                  <label htmlFor="file-upload" className={`cursor-pointer block ${!user ? 'cursor-not-allowed' : ''}`}>
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">Any file format accepted (PDF, JPG, PNG, PSD, AI, CDR, Excel, Word, etc.)</p>
                  </label>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-gray-700">Uploaded files ({uploadedFiles.length})</p>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 truncate max-w-[200px]">{file.name}</span>
                          <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button type="button" onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {uploadingFiles && (
                  <div className="mt-2">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full transition-all duration-300" style={{ width: `${fileUploadProgress}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Uploading files... {fileUploadProgress}%</p>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Additional Information
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!user}
                    rows="4"
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${!user ? 'bg-gray-50' : ''}`}
                    placeholder="Tell us more about your project, special requirements, or any additional details..."
                  ></textarea>
                  <p className="text-xs text-gray-400 mt-1">
                    Selected options will automatically appear here
                  </p>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Range (Optional)
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    disabled={!user}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${!user ? 'bg-gray-50' : ''}`}
                    placeholder="e.g., ₹5,000 - ₹10,000"
                  />
                </div>
              </div>

              {/* Terms & Submit */}
              <div className="mb-6">
                <label className={`flex items-center gap-2 ${!user ? 'opacity-50' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    disabled={!user}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the <a href="#" className="text-orange-500 hover:underline">terms and conditions</a>
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || uploadingFiles || !user}
                className={`w-full py-3 rounded-lg font-semibold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  !user
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                }`}
              >
                {!user ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Login to Request Quote
                  </>
                ) : isSubmitting || uploadingFiles ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {uploadingFiles ? `Uploading files... ${fileUploadProgress}%` : "Sending..."}
                  </>
                ) : (
                  <>
                    Submit Quote Request
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Login link for non-logged in users */}
              {!user && (
                <p className="text-center text-sm text-gray-500 mt-4">
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Why Choose Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span>24 hour quote response</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-orange-500" />
                  <span>Free shipping on orders over ₹5,000</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-orange-500" />
                  <span>100% quality guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span>Free design support</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">What We Need</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Print-ready files (PDF, AI, PSD)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Exact dimensions & quantity
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Color specifications
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Delivery deadline
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">Speak directly with our print experts</p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-700">+91 8480154045</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-700">info@ravigraphics.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-700">WhatsApp available</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Quote;