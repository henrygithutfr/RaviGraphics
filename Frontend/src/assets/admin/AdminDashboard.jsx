import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  FileText,
} from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalServices: 0,
    totalProducts: 0,
    totalQuotes: 0,
    pendingQuotes: 0,
  });
  const [loading, setLoading] = useState(true);

  // Check admin authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("admin");
    
    if (!token || !adminData) {
      navigate("/admin");
      return;
    }
    
    setAdmin(JSON.parse(adminData));
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4001/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/admin");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { path: "/admin/quotes", icon: FileText, label: "Quotes" },
    { path: "/admin/services", icon: Package, label: "Services" },
    { path: "/admin/products", icon: Package, label: "Products" },
    { path: "/admin/users", icon: Users, label: "Users" },
  ];

  // Get current page title
  const getPageTitle = () => {
    const currentPath = location.pathname;
    const menuItem = menuItems.find(item => currentPath.includes(item.path));
    return menuItem ? menuItem.label : "Dashboard";
  };

  if (!admin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Ravi Graphics Admin
            </h1>
            {admin && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-800">{admin.name}</p>
                <p className="text-xs text-gray-500">{admin.email}</p>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.includes(item.path))
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 w-full text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <h1 className="text-xl font-semibold text-gray-800 hidden lg:block">
              {getPageTitle()}
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-600">
                  Welcome back, <span className="font-semibold">{admin?.name || "Admin"}</span>
                </p>
              </div>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Show different content based on route */}
          {location.pathname === "/admin/dashboard" && (
            <>
              {/* Stats Cards - Only on dashboard */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                      </div>
                      <ShoppingBag className="w-10 h-10 text-orange-500 opacity-50" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Pending Orders</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                      </div>
                      <Package className="w-10 h-10 text-yellow-500 opacity-50" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Quotes</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.totalQuotes}</p>
                      </div>
                      <FileText className="w-10 h-10 text-blue-500 opacity-50" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Pending Quotes</p>
                        <p className="text-3xl font-bold text-purple-600">{stats.pendingQuotes}</p>
                      </div>
                      <FileText className="w-10 h-10 text-purple-500 opacity-50" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Categories</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalServices}</p>
                      </div>
                      <Package className="w-10 h-10 text-green-500 opacity-50" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Products</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                      </div>
                      <Package className="w-10 h-10 text-indigo-500 opacity-50" />
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/admin/orders">
                      <button className="w-full px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium">
                        View All Orders
                      </button>
                    </Link>
                    <Link to="/admin/quotes">
                      <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                        View Pending Quotes
                      </button>
                    </Link>
                    <Link to="/admin/services">
                      <button className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                        Manage Categories
                      </button>
                    </Link>
                    <Link to="/admin/products">
                      <button className="w-full px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                        Manage Products
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 shadow-sm text-white">
                  <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-white/80 mb-4">
                    Contact support or check documentation for assistance
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="mailto:support@ravigraphics.com"
                      className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                    >
                      Email Support
                    </a>
                    <a
                      href="https://wa.me/918480154045"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* For other routes (orders, quotes, services, products, users), render the Outlet */}
          {location.pathname !== "/admin/dashboard" && <Outlet />}
        </div>
      </div>
    </div>
  );
}