import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

export default function AdminProducts() {
    const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("admin");
    
    if (!token || !adminData) {
      navigate("/admin");
    }
  }, [navigate]);
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    pricing: { type: "fixed", amount: "", currency: "INR", unit: "per 1000" },
    images: [""]
  });

  // Define resetForm function
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      slug: "",
      description: "",
      pricing: { type: "fixed", amount: "", currency: "INR", unit: "per 1000" },
      images: [""]
    });
    setEditingProduct(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const category = categories.find(c => c.slug === categorySlug);
      setSelectedCategory(category);
      if (category) {
        setProducts(category.services || []);
      }
    }
  }, [categorySlug, categories]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:4001/api/services");
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
      // Make sure we have valid data
      const productData = {
        id: formData.id || formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description || "",
        pricing: {
          type: formData.pricing.type,
          amount: formData.pricing.type === "fixed" ? Number(formData.pricing.amount) : undefined,
          currency: "INR",
          unit: formData.pricing.type === "fixed" ? (formData.pricing.unit || "per 1000") : undefined
        },
        images: formData.images.filter(img => img && img.trim())
      };

      // If pricing type is 'quote', remove amount and unit
      if (productData.pricing.type === "quote") {
        delete productData.pricing.amount;
        delete productData.pricing.unit;
      }

      const payload = {
        categoryId: selectedCategory._id,
        product: productData
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      if (editingProduct) {
        const response = await axios.put(
          `http://localhost:4001/api/admin/products/${editingProduct.id}`, 
          payload,
          { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
        );
        console.log("Update response:", response.data);
      } else {
        const response = await axios.post(
          "http://localhost:4001/api/admin/products", 
          payload,
          { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
        );
        console.log("Create response:", response.data);
      }
      
      await fetchCategories(); // Refresh the data
      setShowModal(false);
      resetForm(); // Now this will work
    
      alert(editingProduct ? "Product updated successfully!" : "Product created successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:4001/api/admin/products/${selectedCategory._id}/${productId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        });
        fetchCategories();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product: " + (error.response?.data?.error || error.message));
      }
    }
  };

  // Handle category price_do update
  const handleCategoryPriceDoUpdate = async (newPrice) => {
    try {
      const updatedCategory = {
        ...selectedCategory,
        price_do: newPrice ? parseInt(newPrice) : 0
      };
      
      await axios.put(`http://localhost:4001/api/admin/services/${selectedCategory._id}`, updatedCategory, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      
      // Refresh the category data
      await fetchCategories();
      // Update selected category with new price
      const updatedCat = categories.find(c => c._id === selectedCategory._id);
      setSelectedCategory(updatedCat);
      alert("Design Only price updated successfully!");
    } catch (error) {
      console.error("Error updating design only price:", error);
      alert("Error updating design only price: " + (error.response?.data?.error || error.message));
    }
  };

  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const updateImage = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  if (!selectedCategory) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-gray-500 mb-4">Select a category to manage its products</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(cat => (
              <Link key={cat._id} to={`/admin/products?category=${cat.slug}`} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/admin/services" className="text-sm text-orange-600 hover:underline mb-1 inline-block">← Back to Categories</Link>
          <h2 className="text-2xl font-bold text-gray-800">Products in {selectedCategory.name}</h2>
          {/* Display category-level design only price */}
          {selectedCategory.price_do > 0 && (
            <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-medium text-green-800">Design Only Price (Category Level)</p>
                  <p className="text-2xl font-bold text-green-600">₹{selectedCategory.price_do}</p>
                  <p className="text-xs text-green-600">Applies to all products in this category</p>
                </div>
                <button
                  onClick={() => {
                    const newPrice = prompt("Enter new Design Only price (₹):", selectedCategory.price_do);
                    if (newPrice !== null && !isNaN(newPrice)) {
                      handleCategoryPriceDoUpdate(newPrice);
                    }
                  }}
                  className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                >
                  Edit Price
                </button>
              </div>
            </div>
          )}
          {(!selectedCategory.price_do || selectedCategory.price_do === 0) && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Design Only Price</p>
                  <p className="text-gray-500">Not set</p>
                  <p className="text-xs text-gray-500">The "Design Only" option will not appear for products in this category</p>
                </div>
                <button
                  onClick={() => {
                    const newPrice = prompt("Enter Design Only price (₹):", "");
                    if (newPrice !== null && !isNaN(newPrice) && newPrice > 0) {
                      handleCategoryPriceDoUpdate(newPrice);
                    }
                  }}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                >
                  Set Price
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100 overflow-hidden">
              <img src={product.images?.[0] || "https://picsum.photos/200/200"} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{product.description || "No description"}</p>
              {product.pricing?.type === "fixed" ? (
                <p className="text-orange-600 font-bold mt-2">₹{product.pricing.amount} / {product.pricing.unit}</p>
              ) : (
                <p className="text-orange-600 text-sm mt-2">Request Quote</p>
              )}
              {/* Show that design only is available for this category */}
              {selectedCategory.price_do > 0 && product.pricing?.type === "fixed" && (
                <p className="text-xs text-green-600 mt-1">✓ Design Only available (₹{selectedCategory.price_do})</p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setFormData({
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      description: product.description || "",
                      pricing: product.pricing,
                      images: product.images || [""]
                    });
                    setShowModal(true);
                  }}
                  className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                >
                  <Edit className="w-4 h-4 inline mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">No products in this category yet.</p>
          <button onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowModal(true);
          }} className="mt-4 text-orange-600 hover:underline">Add your first product</button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingProduct ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => {
                setShowModal(false);
                resetForm();
              }} className="p-1 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-'), id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Type</label>
                  <select
                    value={formData.pricing.type}
                    onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, type: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="quote">Request Quote</option>
                  </select>
                </div>
                {formData.pricing.type === "fixed" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        value={formData.pricing.amount}
                        onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, amount: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <input
                        type="text"
                        value={formData.pricing.unit}
                        onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, unit: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="per 1000, per piece, etc."
                      />
                    </div>
                  </>
                )}
              </div>
              
              {/* Note about Design Only price */}
              {selectedCategory.price_do > 0 && formData.pricing.type === "fixed" && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    <strong>Design Only available:</strong> ₹{selectedCategory.price_do} (set at category level)
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    To change this price, go back to the category page and edit the "Design Only Price"
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images (URLs)</label>
                {formData.images.map((img, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => updateImage(idx, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Image URL"
                    />
                    <button type="button" onClick={() => removeImage(idx)} className="text-red-500">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addImage} className="text-sm text-orange-500">+ Add Image</button>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg font-semibold">
                {editingProduct ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}