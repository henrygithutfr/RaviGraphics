import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  Phone, 
  Mail, 
  MapPin,
  ArrowRight,
  Sun,
  Loader
} from "lucide-react";
import SEO from "./SEO";

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/services');
        setServices(response.data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get unique categories for filter
  const categories = [
    { id: "all", label: "All Services" },
    ...services.map(service => ({
      id: service.slug,
      label: service.name
    }))
  ];

  const filteredServices = services.filter(
    (service) => selectedCategory === "all" || service.slug === selectedCategory
  );

  // Helper function to get image
  const getServiceImage = (service) => {
    if (service.image && service.image !== "Untitled") {
      return service.image;
    }
    // Fallback images based on service name
    const imageMap = {
      "Visiting Cards": "https://picsum.photos/id/20/400/300",
      "ID Cards": "https://picsum.photos/id/26/400/300",
      "Leaflets": "https://picsum.photos/id/31/400/300",
      "Brochures": "https://picsum.photos/id/24/400/300",
      "Booklets": "https://picsum.photos/id/25/400/300",
      "Stickers": "https://picsum.photos/id/29/400/300",
      "Posters": "https://picsum.photos/id/30/400/300",
      "Flex": "https://picsum.photos/id/34/400/300",
      "Vinyl": "https://picsum.photos/id/34/400/300",
      "Invitations": "https://picsum.photos/id/33/400/300",
      "Flyers": "https://picsum.photos/id/31/400/300",
      "Envelopes": "https://picsum.photos/id/32/400/300",
      "PVC Files": "https://picsum.photos/id/21/400/300",
      "Letterheads": "https://picsum.photos/id/22/400/300",
    };
    return imageMap[service.name] || "https://picsum.photos/id/1/400/300";
  };

  // Helper to get product count text
  const getProductCount = (service) => {
    const count = service.services?.length || 0;
    if (count === 0) return "Coming soon";
    return `${count} product${count > 1 ? 's' : ''} available`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <SEO 
      title="Our Printing Services - Business Cards to Banners"
      description="Explore our wide range of printing services. Business cards, brochures, banners, packaging, and custom designs. Quality guaranteed. Free quote available."
    />
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-white border-b border-amber-100 pt-5 pb-12">
        <div className="max-w-7xl mx-auto px-6 text-center mt-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sun className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            High-quality printing & custom design solutions for businesses and individuals
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="top-[72px] z-10 bg-white border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${selectedCategory === cat.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Results count */}
          <p className="text-gray-400 text-sm mb-6">
            Showing {filteredServices.length} {filteredServices.length === 1 ? 'category' : 'categories'}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Link
                key={service.id || service.name}
                to={`/services/${service.slug}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
              >
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden bg-amber-50">
                  <img
                    src={getServiceImage(service)}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {service.services && service.services.length > 0 && (
                    <span className="absolute top-3 right-3 text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-medium shadow-sm">
                      {service.services.length} Products
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                    {service.description && service.description !== "Untitled" 
                      ? service.description 
                      : `Professional ${service.name.toLowerCase()} printing services with premium quality materials.`}
                  </p>
                  
                  {/* Options Preview */}
                  {service.options && service.options.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {service.options.slice(0, 2).map((option, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {option.options?.[0] || option.type}
                          </span>
                        ))}
                        {service.options.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            +{service.options.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Details */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      {service.services && service.services.length > 0 ? (
                        <p className="text-orange-600 font-semibold text-sm">
                          {getProductCount(service)}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm">Custom orders available</p>
                      )}
                    </div>
                    <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold flex items-center gap-1 group-hover:gap-2">
                      Explore <ArrowRight className="w-3 h-3 transition-all group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400">No services in this category yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Need something custom?
                </h3>
                <p className="text-gray-600">
                  Don't see what you're looking for? We do custom sizes, materials, and designs.
                </p>
              </div>
              <Link 
                to="/quote"
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
              >
                Request Custom Quote →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Bar */}
      <div className="py-8 border-t border-amber-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center gap-2 text-gray-500">
              <Phone className="w-4 h-4 text-orange-500" />
              <span className="text-sm">+91 8249007703</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Mail className="w-4 h-4 text-orange-500" />
              <span className="text-sm">ravigraphics.odisha@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-sm">Free shipping nationwide</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    </>
  );
};

export default Services;