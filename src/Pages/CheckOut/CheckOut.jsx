import { useState } from "react";
import { CreditCard, Truck, CheckCircle, ShoppingBag, MapPin, Phone, User } from "lucide-react";
import { useCart } from "../../Components/CartContext/cartContext";

const CheckoutSteps = () => {
  
  const { cartContext: cartItems } = useCart();

  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: ""
  });
  const [payment, setPayment] = useState("");
  const [orderId, setOrderId] = useState(null);

  // ✅ Handle Shipping
  const handleShipping = (e) => {
    e.preventDefault();
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.pincode || !shipping.phone) {
      alert("Please fill all fields");
      return;
    }
    setStep(2);
  };

  // ✅ Handle Payment
  const handlePayment = (e) => {
    e.preventDefault();
    if (!payment) {
      alert("Please select a payment method");
      return;
    }
    setStep(3);
  };

  // ✅ Place Order (API Call to backend)
  const placeOrder = async () => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const orderData = {
      items: cartItems,
      total: subtotal,
      shipping,
      payment,
    };

    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      console.log("👉 Order API Response:", data);

      if (res.ok) {
        setOrderId(data.orderId);
        setStep(4);
      } else {
        alert(data.message || "Order failed");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Something went wrong!");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping_charge = subtotal > 500 ? 0 : 40;
  const total = subtotal + shipping_charge;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Secure Checkout</h1>
          <p className="text-gray-600">Complete your purchase in just a few steps</p>
        </div>

        {/* Progress Stepper */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
              <div 
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
            
            {[
              { icon: MapPin, label: "Shipping" },
              { icon: CreditCard, label: "Payment" },
              { icon: ShoppingBag, label: "Review" },
              { icon: CheckCircle, label: "Success" }
            ].map((item, index) => {
              const Icon = item.icon;
              const isCompleted = step > index + 1;
              const isCurrent = step === index + 1;
              
              return (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-500 text-white shadow-lg scale-110"
                        : isCurrent
                        ? "bg-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200"
                        : "bg-white border-2 border-gray-300 text-gray-400"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className={`text-xs mt-2 font-medium ${isCurrent ? "text-blue-600" : "text-gray-500"}`}>
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="text-blue-600" size={28} />
                  <h2 className="text-2xl font-bold text-gray-800">Shipping Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      value={shipping.name}
                      onChange={(e) => setShipping({...shipping, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="inline mr-2" />
                      Address
                    </label>
                    <input
                      value={shipping.address}
                      onChange={(e) => setShipping({...shipping, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="House no, Street, Area"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        value={shipping.city}
                        onChange={(e) => setShipping({...shipping, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                      <input
                        value={shipping.pincode}
                        onChange={(e) => setShipping({...shipping, pincode: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Postal Code"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      value={shipping.phone}
                      onChange={(e) => setShipping({...shipping, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="10 digit mobile number"
                      required
                    />
                  </div>
                </div>

                <button
                  onClick={handleShipping}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="text-blue-600" size={28} />
                  <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {[
                    { value: "COD", label: "Cash on Delivery", desc: "Pay when you receive", icon: "💵" },
                    { value: "UPI", label: "UPI Payment", desc: "Google Pay, PhonePe, Paytm", icon: "📱" },
                    { value: "Card", label: "Credit/Debit Card", desc: "Visa, Mastercard, RuPay", icon: "💳" }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                        payment === option.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => setPayment(option.value)}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.value}
                        checked={payment === option.value}
                        onChange={(e) => setPayment(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{option.icon}</span>
                          <span className="font-semibold text-gray-800">{option.label}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Review Order →
                </button>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBag className="text-blue-600" size={28} />
                  <h2 className="text-2xl font-bold text-gray-800">Review Your Order</h2>
                </div>

                {/* Shipping Info */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Truck size={18} className="text-blue-600" />
                    Delivery Address
                  </h3>
                  <div className="space-y-1 text-gray-700">
                    <p><strong>Name:</strong> {shipping.name}</p>
                    <p><strong>Address:</strong> {shipping.address}</p>
                    <p><strong>City:</strong> {shipping.city}, {shipping.pincode}</p>
                    <p><strong>Phone:</strong> {shipping.phone}</p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CreditCard size={18} className="text-green-600" />
                    Payment Method
                  </h3>
                  <p className="text-gray-700 font-medium">{payment}</p>
                </div>

                {/* Cart Items */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">Order Items</h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.title}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={placeOrder}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Place Order & Pay
                </button>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-600" size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Order Placed Successfully! 🎉
                </h2>
                <div className="bg-gray-50 inline-block px-6 py-3 rounded-lg mb-6">
                  <p className="text-gray-600">Order ID</p>
                  <p className="text-2xl font-bold text-blue-600">#{orderId}</p>
                </div>
                <p className="text-gray-600 mb-8">Thank you for shopping with us! We'll send you a confirmation email shortly.</p>
                <button
                  onClick={() => window.location.href = "/"}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step < 4 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <img src={item?.image ? item.image.startsWith('http') ? item.image : `/${item.image}` : '/fallback.jpg'} alt="" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-700 truncate">{item.title}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">+ {cartItems.length - 3} more items</p>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping_charge === 0 ? "text-green-600 font-semibold" : ""}>
                      {shipping_charge === 0 ? "FREE" : `$${shipping_charge.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping_charge > 0 && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      💡 Add ${(500 - subtotal).toFixed(2)} more for FREE shipping!
                    </p>
                  </div>
                )}

                <div className="mt-4 space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600" />
                    <span>Easy returns within 30 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;