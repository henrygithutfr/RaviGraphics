import { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, Calendar, Eye, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function AdminUsers() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("admin");
    
    if (!token || !adminData) {
      navigate("/admin");
    }
  }, [navigate]);
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirm) return;
    
    setDeleting(true);
    try {
      await axios.delete(`${API}/api/admin/users/${deleteConfirm._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      
      // Remove user from list
      setUsers(users.filter(u => u._id !== deleteConfirm._id));
      setDeleteConfirm(null);
      setSelectedUser(null);
      
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading users...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
        <p className="text-sm text-gray-500">Total: {users.length} users</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Phone</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Joined</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Saved Items</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{user.phone}</span>
                    </div>
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                   </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {user.savedProducts?.length || 0} items
                    </span>
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1 text-gray-500 hover:text-orange-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(user)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                   </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedUser.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Saved Products</p>
                <p className="font-medium">{selectedUser.savedProducts?.length || 0} items</p>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setDeleteConfirm(selectedUser);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete User
              </button>
              <button onClick={() => setSelectedUser(null)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-red-600">Confirm Delete</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this user?
              </p>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="font-medium">{deleteConfirm.name}</p>
                <p className="text-sm text-gray-500">{deleteConfirm.email}</p>
                <p className="text-sm text-gray-500">{deleteConfirm.phone}</p>
              </div>
              <p className="text-sm text-red-500">
                ⚠️ This action cannot be undone. All user data will be permanently removed.
              </p>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}