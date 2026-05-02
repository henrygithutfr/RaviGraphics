import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Sparkles, AlertCircle, Settings, CheckCircle2, Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const { user, toggleSaveProduct, isProductSaved, openAuthModal } = useAuth();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/services');
        const allServices = response.data;
        const foundCategory = allServices.find(cat => cat.slug === categorySlug);
        
        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          setError("Category not found");
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categorySlug]);

  const handleSaveProduct = (e, productId) => {
    e.preventDefault(); // Prevent navigating to product page
    e.stopPropagation(); // Stop event bubbling
    
    if (!user) {
      openAuthModal('login');
    } else {
      toggleSaveProduct(productId);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-gray-600 mt-2">Loading category...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center text-red-600">{error || "Category not found"}</div>
        <div className="text-center mt-4">
          <Link to="/services" className="text-orange-600 hover:text-orange-700">
            ← Back to all services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-orange-600">Home</Link> / 
        <Link to="/services" className="hover:text-orange-600"> Services</Link> / 
        <span className="text-orange-600"> {category.name}</span>
      </div>

      {/* Category Header */}
      <div className="mb-8 pb-4 border-b border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
        <p className="text-gray-500">{category.description || "Professional printing services"}</p>
        {category.quoteNote && (
          <div className="flex items-center gap-1.5 text-orange-600 text-sm mt-2">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{category.quoteNote}</span>
          </div>
        )}
      </div>

      {/* Options/Specifications */}
      {category.options && category.options.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-4 h-4 text-orange-500" />
            <h2 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Available Options</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {category.options.map((option, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-medium text-gray-800 text-sm mb-1">{option.type}</h3>
                <div className="flex flex-wrap gap-1">
                  {option.options.map((opt, optIdx) => (
                    <span key={optIdx} className="text-xs text-gray-500">
                      {opt}{optIdx < option.options.length - 1 && " • "}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our {category.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.services && category.services.map((product) => (
          <div key={product.id} className="relative group">
            <Link 
              to={`/services/${category.slug}/${product.slug}`}
              className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                <img 
                  src={product.images?.[0] || "https://picsum.photos/300/300"} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* SAVE BUTTON on product image */}
                <button
                  onClick={(e) => handleSaveProduct(e, product.id)}
                  className={`absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-md transition-colors z-10 ${
                    isProductSaved(product.id) 
                      ? 'text-red-500' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                  aria-label={isProductSaved(product.id) ? "Remove from saved" : "Save product"}
                >
                  <Heart className={`w-4 h-4 ${isProductSaved(product.id) ? 'fill-red-500' : ''}`} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.description || "Professional quality printing"}</p>
                {product.pricing?.type === "fixed" ? (
                  <p className="text-orange-600 font-bold">
                    {product.pricing.amount} {product.pricing.currency} 
                    <span className="text-xs font-normal text-gray-500"> / {product.pricing.unit}</span>
                  </p>
                ) : (
                  <p className="text-orange-600 text-sm">Request Quote</p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}