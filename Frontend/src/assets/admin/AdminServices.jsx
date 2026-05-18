import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

export default function AdminServices() {
    const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("admin");
    
    if (!token || !adminData) {
      navigate("/admin");
    }
  }, [navigate]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    price_do: "", // ADDED: Design only price
    options: [{ type: "", options: [""] }]
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/api/services`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price_do: formData.price_do ? parseInt(formData.price_do) : 0
      };
      
      if (editingCategory) {
        await axios.put(`${API}/api/admin/services/${editingCategory._id}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        });
      } else {
        await axios.post(`${API}/api/admin/services`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        });
      }
      fetchCategories();
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: "", slug: "", description: "", image: "", price_do: "", options: [{ type: "", options: [""] }] });
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${API}/api/admin/services/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        });
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { type: "", options: [""] }]
    });
  };

  const removeOption = (index) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOptionValue = (optIndex) => {
    const newOptions = [...formData.options];
    newOptions[optIndex].options.push("");
    setFormData({ ...formData, options: newOptions });
  };

  const updateOptionValue = (optIndex, valIndex, value) => {
    const newOptions = [...formData.options];
    newOptions[optIndex].options[valIndex] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const removeOptionValue = (optIndex, valIndex) => {
    const newOptions = [...formData.options];
    newOptions[optIndex].options = newOptions[optIndex].options.filter((_, i) => i !== valIndex);
    setFormData({ ...formData, options: newOptions });
  };

  if (loading) return <div className="text-center py-12">Loading categories...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories / Services</h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "", slug: "", description: "", image: "", price_do: "", options: [{ type: "", options: [""] }] });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                  <img src={category.image || "https://picsum.photos/50/50"} alt={category.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.services?.length || 0} products</p>
                  {category.price_do && category.price_do > 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Design Only: ₹{category.price_do}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category._id ? null : category._id)}
                  className="p-2 text-gray-500 hover:text-orange-600"
                >
                  {expandedCategory === category._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setFormData({
                      name: category.name,
                      slug: category.slug,
                      description: category.description || "",
                      image: category.image || "",
                      price_do: category.price_do || "",
                      options: category.options || [{ type: "", options: [""] }]
                    });
                    setShowModal(true);
                  }}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expandedCategory === category._id && (
              <div className="border-t px-6 py-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-3">{category.description || "No description"}</p>
                {category.price_do && category.price_do > 0 && (
                  <div className="mb-3 p-2 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-700">Design Only Price: ₹{category.price_do}</p>
                    <p className="text-xs text-green-600">This price will be shown for the "Design Only" option on all products in this category</p>
                  </div>
                )}
                {category.options && category.options.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Available Options:</p>
                    <div className="flex flex-wrap gap-3">
                      {category.options.map((opt, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-2 shadow-sm">
                          <p className="text-xs font-semibold text-orange-600">{opt.type}</p>
                          <p className="text-xs text-gray-500">{opt.options.join(", ")}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Link to={`/admin/products?category=${category.slug}`} className="mt-3 inline-block text-sm text-orange-600 hover:underline">
                  View Products →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingCategory ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              {/* ADDED: Design Only Price Field */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Design Only Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price_do}
                  onChange={(e) => setFormData({ ...formData, price_do: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 499"
                  min="0"
                  step="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This price will be shown for the "Design Only" option on ALL products in this category.
                  Leave empty or 0 to hide the Design Only option.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                {formData.options.map((option, optIndex) => (
                  <div key={optIndex} className="mb-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <input
                        type="text"
                        placeholder="Option type (e.g., Paper, Finish, Size)"
                        value={option.type}
                        onChange={(e) => updateOption(optIndex, "type", e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                      />
                      <button type="button" onClick={() => removeOption(optIndex)} className="ml-2 text-red-500">Remove</button>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Options values:</p>
                      {option.options.map((val, valIndex) => (
                        <div key={valIndex} className="flex gap-2 mb-1">
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => updateOptionValue(optIndex, valIndex, e.target.value)}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                          />
                          <button type="button" onClick={() => removeOptionValue(optIndex, valIndex)} className="text-red-500">✕</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addOptionValue(optIndex)} className="text-xs text-orange-500 mt-1">+ Add value</button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addOption} className="text-sm text-orange-500">+ Add Option</button>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg font-semibold">
                {editingCategory ? "Update Category" : "Create Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}