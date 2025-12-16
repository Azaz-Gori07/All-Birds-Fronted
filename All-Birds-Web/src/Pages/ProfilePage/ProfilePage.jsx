import React, { useState, useEffect } from 'react';
import { User, Package, CreditCard, Heart, HelpCircle, Gift, Menu, X, ChevronRight, LogOut } from 'lucide-react';


function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Profile Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });
  const [editLoading, setEditLoading] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);


  // Change Password Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Get user ID from URL - example: /profile/123
  const pathParts = window.location.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login first");
          window.location.href = "/user";
          return;
        }

        // Fetch user
        const userRes = await fetch(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userData = await userRes.json();
        setUser(userData);

        // Fetch user orders
        const ordersRes = await fetch(`/api/orders/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!ordersRes.ok) throw new Error('Failed to fetch orders');
        const ordersData = await ordersRes.json();

        // Parse items JSON safely
        const parsed = ordersData.map((order) => ({
          ...order,
          items: (() => {
            if (Array.isArray(order.items)) {
              return order.items;
            }

            try {
              const arr = JSON.parse(order.items);
              return Array.isArray(arr) ? arr : [];
            } catch {
              return [];
            }
          })(),
        }));

        setOrders(parsed);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfileAndOrders();
    }
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/user'; // or use your router's navigation
  };

  // Open Edit Profile Modal
  const openEditModal = () => {
    setEditFormData({ name: user.name, email: user.email });
    setShowEditModal(true);
  };

  // Handle Edit Profile Submit
  const handleEditProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      setUser(updatedUser);
      setShowEditModal(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // Open Change Password Modal
  const openPasswordModal = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordModal(true);
  };

  // Handle Change Password Submit
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      }); console.log("token", token);

      if (!response.ok) throw new Error('Failed to change password');

      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully!');
    } catch (err) {
      console.error('Error changing password:', err);
      alert('Failed to change password. Please check your current password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'inprogress') return order.status === 'Processing';
    if (filterStatus === 'delivered') return order.status === 'Delivered';
    if (filterStatus === 'cancelled') return order.status === 'Cancelled';
    return true;
  });


  const handleSendOtp = async () => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail }),
    });
    const data = await res.json();
    if (data.success) {
      alert("OTP sent successfully!");
      setOtpSent(true);
    } else {
      alert(data.message);
    }
  };

  const handleVerifyOtp = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail, otp }),
    });
    const data = await res.json();
    if (data.success) {
      alert("OTP verified!");
      setOtpVerified(true);
    } else {
      alert(data.message);
    }
  };

  const handleResetPassword = async () => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail, otp, newPassword: resetPassword }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Password reset successfully!");
      setShowForgotModal(false);
    } else {
      alert(data.message);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <nav className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-gray-500">Home</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">My Account</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">My Orders</span>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className={`
            fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-white
            transform transition-transform duration-300 ease-in-out lg:transform-none
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:block lg:w-72 flex-shrink-0 border-r lg:border rounded-lg lg:h-fit
          `}>
            <div className="p-6">
              {/* Close button for mobile */}
              <div className="flex justify-end lg:hidden mb-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${activeTab === 'profile'
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('orders');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${activeTab === 'orders'
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium">My Orders</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('care');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${activeTab === 'care'
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">Customer Care</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('saved');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${activeTab === 'saved'
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Saved cards</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('payments');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${activeTab === 'payments'
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Pending payments</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('gifts');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${activeTab === 'gifts'
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Gift className="w-5 h-5" />
                  <span className="font-medium">Gift cards</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-50 mt-4 border-t pt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg border">
                {/* Filters */}
                <div className="p-4 sm:p-6 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterStatus === 'all'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilterStatus('inprogress')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterStatus === 'inprogress'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => setFilterStatus('delivered')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterStatus === 'delivered'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        Delivered
                      </button>
                      <button
                        onClick={() => setFilterStatus('cancelled')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterStatus === 'cancelled'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        Cancelled
                      </button>
                    </div>
                    <button className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      Select date range
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Orders List */}
                <div className="divide-y">
                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center">
                      <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                      <p className="text-gray-500">Try adjusting your filters</p>
                    </div>
                  ) : (
                    filteredOrders.map((order, idx) => (
                      <div key={idx} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col gap-4">
                          {/* Status & Date Row - On Top */}
                          <div className="flex items-center gap-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${order.status === 'In progress'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                              }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'In progress' ? 'bg-orange-500' : 'bg-green-500'
                                }`}></span>
                              {order.status}
                            </span>
                            <p className="text-sm text-gray-500">{new Date(order.created_at || order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>

                          {/* Image & Details Row */}
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={
                                  order.items && order.items.length > 0 && order.items[0].image
                                    ? order.items[0].image.startsWith("http")
                                      ? order.items[0].image
                                      : `/${order.items[0].image}`
                                    : "/api/placeholder/80/80"
                                }

                                alt={order.items && order.items.length > 0 && order.items[0].title
                                  ? order.items[0].title
                                  : 'Product'}
                                className="w-20 h-20 rounded-lg object-cover border"
                                onError={(e) => {
                                  e.target.src = '/placeholder/80/80';
                                }}
                              />
                            </div>

                            {/* Order Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-1">Order ID: {idx + 1}</h3>
                              <div className="text-sm text-gray-600 mb-2">
                                {order.items && order.items.length > 0 ? (
                                  <>
                                    {order.items.slice(0, 3).map((item, i) => (
                                      <span key={i}>
                                        {item.title}
                                        {i < Math.min(order.items.length - 1, 2) && ' | '}
                                      </span>
                                    ))}
                                    {order.items.length > 3 && (
                                      <span className="text-red-600 font-medium">
                                        {' '}& {order.items.length - 3} more items
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  'Order items'
                                )}
                              </div>
                              <p className="text-base font-semibold text-gray-900">₹ {order.total?.toLocaleString() || 0}</p>
                            </div>

                            {/* Arrow */}
                            <div className="flex-shrink-0 flex items-start pt-1">
                              <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                  <div className="relative flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                      <p className="text-red-100 text-lg">{user.email}</p>
                      <div className="mt-3 inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span className="text-sm font-medium">Active Account</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{orders.length}</p>
                    <p className="text-sm text-gray-500">Total Orders</p>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      ₹ {orders.reduce((total, order) => total + (Number(order.total) || 0), 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-500">Total Spent</p>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-500">Member Since</p>
                  </div>
                </div>

                {/* Account Details Card */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                        <p className="text-base font-medium text-gray-900">{user.name}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                        <p className="text-base font-medium text-gray-900">{user.email}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Type</label>
                        <p className="text-base font-medium text-gray-900">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 capitalize">
                            {user.role}
                          </span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Join Date</label>
                        <p className="text-base font-medium text-gray-900">
                          {new Date(user.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={openEditModal}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Edit Profile</p>
                        <p className="text-xs text-gray-500">Update your information</p>
                      </div>
                    </button>
                    <button
                      onClick={openPasswordModal}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Change Password</p>
                        <p className="text-xs text-gray-500">Update your security</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'orders' && activeTab !== 'profile' && (
              <div className="bg-white rounded-lg border p-12 text-center">
                <p className="text-gray-500">This section is under development</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
            <p
              style={{ color: "blue", cursor: "pointer", marginTop: "10px" }}
              onClick={() => (setShowForgotModal(true), setShowPasswordModal(false))}
            >
              Forgot Password?
            </p>
          </div>
        </div>
      )}

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 relative animate-fadeIn">
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6">
              Forgot Password
            </h2>

            {!otpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                />
                <button
                  onClick={handleSendOtp}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Send OTP
                </button>
              </>
            ) : !otpVerified ? (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Verify OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                />
                <button
                  onClick={handleResetPassword}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Reset Password
                </button>
              </>
            )}

            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProfilePage;
