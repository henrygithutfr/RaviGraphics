import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowRight, Heart } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import axios from "axios";
import Logo from "../logo-white.png";

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services data from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/services");
        setCategories(response.data);
        console.log(
          "✅ Footer - Services fetched from MongoDB:",
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

  // Get first 6 categories for quick links
  const quickCategories = categories.slice(0, 6);

  // Get first 6 services from all categories for popular services
  const popularServices = categories
    .flatMap((cat) => cat.services || [])
    .slice(0, 6);

  // Helper function to get service URL
  const getServiceUrl = (categorySlug, serviceSlug) => {
    return `/services/${categorySlug}/${serviceSlug}`;
  };

  // Helper function to get category URL
  const getCategoryUrl = (categorySlug) => {
    return `/services/${categorySlug}`;
  };

  return (
    <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="text-center sm:text-left">
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src={Logo}
                  alt="Ravi Graphics"
                  className="h-8 p-1 md:h-10 w-auto"
                />
              </Link>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Where Quality Meets Excellence — Professional printing and design
              solutions for businesses and individuals.
            </p>
            <div className="mt-4 flex justify-center sm:justify-start gap-2">
              <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                Est. 2020
              </span>
              <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                ISO Certified
              </span>
            </div>
          </div>

          {/* Categories / Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-center sm:text-left">
              Categories
            </h3>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded animate-pulse"></div>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-400 text-center sm:text-left">
                No categories available
              </p>
            ) : (
              <>
                <ul className="space-y-2 text-sm">
                  {quickCategories.map((category) => (
                    <li
                      key={category._id || category.slug}
                      className="text-center sm:text-left"
                    >
                      <Link
                        to={getCategoryUrl(category.slug)}
                        className="hover:text-white transition cursor-pointer block hover:translate-x-1 transition-all duration-200"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                {categories.length > 6 && (
                  <div className="mt-3 text-center sm:text-left">
                    <Link
                      to="/services"
                      className="text-orange-400 hover:text-orange-300 text-xs font-medium inline-flex items-center gap-1 group"
                    >
                      +{categories.length - 6} more categories
                      <ArrowRight
                        size={12}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Popular Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-center sm:text-left">
              Popular Services
            </h3>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded animate-pulse"></div>
              </div>
            ) : popularServices.length === 0 ? (
              <p className="text-sm text-gray-400 text-center sm:text-left">
                No services available
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {popularServices.map((service, idx) => {
                  const parentCategory = categories.find((cat) =>
                    cat.services?.some((s) => s.id === service.id),
                  );
                  return (
                    <li
                      key={service.id || idx}
                      className="text-center sm:text-left"
                    >
                      <Link
                        to={getServiceUrl(parentCategory?.slug, service.slug)}
                        className="hover:text-white transition cursor-pointer block hover:translate-x-1 transition-all duration-200"
                      >
                        {service.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-3 text-center sm:text-left">
              <Link
                to="/services"
                className="text-orange-400 hover:text-orange-300 text-xs font-medium inline-flex items-center gap-1 group"
              >
                View all services
                <ArrowRight
                  size={12}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-center sm:text-left">
              Get in Touch
            </h3>

            {/* Contact Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm group">
                <Phone
                  size={16}
                  className="text-gray-400 group-hover:text-orange-400 transition-colors"
                />
                <a
                  href="tel:+918249007703"
                  className="hover:text-white transition"
                >
                  +91 8249007703
                </a>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm group">
                <Mail
                  size={16}
                  className="text-gray-400 group-hover:text-orange-400 transition-colors"
                />
                <a
                  href="mailto:ravigraphics.odisha@gmail.com"
                  className="hover:text-white transition"
                >
                  ravigraphics.odisha@gmail.com
                </a>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm group">
                <MapPin
                  size={16}
                  className="text-gray-400 group-hover:text-orange-400 transition-colors"
                />
                <span className="text-gray-400">
                  Gundumala Street, R.C, Church Road, near Kalimani Apartment
                  <br />
                  Brahmapur, Odisha 760001
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center sm:justify-start gap-3 mb-4">
              <a
                href="https://www.facebook.com/ravindrajyot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook size={16} />
              </a>
              <a
                href="https://www.instagram.com/raviveduruparthi/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-pink-600 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
            </div>

            {/* Business Hours */}
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-400">Mon-Sat:</span> 10am
                - 9pm <br />
                <span className="font-medium text-gray-400">Sun:</span> 11am - 2pm
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Ravi Graphics. All rights reserved. |
            Where Quality Meets Excellence ☀️
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Link
              to="/privacy-policy"
              className="text-xs hover:text-white transition"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-conditions"
              className="text-xs hover:text-white transition"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/shipping-policy"
              className="text-xs hover:text-white transition"
            >
              Shipping Policy
            </Link>
            <Link
              to="/return-policy"
              className="text-xs hover:text-white transition"
            >
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
