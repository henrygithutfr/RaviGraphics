import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SEO from "./SEO";

import {
  Search,
  Calendar,
  Users,
  TrendingUp,
  MessageSquare,
  Award,
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  ShoppingBag,
  Eye,
  ChevronRight,
  Heart,
  Sparkles,
  Layers,
  Printer,
  Briefcase,
  Clock,
  Shield,
  Truck,
  Zap,
  Globe,
  BadgeCheck,
  Building2,
  Quote as QuoteIcon,
  MoveRight,
  Play,
  ThumbsUp,
  Headphones,
  FileCheck,
  Palette,
  Layers3,
  Crown,
  Leaf,
  Rocket,
  Handshake,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Home() {
  const { toggleSaveProduct, isProductSaved, openAuthModal } = useAuth();
  const [services, setServices] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const sliderRef = useRef(null);

  // Color Palette CSS variables
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --primary: #F25C05;
        --primary-dark: #C94800;
        --bg-main: #F8F9FB;
        --surface: #FFFFFF;
        --text-primary: #1A1A1A;
        --text-secondary: #6B7280;
        --border: #E5E7EB;
        --accent-purple: #7B2CBF;
        --accent-blue: #2D9CDB;
        --accent-yellow: #F2C94C;
        --accent-red: #EB5757;
        --gradient-start: #F25C05;
        --gradient-end: #EB5757;
      }
    `;
    document.head.appendChild(style);

    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=Playfair+Display:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Fetch services from MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/services");
        setServices(response.data);

        const portfolio = [];
        response.data.forEach((category) => {
          if (category.services && category.services.length > 0) {
            category.services.slice(0, 3).forEach((service) => {
              portfolio.push({
                id: `${category.slug}-${service.id}`,
                category: category.slug,
                title: service.name,
                client: category.name,
                material:
                  category.options?.[0]?.options?.[0] || "Premium Quality",
                image:
                  service.images?.[0] ||
                  `https://picsum.photos/seed/${service.id}/400/300`,
                slug: service.slug,
                categorySlug: category.slug,
              });
            });
          }
        });
        setPortfolioItems(portfolio);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Trusted Brands/Logos
  const trustedBrands = [
    { name: "Tata Group", logo: "https://placehold.co/120x60/fef3c7/ea580c?text=Tata" },
    { name: "Reliance", logo: "https://placehold.co/120x60/fef3c7/ea580c?text=Reliance" },
    { name: "Aditya Birla", logo: "https://placehold.co/120x60/fef3c7/ea580c?text=Aditya+Birla" },
    { name: "ITC Limited", logo: "https://placehold.co/120x60/fef3c7/ea580c?text=ITC" },
    { name: "Mahindra", logo: "https://placehold.co/120x60/fef3c7/ea580c?text=Mahindra" },
    { name: "Godrej", logo: "https://placehold.co/120x60/fef3c7/ea580c?text=Godrej" },
  ];

  // Stats counter
  const [stats, setStats] = useState({
    clients: 0,
    projects: 0,
    years: 0,
    designers: 0,
  });

  useEffect(() => {
    const animateStats = () => {
      const targets = {
        clients: 5000,
        projects: 15000,
        years: 15,
        designers: 25,
      };
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        setStats({
          clients: Math.min(targets.clients, Math.floor((currentStep / steps) * targets.clients)),
          projects: Math.min(targets.projects, Math.floor((currentStep / steps) * targets.projects)),
          years: Math.min(targets.years, Math.floor((currentStep / steps) * targets.years)),
          designers: Math.min(targets.designers, Math.floor((currentStep / steps) * targets.designers)),
        });
        if (currentStep >= steps) clearInterval(interval);
      }, stepTime);
    };
    animateStats();
  }, []);

  const productImages = services.slice(0, 8).map((service, index) => ({
    id: index,
    src: service.image || `https://picsum.photos/seed/${service.slug}/1200/800`,
    alt: service.name,
    slug: service.slug,
  }));

  const duplicatedImages = [...productImages, ...productImages];

  const categories = [
    { id: "all", label: "All" },
    ...services.map((service) => ({ id: service.slug, label: service.name })),
  ];

  const filteredItems = portfolioItems.filter(
    (item) => filter === "all" || item.category === filter
  );

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  const steps = [
    { icon: Search, title: "Choose Product", description: "Browse our extensive catalog of printing solutions" },
    { icon: MessageSquare, title: "Share Requirements", description: "Tell us your specs, quantity, and preferences" },
    { icon: Palette, title: "Get Design Proof", description: "Review digital proof within 24 hours" },
    { icon: Printer, title: "Production", description: "State-of-the-art printing with quality checks" },
    { icon: Shield, title: "Quality Assurance", description: "Multi-point inspection before shipping" },
    { icon: Truck, title: "Fast Delivery", description: "Tracked shipping right to your doorstep" },
  ];

  const latestProducts = services.slice(0, 4).map((service, index) => ({
    id: service._id || index,
    name: service.name,
    category: "New Arrival",
    price: service.services?.[0]?.pricing?.type === "fixed"
      ? `From ₹${service.services[0].pricing.amount}`
      : "Request Quote",
    image: service.image || `https://picsum.photos/seed/${service.slug}/400/300`,
    badge: "New",
    slug: service.slug,
  }));

  const topProducts = services.slice(0, 6).map((service, index) => {
    return {
      id: service._id || service.slug,
      name: service.name,
      category: service.name,
      type: service.options?.[0]?.options?.[0] || "Premium Quality",
      rating: 4.8,
      reviews: Math.floor(Math.random() * 500) + 100,
      badge: index < 3 ? "Best Seller" : "Top Rated",
      image: service.image || `https://picsum.photos/seed/${service.slug}/600/400`,
      features: service.options?.slice(0, 2).map((opt) => opt.options[0]) || ["Premium Quality", "Fast Delivery"],
      slug: service.slug,
    };
  });


const words = [
  { text: "Where", font: "font-vibes", color: "text-orange" },
  { text: "Your", font: "font-elegant", color: "text-purple" },
  { text: "Ideas", font: "font-bold-modern", color: "text-orange", dynamic: true },
  { text: "Come", font: "font-modern", color: "text-main" },
  { text: "to", font: "font-modern", color: "text-gray-500" },
  { text: "Life", font: "font-elegant", color: "text-purple", dynamic: true },
  { text: "in", font: "font-modern", color: "text-gray-500" },
  { text: "Print", font: "font-bold-modern", color: "text-orange", dynamic: true }
];

const styleMap = {
  normal: "font-modern text-main",
  accent: "font-elegant text-purple",
  highlight: "font-bold-modern text-orange",
  muted: "font-modern text-gray-500"
};

// controlled variation
const getStyle = (i) => {
  const font = fonts[i % fonts.length];

  // avoid light colors stacking → keeps readability
  const color = colors[(i * 2) % colors.length];

  return `${font} ${color}`;
};

const highlightColors = [
  "text-orange",
  "text-purple",
  "text-pink",
  "text-blue"
];

const [index, setIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setIndex(prev => (prev + 1) % highlightColors.length);
  }, 2500);
  return () => clearInterval(interval);
}, []);

  return (
    <>
    <SEO 
  title="Best Printing & Graphic Design Services in India | Ravi Graphics"
  description="Professional printing & graphic design services in India. Business cards, banners, posters & custom designs. High-quality prints with fast delivery. Order now."
/>
      <style>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-main);
        }
        h1, h2 .font-display {
          font-family: 'Playfair Display', serif;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .btn-gradient {
          background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
          transition: all 0.3s ease;
        }
        .btn-gradient:hover {
          background: linear-gradient(135deg, var(--primary-dark) 0%, #C94800 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(242, 92, 5, 0.3);
        }
        .stat-card {
          background: linear-gradient(135deg, rgba(242, 92, 5, 0.05) 0%, rgba(235, 87, 87, 0.05) 100%);
          backdrop-filter: blur(10px);
        }
        .service-card {
          transition: all 0.3s ease;
        }
        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-orange-100 via-white to-purple-50">
        
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-red-200/30 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT CONTENT */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full mb-6 border border-orange-200">
                <Printer className="w-4 h-4 text-orange-600" />
                <span className="text-orange-700 text-sm font-semibold">
                  India's Premier Print Partner
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.15] tracking-tight font-bold">
  <span className="whitespace-nowrap mr-3">
    <span className="font-vibes text-orange">Where</span>{" "}
    <span className="font-vibes text-purple">Your</span>
  </span>

  <span className="font-bold-modern text-main  mr-3">Ideas</span>
  <br />
  <span className="font-modern text-main mr-3">Come</span>
  <span className="font-elegant text-purple mr-3">to Life</span>
  <span className="font-modern gradient-text">in Print</span>
</h1>
              <p className="mt-6 text-gray-600 text-base sm:text-lg max-w-lg leading-relaxed">
                Premium printing and custom designs for businesses across India.
                Fast turnaround, eco-friendly materials, and exceptional quality
                that speaks for itself.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">ISO Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Eco-Friendly</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-600">24hr Turnaround</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/quote">
                  <button className="px-8 py-3.5 btn-gradient text-white rounded-xl flex items-center gap-2 font-semibold shadow-lg">
                    Get a Free Quote <MoveRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link to="/services">
                  <button className="px-8 py-3.5 border-2 border-orange-500 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition">
                    Explore Services
                  </button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Trusted by{" "}
                    <span className="font-semibold text-orange-600">5,000+</span>{" "}
                    happy clients
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT - IMAGE GALLERY */}
            <div className="relative w-full h-full overflow-hidden">
              <div className="hidden md:flex gap-5 items-center justify-center h-full min-h-[600px]">
                <div className="relative w-72 h-[500px] overflow-hidden rounded-2xl">
                  <div className="animate-scroll-top-bottom absolute top-0 left-0 w-full">
                    {duplicatedImages.map((image, index) => (
                      <Link
                        to={`/services/${image.slug}`}
                        key={`col1-${image.id}-${index}`}
                      >
                        <div className="mb-5 p-2 cursor-pointer group">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-52 object-cover rounded-xl shadow-md transform transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="relative w-72 h-[600px] overflow-hidden rounded-2xl">
                  <div className="animate-scroll-bottom-top absolute top-0 left-0 w-full">
                    {[...duplicatedImages].reverse().map((image, index) => (
                      <Link
                        to={`/services/${image.slug}`}
                        key={`col2-${image.id}-${index}`}
                      >
                        <div className="mb-5 p-2 cursor-pointer group">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-52 object-cover rounded-xl shadow-md transform transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="relative w-72 h-[500px] overflow-hidden rounded-2xl">
                  <div className="animate-scroll-top-bottom-slow absolute top-0 left-0 w-full">
                    {duplicatedImages.map((image, index) => (
                      <Link
                        to={`/services/${image.slug}`}
                        key={`col3-${image.id}-${index}`}
                      >
                        <div className="mb-5 p-2 cursor-pointer group">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-52 object-cover rounded-xl shadow-md transform transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:hidden w-full overflow-hidden mt-4">
                <div className="animate-scroll-horizontal flex gap-4 w-max">
                  {duplicatedImages.map((image, index) => (
                    <Link
                      to={`/services/${image.slug}`}
                      key={`mobile-${image.id}-${index}`}
                    >
                      <div className="flex-shrink-0 w-48 p-2 cursor-pointer">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-32 object-cover rounded-xl shadow-lg"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <style jsx>{`
                @keyframes scrollTopToBottom {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(-50%); }
                }
                @keyframes scrollBottomToTop {
                  0% { transform: translateY(-50%); }
                  100% { transform: translateY(0); }
                }
                @keyframes scrollHorizontal {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-scroll-top-bottom { animation: scrollTopToBottom 35s linear infinite; }
                .animate-scroll-bottom-top { animation: scrollBottomToTop 45s linear infinite; }
                .animate-scroll-top-bottom-slow { animation: scrollTopToBottom 40s linear infinite; }
                .animate-scroll-horizontal { animation: scrollHorizontal 20s linear infinite; }
                .animate-scroll-top-bottom:hover,
                .animate-scroll-bottom-top:hover,
                .animate-scroll-top-bottom-slow:hover,
                .animate-scroll-horizontal:hover { animation-play-state: paused; }
              `}</style>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY SECTION */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-400 text-sm uppercase tracking-wider mb-8">
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {trustedBrands.map((brand, idx) => (
              <div
                key={idx}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-8 md:h-10 w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stat-card rounded-xl p-6 backdrop-blur-sm">
              <Users className="w-10 h-10 text-white mx-auto mb-3 opacity-80" />
              <div className="text-3xl md:text-4xl font-bold text-white">
                {stats.clients}+
              </div>
              <p className="text-orange-100 text-sm mt-1">Happy Clients</p>
            </div>
            <div className="stat-card rounded-xl p-6 backdrop-blur-sm">
              <Printer className="w-10 h-10 text-white mx-auto mb-3 opacity-80" />
              <div className="text-3xl md:text-4xl font-bold text-white">
                {stats.projects}+
              </div>
              <p className="text-orange-100 text-sm mt-1">Projects Completed</p>
            </div>
            <div className="stat-card rounded-xl p-6 backdrop-blur-sm">
              <Calendar className="w-10 h-10 text-white mx-auto mb-3 opacity-80" />
              <div className="text-3xl md:text-4xl font-bold text-white">
                {stats.years}+
              </div>
              <p className="text-orange-100 text-sm mt-1">
                Years of Excellence
              </p>
            </div>
            <div className="stat-card rounded-xl p-6 backdrop-blur-sm">
              <Award className="w-10 h-10 text-white mx-auto mb-3 opacity-80" />
              <div className="text-3xl md:text-4xl font-bold text-white">
                {stats.designers}
              </div>
              <p className="text-orange-100 text-sm mt-1">Expert Designers</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wide">
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Our Premium Services
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              Comprehensive printing solutions tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.slice(0, 14).map((item, i) => (
              <Link to={`/services/${item.slug}`} key={item._id || i}>
                <div className="service-card group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={item.image || `https://picsum.photos/seed/${item.slug}/400/300`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.services?.length || 0} products available
                    </p>
                    <div className="mt-4 flex items-center text-orange-500 font-medium text-sm">
                      Explore{" "}
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST PRODUCTS */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
            <div>
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wide">
                Fresh Arrivals
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                Latest Products
              </h2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mt-2"></div>
            </div>
            <Link to="/services">
              <button className="text-orange-600 hover:text-orange-700 transition flex items-center gap-1 group font-medium">
                View All{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <Link to={`/services/${product.slug}`} key={product.id}>
                <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
                  <div className="relative overflow-hidden h-56 bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                      {product.badge}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-500 text-xs uppercase tracking-wider">
                      {product.category}
                    </p>
                    <h3 className="font-bold text-gray-800 text-lg mt-1 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-orange-600 font-semibold mt-2">
                      {product.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wide">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
              How It Works
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              From concept to delivery in 6 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center group-hover:scale-110 transition">
                      <IconComponent className="w-7 h-7 text-orange-500" />
                    </div>
                    <span className="text-4xl font-bold text-gray-200">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/quote">
              <button className="px-8 py-3.5 btn-gradient text-white rounded-xl font-semibold inline-flex items-center gap-2 shadow-lg">
                Start Your Project <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* PORTFOLIO SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wide">
              Our Work
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              Recent Projects
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              See what we've created for businesses across India
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.slice(0, 7).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative">
            {filteredItems.length > 3 && (
              <>
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 -ml-4 hover:text-orange-500 transition"
                >
                  <ArrowLeft />
                </button>
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 -mr-4 hover:text-orange-500 transition"
                >
                  <ArrowRight />
                </button>
              </>
            )}
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto pb-4 no-scrollbar"
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              {loading
                ? [1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="min-w-[280px] sm:min-w-[320px] bg-gray-100 rounded-xl h-64 animate-pulse"
                    ></div>
                  ))
                : filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedImage(item)}
                      className="min-w-[280px] sm:min-w-[320px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer border border-gray-100 group"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-start p-4">
                          <span className="text-white text-sm font-medium">
                            View Details →
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm">{item.client}</p>
                        <p className="text-orange-500 text-xs mt-1">
                          {item.material}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 text-xl">
                  {selectedImage.title}
                </h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[50vh] object-contain bg-gray-100"
              />
              <div className="p-5">
                <p className="text-orange-600 text-sm mb-1">
                  {selectedImage.client}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  {selectedImage.material}
                </p>
                <Link to={`/services/${selectedImage.categorySlug}`}>
                  <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition">
                    View Products →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* TOP SELLING PRODUCTS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-orange-700 text-sm font-semibold">
                Best Sellers
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Top Products
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              Our most popular printing products loved by thousands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topProducts.map((product, index) => (
              <Link to={`/services/${product.slug}`} key={product.id}>
                <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer border border-gray-100">
                  <div className="relative h-60 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {product.badge}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSaveProduct(product.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                    >
                      <Heart
                        className={`w-4 h-4 ${isProductSaved(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                      />
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 font-medium">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {product.rating}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({product.reviews})
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{product.type}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.features.slice(0, 2).map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <button className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg flex items-center justify-center gap-2 font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-300 group-hover:gap-3">
                      Explore Product <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services">
              <button className="px-8 py-3 border-2 border-orange-500 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition inline-flex items-center gap-2 group">
                View All Products{" "}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wide">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
              The Ravi Graphics Advantage
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              What makes us India's preferred printing partner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Truck className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Pan-India Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                Fast and reliable shipping to every corner of India
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Shield className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-gray-600 text-sm">
                100% satisfaction guarantee on all orders
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Fast Turnaround
              </h3>
              <p className="text-gray-600 text-sm">
                24-48 hour delivery on most products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <QuoteIcon className="w-10 h-10 text-orange-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  "Exceptional quality and service! The team at Ravi Graphics
                  delivered our business cards within 48 hours. The print
                  quality is outstanding."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                    RK
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold text-sm">
                      Rajesh Kumar
                    </p>
                    <p className="text-gray-400 text-xs">CEO, Tech Solutions</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE BANNER */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to bring your vision to life?
              </h2>
              <p className="text-orange-100">
                Get a free quote today — no obligation, just expert advice
              </p>
            </div>
            <Link to="/quote">
              <button className="px-8 py-3.5 bg-white text-orange-600 font-semibold rounded-xl hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2">
                Get Free Quote <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;