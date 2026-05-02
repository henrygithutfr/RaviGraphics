import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function SavedProducts() {
  const { user, savedProducts, toggleSaveProduct, openAuthModal } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allServices, setAllServices] = useState([]);

  // Fetch all services to get product details
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/services');
        setAllServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Find saved products from all services
  useEffect(() => {
    if (allServices.length > 0 && savedProducts.length > 0) {
      const foundProducts = [];
      
      allServices.forEach(category => {
        category.services?.forEach(service => {
          if (savedProducts.includes(service.id) || savedProducts.includes(service.slug)) {
            foundProducts.push({
              ...service,
              categorySlug: category.slug,
              categoryName: category.name
            });
          }
        });
      });
      
      setProducts(foundProducts);
    } else {
      setProducts([]);
    }
  }, [allServices, savedProducts]);

  // If not logged in, show login prompt
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your saved items</h2>
        <p className="text-gray-500 mb-6">Sign in to view your saved products</p>
        <button 
          onClick={() => openAuthModal('login')}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading your saved items...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No saved items yet</h2>
        <p className="text-gray-500 mb-6">Browse our services and click the heart icon to save your favorite products</p>
        <Link to="/services">
          <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
            Browse Services
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Items</h1>
        <p className="text-gray-500">{products.length} product(s) saved</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <Link to={`/services/${product.categorySlug}/${product.slug}`}>
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img 
                  src={product.images?.[0] || "https://picsum.photos/300/300"} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link to={`/services/${product.categorySlug}/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{product.categoryName}</p>
                </div>
                <button
                  onClick={() => toggleSaveProduct(product.id)}
                  className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  aria-label="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                {product.pricing?.type === "fixed" ? (
                  <p className="text-orange-600 font-bold">
                    {product.pricing.amount} {product.pricing.currency}
                    <span className="text-xs font-normal text-gray-500"> / {product.pricing.unit}</span>
                  </p>
                ) : (
                  <p className="text-orange-600 text-sm">Request Quote</p>
                )}
                <Link to={`/services/${product.categorySlug}/${product.slug}`}>
                  <button className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}