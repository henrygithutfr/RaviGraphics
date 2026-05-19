import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Phone,
  Sun,
  User,
  Heart,
  LogOut,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import axios from "axios";
import Logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const { user, logout, openAuthModal, savedProducts } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const hoverTimeoutRef = useRef(null);
  const megaMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target || !(event.target instanceof Node)) return;

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
      if (window.innerWidth >= 768 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleClickOutside);
    };
  }, [mobileOpen]);

  // Fetch services data from MongoDB via backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API}/api/services`);
        setCategories(response.data);
        console.log(
          "✅ Services fetched from MongoDB:",
          response.data.length,
          "categories",
        );
      } catch (error) {
        console.error("Error fetching services:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowSearchSuggestions(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    categories.forEach((category) => {
      if (category.name.toLowerCase().includes(query)) {
        results.push({
          type: "category",
          id: category._id,
          name: category.name,
          slug: category.slug,
          image: category.image,
          matchType: "Category",
        });
      }

      if (category.services && category.services.length > 0) {
        category.services.forEach((product) => {
          if (product.name.toLowerCase().includes(query)) {
            results.push({
              type: "product",
              id: product.id,
              name: product.name,
              slug: product.slug,
              categorySlug: category.slug,
              categoryName: category.name,
              image: product.images?.[0] || category.image,
              price:
                product.pricing?.type === "fixed"
                  ? `${product.pricing.amount} ${product.pricing.currency}`
                  : "Quote",
              matchType: "Product",
            });
          }
        });
      }
    });

    setSearchResults(results.slice(0, 10));
    setShowSearchSuggestions(results.length > 0);
  }, [searchQuery, categories]);

  const handleKeyDown = (e) => {
    if (!showSearchSuggestions || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (
          selectedSuggestionIndex >= 0 &&
          searchResults[selectedSuggestionIndex]
        ) {
          handleSuggestionClick(searchResults[selectedSuggestionIndex]);
        } else if (searchQuery.trim()) {
          handleSearch();
        }
        break;
      case "Escape":
        setShowSearchSuggestions(false);
        setSelectedSuggestionIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowSearchSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMobileSearchOpen(false);
    }
  };

  const handleSuggestionClick = (result) => {
    setShowSearchSuggestions(false);
    setSearchQuery("");
    setSelectedSuggestionIndex(-1);
    setMobileSearchOpen(false);

    if (result.type === "category") {
      navigate(`/services/${result.slug}`);
    } else if (result.type === "product") {
      navigate(`/services/${result.categorySlug}/${result.slug}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchSuggestions(false);
    searchInputRef.current?.focus();
  };

  // Handle window resize for mega menu
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getConsistentColumns = () => {
    if (!categories.length) return [];

    let numberOfColumns;
    if (windowWidth < 1024) {
      numberOfColumns = 4;
    } else if (windowWidth < 1280) {
      numberOfColumns = 5;
    } else if (windowWidth < 1536) {
      numberOfColumns = 6;
    } else {
      numberOfColumns = 7;
    }

    const totalItems = categories.length;
    const itemsPerCol = Math.ceil(totalItems / numberOfColumns);
    const columns = [];

    for (let i = 0; i < numberOfColumns; i++) {
      const start = i * itemsPerCol;
      const end = Math.min(start + itemsPerCol, totalItems);
      if (start < totalItems) {
        columns.push(categories.slice(start, end));
      }
    }
    return columns;
  };

  const responsiveColumns = getConsistentColumns();

  const handleMouseEnter = (navName) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveMega(navName);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 30);
  };

  const handleMegaMenuEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleMegaMenuLeave = () => {
    setActiveMega(null);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const getGridClasses = () => {
    const columnCount = responsiveColumns.length;
    switch (columnCount) {
      case 4:
        return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4";
      case 5:
        return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";
      case 6:
        return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6";
      case 7:
        return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7";
      default:
        return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
    }
  };

  const getServiceUrl = (categorySlug, serviceSlug) => {
    return `/services/${categorySlug}/${serviceSlug}`;
  };

  const getCategoryUrl = (categorySlug) => {
    return `/services/${categorySlug}`;
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileSearchOpen(false);
  };

  const handleOrdersClick = () => {
    if (!user) {
      openAuthModal("login");
    } else {
      navigate("/my-orders");
    }
  };

  const handleSavedProductsClick = () => {
    if (!user) {
      openAuthModal("login");
    } else {
      navigate("/saved-products");
    }
  };

  // Get logo width based on screen size
    const getLogoWidth = () => {
    if (windowWidth < 480) return "w-[150px]";  // Very small phones
    if (windowWidth < 640) return "w-[170px]";  // Small phones
    if (windowWidth < 768) return "w-[180px]";  // Large phones
    if (windowWidth < 1024) return "w-[200px]"; // Tablets
    return "w-[200px]";                         // Desktop
  };

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-gray-100">
      {/* Top bar - Professional subtle */}
      <div className="hidden md:block bg-gray-50 border-b border-gray-100 px-6 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
            <span className="text-xs text-gray-500">
              Ravi Graphics — Where Quality Meets Excellence
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span>Free shipping on orders over ₹5000</span>
            <span className="flex items-center gap-1 hover:text-orange-500 transition-colors">
              <Phone size={12} />
              <a href="tel:+918249007703" className="hover:text-orange-500">+91 8249007703</a>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-2 sm:gap-4">
          {/* Logo - Responsive sizing */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src={Logo} 
                alt="logo" 
                className={`${getLogoWidth()} h-auto transition-all duration-300`}
              />
            </Link>
          </div>

          {/* Search Bar - Desktop Only */}
          <div
            className="hidden md:flex flex-1 max-w-md mx-4 relative"
            ref={searchRef}
          >
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() =>
                  searchQuery.trim() && setShowSearchSuggestions(true)
                }
                placeholder="Search products, categories..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>

            {/* Search Suggestions Dropdown */}
            {showSearchSuggestions && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-96 overflow-y-auto z-50">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSuggestionClick(result)}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    className={`w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0 ${
                      selectedSuggestionIndex === index ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={result.image || "https://picsum.photos/40/40"}
                        alt={result.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.name}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
                          {result.matchType}
                        </span>
                      </div>
                      {result.type === "product" && (
                        <p className="text-xs text-gray-500 truncate">
                          in {result.categoryName}
                        </p>
                      )}
                      {result.price && result.price !== "Quote" && (
                        <p className="text-xs text-orange-600 font-medium mt-0.5">
                          {result.price}
                        </p>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg] flex-shrink-0" />
                  </button>
                ))}
                <button
                  onClick={handleSearch}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-b-xl flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600">
                    View all results for "{searchQuery}"
                  </span>
                  <Search size={14} className="text-gray-400" />
                </button>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links - Hide on smaller screens */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
            <Link to="/quote">
              <button className="cursor-pointer px-4 xl:px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg flex items-center gap-2 font-medium text-sm hover:shadow-md transition-shadow whitespace-nowrap">
                Get Quote
              </button>
            </Link>
          </nav>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center gap-0.5 sm:gap-1">
            {/* Saved Products */}
            <button
              onClick={handleSavedProductsClick}
              className="relative p-1.5 sm:p-2 text-gray-500 hover:text-orange-500 transition-colors rounded-lg hover:bg-gray-50"
              aria-label="Saved Items"
            >
              <Heart size={18} className="sm:w-5 sm:h-5" />
              {user && savedProducts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] sm:text-[10px] rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
                  {savedProducts.length}
                </span>
              )}
            </button>

            {/* User Login/Profile */}
            <div className="relative ml-0.5 sm:ml-1" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 text-gray-500 hover:text-orange-500 transition-colors rounded-lg hover:bg-gray-50"
                  >
                    <User size={18} className="sm:w-5 sm:h-5" />
                    <ChevronDown
                      size={12}
                      className={`transition-transform hidden sm:block ${showUserMenu ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/my-orders");
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <ShoppingBag size={14} />
                        My Orders
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2 transition-colors rounded-b-xl"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => openAuthModal("login")}
                  className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 text-gray-500 hover:text-orange-500 transition-colors rounded-lg hover:bg-gray-50"
                >
                  <User size={18} className="sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium hidden xl:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center gap-0.5 md:hidden">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 text-gray-600 rounded-lg hover:bg-gray-50"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <button
              onClick={handleSavedProductsClick}
              className="relative p-2 text-gray-600 rounded-lg hover:bg-gray-50"
              aria-label="Saved Items"
            >
              <Heart size={18} />
              {user && savedProducts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {savedProducts.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 text-gray-600 rounded-lg hover:bg-gray-50"
                  aria-label="User Menu"
                >
                  <User size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="p-2 text-gray-600 rounded-lg hover:bg-gray-50"
                aria-label="Login"
              >
                <User size={18} />
              </button>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 -mr-1 text-gray-600 rounded-lg hover:bg-gray-50"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {mobileSearchOpen && (
          <div className="md:hidden pt-2 pb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                ref={mobileSearchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products, categories..."
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {searchQuery && searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-80 overflow-y-auto">
                {searchResults.slice(0, 5).map((result, index) => (
                  <button
                    key={`mobile-${result.type}-${result.id}`}
                    onClick={() => handleSuggestionClick(result)}
                    className="w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={result.image || "https://picsum.photos/40/40"}
                        alt={result.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {result.matchType}
                      </p>
                    </div>
                  </button>
                ))}
                <button
                  onClick={handleSearch}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-b-xl flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600">
                    View all results for "{searchQuery}"
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mega Dropdown Navbar - Professional */}
      <div className="hidden md:block bg-white border-t border-gray-100">
        <div className="relative">
          <div className="flex items-center gap-1 overflow-x-auto px-4 md:px-6 max-w-7xl mx-auto">
            <div
              onMouseEnter={() => handleMouseEnter("Services")}
              onMouseLeave={handleMouseLeave}
              className="relative shrink-0"
            >
              <a
                className={`flex items-center gap-1.5 px-4 md:px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap rounded-lg cursor-default ${
                  activeMega === "Services" 
                    ? "text-orange-600 bg-orange-50" 
                    : "text-gray-600 hover:text-orange-500 hover:bg-gray-50"
                }`}
              >
                All Services
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-150 ${activeMega === "Services" ? "rotate-180" : ""}`}
                />
              </a>

              {activeMega === "Services" && (
                <div
                  ref={megaMenuRef}
                  onMouseEnter={handleMegaMenuEnter}
                  onMouseLeave={handleMegaMenuLeave}
                  className="fixed left-0 right-0 pt-0 w-screen"
                  style={{
                    top: "auto",
                    marginTop: "0px",
                    animation: "megaDrop 0.12s ease-out forwards",
                  }}
                >
                  <style>{`@keyframes megaDrop { 0% { opacity: 0; transform: translateY(-8px); } 100% { opacity: 1; transform: translateY(0px); } }`}</style>
                  <div className="w-full bg-white border-t border-gray-100 shadow-xl max-h-[70vh] overflow-y-auto">
                    {loading ? (
                      <div className="px-6 py-12 text-center text-gray-500">
                        Loading services...
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="px-6 py-12 text-center text-gray-500">
                        No services available
                      </div>
                    ) : (
                      <div className="px-4 md:px-6 py-6 w-full">
                        <div
                          className={`grid ${getGridClasses()} gap-4 md:gap-6 w-full`}
                        >
                          {responsiveColumns.map((column, colIndex) => (
                            <div key={colIndex} className="min-w-0">
                              {column.map((cat) => (
                                <div key={cat._id || cat.name} className="mb-5">
                                  <Link
                                    to={getCategoryUrl(cat.slug)}
                                    className="font-semibold text-gray-800 mb-2 text-xs tracking-wide border-l-2 border-orange-400 pl-2 uppercase hover:text-orange-500 transition-colors block"
                                  >
                                    {cat.name}
                                  </Link>
                                  <ul className="space-y-1.5 mt-2">
                                    {cat.services
                                      ?.slice(0, 6)
                                      .map((service) => (
                                        <li key={service.id}>
                                          <Link
                                            to={getServiceUrl(
                                              cat.slug,
                                              service.slug,
                                            )}
                                            className="text-xs text-gray-500 hover:text-orange-500 transition-colors block py-0.5 truncate"
                                            title={service.name}
                                          >
                                            {service.name.length > 30
                                              ? service.name.slice(0, 27) +
                                                "..."
                                              : service.name}
                                          </Link>
                                        </li>
                                      ))}
                                    {cat.services?.length > 6 && (
                                      <li className="pt-0.5">
                                        <Link
                                          to={getCategoryUrl(cat.slug)}
                                          className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                                        >
                                          +{cat.services.length - 6} more
                                        </Link>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <Link
                            to="/services"
                            className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1"
                          >
                            Browse all categories →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/custom-design"
              className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors whitespace-nowrap"
            >
              Custom Design
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[calc(3.5rem)] bottom-0 bg-white z-40 overflow-y-auto">
          <div className="px-4 py-6 space-y-6">
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block py-3 text-base font-medium text-gray-700 hover:text-orange-500 transition-colors"
                  onClick={closeMobileMenu}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/custom-design"
                className="block py-3 text-base font-medium text-gray-700 hover:text-orange-500 transition-colors"
                onClick={closeMobileMenu}
              >
                Custom Design
              </Link>
              
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleSavedProductsClick();
                }}
                className="w-full flex items-center justify-between py-3 text-base font-medium text-gray-700 hover:text-orange-500 transition-colors"
              >
                <span>Saved Items</span>
                {user && savedProducts.length > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                    {savedProducts.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleOrdersClick();
                }}
                className="block py-3 text-base font-medium text-gray-700 hover:text-orange-500 transition-colors w-full text-left"
              >
                My Orders
              </button>
              
              <Link
                to="/quote"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all mt-4 block text-center"
                onClick={closeMobileMenu}
              >
                Get Quote
              </Link>
            </div>

            <div className="pt-4">
              <p className="font-semibold text-gray-800 mb-3">All Services</p>
              {loading ? (
                <p className="text-gray-500 text-sm">Loading services...</p>
              ) : categories.length === 0 ? (
                <p className="text-gray-500 text-sm">No services available</p>
              ) : (
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat._id || cat.name}>
                      <details className="group">
                        <summary className="flex items-center justify-between py-2 text-gray-700 cursor-pointer list-none">
                          <span>{cat.name}</span>
                          <ChevronDown
                            size={16}
                            className="group-open:rotate-180 transition-transform"
                          />
                        </summary>
                        <ul className="pl-4 mt-2 space-y-2 pb-2">
                          {cat.services?.map((service) => (
                            <li key={service.id}>
                              <Link
                                to={getServiceUrl(cat.slug, service.slug)}
                                className="text-sm text-gray-500 hover:text-orange-500 block py-1"
                                onClick={closeMobileMenu}
                              >
                                {service.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-4 text-sm text-gray-500 border-t border-gray-100">
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-orange-500" />
                <a href="tel:+918249007703" className="hover:text-orange-500">+91 8249007703</a>
              </p>
              <p className="mt-2">Free shipping on orders over ₹5000</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}