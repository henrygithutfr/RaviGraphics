import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  MessageSquare,
  Download,
  FileText,
  Mail,
  Phone,
  User,
  Calendar,
  Tag,
  Package,
  Ruler,
  Palette,
  Scissors,
  Truck,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminQuotes() {
    const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("admin");
    
    if (!token || !adminData) {
      navigate("/admin");
    }
  }, [navigate]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ quoteId: null, status: "", quotedAmount: "", adminNotes: "" });
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await axios.get("http://localhost:4001/api/admin/quotes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      setQuotes(response.data.quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async () => {
    try {
      await axios.put(`http://localhost:4001/api/admin/quotes/${statusUpdate.quoteId}/status`, 
        {
          status: statusUpdate.status,
          quotedAmount: statusUpdate.quotedAmount,
          adminNotes: statusUpdate.adminNotes
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );
      fetchQuotes();
      setShowStatusModal(false);
      setStatusUpdate({ quoteId: null, status: "", quotedAmount: "", adminNotes: "" });
    } catch (error) {
      console.error("Error updating quote status:", error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Pending" },
      reviewed: { color: "bg-blue-100 text-blue-700", icon: Eye, label: "Reviewed" },
      quoted: { color: "bg-green-100 text-green-700", icon: DollarSign, label: "Quoted" },
      expired: { color: "bg-gray-100 text-gray-700", icon: AlertCircle, label: "Expired" },
      converted: { color: "bg-purple-100 text-purple-700", icon: CheckCircle, label: "Converted to Order" }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const filteredQuotes = quotes.filter(quote => {
    if (filter !== "all" && quote.status !== filter) return false;
    if (searchTerm) {
      return quote.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             quote.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
             quote.customer.phone.includes(searchTerm) ||
             quote.quoteId.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  if (loading) {
    return <div className="text-center py-12">Loading quotes...</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quote Requests</h2>
          <p className="text-sm text-gray-500 mt-1">Manage customer quote requests</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Quotes</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="quoted">Quoted</option>
            <option value="expired">Expired</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuotes.map((quote) => (
          <div key={quote._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Quote ID</p>
                <p className="font-mono font-semibold text-gray-900">{quote.quoteId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-gray-900">{new Date(quote.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium text-gray-900">{quote.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product</p>
                <p className="text-gray-900 capitalize">{quote.projectDetails.productType.replace('-', ' ')}</p>
              </div>
              <div>
                {getStatusBadge(quote.status)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedQuote(quote);
                    setStatusUpdate({ 
                      quoteId: quote._id, 
                      status: quote.status, 
                      quotedAmount: quote.quotedAmount || "",
                      adminNotes: quote.adminNotes || ""
                    });
                    setShowStatusModal(true);
                  }}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setSelectedQuote(quote)}
                  className="p-2 text-gray-500 hover:text-orange-600 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="px-6 py-3 bg-white flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span>Qty: {quote.projectDetails.quantity.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-gray-400" />
                <span>{quote.projectDetails.colorType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-gray-400" />
                <span>{quote.projectDetails.size || "Standard"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-400" />
                <span>{quote.projectDetails.turnaround} turnaround</span>
              </div>
            </div>
          </div>
        ))}

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No quote requests found</p>
          </div>
        )}
      </div>

      {/* Quote Details Modal */}
      {selectedQuote && !showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedQuote(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Quote Details</h3>
                <p className="text-sm text-gray-500">{selectedQuote.quoteId}</p>
              </div>
              <button onClick={() => setSelectedQuote(null)} className="p-1 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{selectedQuote.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{selectedQuote.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{selectedQuote.customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Company</p>
                    <p className="font-medium">{selectedQuote.customer.company || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-500" />
                  Project Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Product Type</p>
                    <p className="font-medium capitalize">{selectedQuote.projectDetails.productType.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p className="font-medium">{selectedQuote.projectDetails.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Color</p>
                    <p className="font-medium capitalize">{selectedQuote.projectDetails.colorType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Size</p>
                    <p className="font-medium">{selectedQuote.projectDetails.size || "Standard"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Material</p>
                    <p className="font-medium">{selectedQuote.projectDetails.material || "Standard"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Turnaround</p>
                    <p className="font-medium capitalize">{selectedQuote.projectDetails.turnaround}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Design Status</p>
                    <p className="font-medium">{selectedQuote.projectDetails.designStatus === "have-design" ? "Have Design" : "Need Design Help"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Budget</p>
                    <p className="font-medium">{selectedQuote.projectDetails.budget || "Not specified"}</p>
                  </div>
                </div>
                {selectedQuote.projectDetails.finishing.length > 0 && (
                  <div className="mt-3">
                    <p className="text-gray-500 text-sm">Finishing Options</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedQuote.projectDetails.finishing.map((f, i) => (
                        <span key={i} className="text-xs bg-gray-200 px-2 py-0.5 rounded">{f.replace('-', ' ')}</span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedQuote.projectDetails.description && (
                  <div className="mt-3">
                    <p className="text-gray-500 text-sm">Description</p>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{selectedQuote.projectDetails.description}</p>
                  </div>
                )}
              </div>

              {/* Files */}
              {selectedQuote.files && selectedQuote.files.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-500" />
                    Attached Files ({selectedQuote.files.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedQuote.files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{file.originalName}</span>
                          <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        {file.downloadLink && (
                          <a href={file.downloadLink} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600">
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quote Info */}
              {selectedQuote.quotedAmount && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Quoted Amount</h4>
                  <p className="text-2xl font-bold text-green-600">₹{selectedQuote.quotedAmount.toLocaleString()}</p>
                  {selectedQuote.quotedAt && (
                    <p className="text-xs text-green-600 mt-1">Quoted on: {new Date(selectedQuote.quotedAt).toLocaleString()}</p>
                  )}
                </div>
              )}

              {selectedQuote.adminNotes && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Admin Notes
                  </h4>
                  <p className="text-sm text-blue-700">{selectedQuote.adminNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowStatusModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Update Quote Status</h3>
              <button onClick={() => setShowStatusModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="quoted">Quoted</option>
                  <option value="expired">Expired</option>
                  <option value="converted">Converted to Order</option>
                </select>
              </div>

              {statusUpdate.status === "quoted" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quoted Amount (₹)</label>
                  <input
                    type="number"
                    value={statusUpdate.quotedAmount}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, quotedAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter amount"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <textarea
                  value={statusUpdate.adminNotes}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, adminNotes: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Add notes about this quote..."
                />
              </div>

              <button
                onClick={updateQuoteStatus}
                className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}