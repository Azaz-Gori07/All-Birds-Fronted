import { useEffect, useState } from "react";
import {
    Users,
    Package,
    PlusCircle,
    ShoppingCart,
    BarChart2,
    Settings,
    LogOut,
} from "lucide-react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

import AddProductFrom from "../Functionlity-Component/AddProduct/AddProductForm";
import ManageProduct from "../Functionlity-Component/Manage-Product/ProductsTable";
import UsersTable from "../Functionlity-Component/Users-Info/Users";
import OrderList from "../Functionlity-Component/Manage-orders/orders";
import OrderDetail from "../Functionlity-Component/Order-Details/OrderDetails";

export default function Dashboard() {
    const [active, setActive] = useState("Dashboard");
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const parseItemsSafe = (items) => {
        if (!items) return [];
        if (Array.isArray(items)) return items;
        if (typeof items === "string") {
            try {
                const parsed = JSON.parse(items);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return items.split(",").map((i) => ({ name: i }));
            }
        }

        return [];
    };


    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                console.error("backend error:", data);
                throw new Error(data?.error | "Failed to update order status");
            }

            alert(`✅ Order #${orderId} successfully set to ${newStatus}.`);
            setActiveOrderId(null);
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    useEffect(() => {
        fetch("/api/orders")
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch((err) => console.error("Error Fetching orders:", err));
    }, []);

    useEffect(() => {
        fetch("/api/orders/recent")
            .then((res) => res.json())
            .then((data) => setRecentOrders(data))
            .catch((err) => console.error("Error Fetching recent orders:", err));
    }, []);

    useEffect(() => {
        fetch("/api/users")
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error("Error Fetching users:", err));
    }, []);

    const getItemsCount = (items) => {
        if (!items) return 0;
        try {
            const parsedItems = JSON.parse(items);
            if (Array.isArray(parsedItems)) {
                return parsedItems.length;
            }
            return 0;
        } catch (err) {
            if (typeof items === "string") {
                return items.split(",").length;
            }
            return 0;
        }
    };

    const getOrderTotal = (order) => {
        const items = parseItemsSafe(order.items);

        return items.reduce((sum, item) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 1;
            return sum + price * qty;
        }, 0);
    };


    // === Dashboard Stats ===
    const totalOrders = orders.length;
    const totalUsers = users.length;
    const totalItems = orders.reduce(
        (total, order) => total + parseItemsSafe(order.items).length,
        0
    );

    const totalRevenue =
        orders.reduce((total, order) => total + getOrderTotal(order), 0).toFixed(2);


    const salesByDate = (() => {
        const map = {};
        orders.forEach((order) => {
            if (!order.created_at) return;
            const date = new Date(order.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
            });
            const total = getOrderTotal(order);
            map[date] = (map[date] || 0) + total;
        });

        return Object.entries(map)
            .map(([date, revenue]) => ({ date, revenue }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-7);
    })();

    const role = localStorage.getItem("role");

    const menuItems = [
        { name: "Dashboard", icon: BarChart2 },
        ...(role === "superadmin" ? [{ name: "Users", icon: Users }] : []),
        { name: "Manage Products", icon: Package },
        { name: "Add Product", icon: PlusCircle },
        { name: "Orders", icon: ShoppingCart },
        { name: "Reports", icon: BarChart2 },
        { name: "Settings", icon: Settings },
        {
            name: "Logout", icon: LogOut
        },
    ];

    const fetchProducts = () => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Error Fetching products:", err));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/user";
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 text-xl font-bold border-b border-gray-200">
                    My Dashboard
                </div>
                <nav className="flex-1 p-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => {
                                if (item.name === "Logout") {
                                    handleLogout();
                                } else {
                                    setActive(item.name);
                                }
                            }}
                            className={`flex items-center gap-3 w-full p-3 rounded-lg mb-1 text-left transition ${active === item.name
                                ? "bg-gray-100 text-black font-medium"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </button>
                    ))}

                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-xl font-semibold mb-4">{active}</h1>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    {active === "Dashboard" && (
                        <div className="space-y-6">
                            {/* Top Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white p-4 rounded-xl shadow border">
                                    <h3 className="text-sm text-gray-500">Total Orders</h3>
                                    <p className="text-2xl font-bold">{totalOrders}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow border">
                                    <h3 className="text-sm text-gray-500">Users</h3>
                                    <p className="text-2xl font-bold">{totalUsers}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow border">
                                    <h3 className="text-sm text-gray-500">Products</h3>
                                    <p className="text-2xl font-bold">{totalItems}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow border">
                                    <h3 className="text-sm text-gray-500">Revenue</h3>
                                    <p className="text-2xl font-bold">₹{totalRevenue}</p>
                                </div>
                            </div>

                            {/* Charts & Top Products */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Real Sales Chart */}
                                <div className="bg-white p-6 rounded-xl shadow border">
                                    <h3 className="font-semibold mb-4">Sales (Last 7 Days)</h3>
                                    <div className="h-64">
                                        {salesByDate.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={salesByDate}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                                    <YAxis tick={{ fontSize: 12 }} />
                                                    <Tooltip
                                                        formatter={(value) => [
                                                            `₹${value.toLocaleString("en-IN")}`,
                                                            "Revenue",
                                                        ]}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="revenue"
                                                        stroke="#2563eb"
                                                        strokeWidth={3}
                                                        dot={{ r: 4 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-gray-400">
                                                No sales data available
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Top Products Placeholder */}
                                <div className="bg-white p-6 rounded-xl shadow border">
                                    <h3 className="font-semibold mb-4">Top Products</h3>
                                    <ul className="space-y-2 text-gray-700">
                                        <li>👟 Shoes - 120 sold</li>
                                        <li>🧦 Socks - 80 sold</li>
                                        <li>👕 T-Shirts - 65 sold</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Recent Orders Table */}
                            <div className="bg-white p-6 rounded-xl shadow border">
                                <h3 className="font-semibold mb-4">Recent Orders</h3>
                                <table className="w-full text-left text-gray-600">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2">Order ID</th>
                                            <th className="py-2">Customer</th>
                                            <th className="py-2">Status</th>
                                            <th className="py-2">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.length > 0 ? (
                                            recentOrders.slice(0, 5).map((order, index) => (
                                                <tr key={order.id || index} className="border-b">
                                                    <td>#{index + 1}</td>
                                                    <td>
                                                        {order.shipping_name ||
                                                            order.customer_name ||
                                                            "N/A"}
                                                    </td>
                                                    <td
                                                        className={
                                                            order.status?.toLowerCase() === "delivered"
                                                                ? "text-green-600"
                                                                : order.status?.toLowerCase() === "pending"
                                                                    ? "text-yellow-600"
                                                                    : "text-gray-600"
                                                        }
                                                    >
                                                        {order.status || "N/A"}
                                                    </td>
                                                    <td>
                                                            ₹{getOrderTotal(order).toLocaleString("en-IN")}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="text-center py-4 text-gray-500"
                                                >
                                                    No recent orders found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {active === "Users" && (
                        <div>
                            <UsersTable />
                        </div>
                    )}
                    {active === "Manage Products" && <ManageProduct />}
                    {active === "Add Product" && (
                        <AddProductFrom onProductSaved={fetchProducts} />
                    )}
                    {active === "Orders" && (
                        <div>
                            {selectedOrder === null ? (
                                <OrderList
                                    onSelectOrder={(orderId) => setSelectedOrder(orderId)}
                                />
                            ) : (
                                <OrderDetail
                                    orderId={selectedOrder}
                                    onBack={() => setSelectedOrder(null)}
                                    onStatusChange={handleStatusUpdate}
                                />
                            )}
                        </div>
                    )}
                    {active === "Reports" && <p>📈 Sales and performance reports.</p>}
                    {active === "Settings" && <p>⚙️ Configure system settings.</p>}
                    {active === "Logout" && <p>🔒 You have logged out.</p>}
                </div>
            </div>
        </div>
    );
}
