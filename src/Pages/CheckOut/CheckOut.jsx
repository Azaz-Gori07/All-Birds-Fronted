import { useState } from "react";
import { useCart } from "../../Components/CartContext/cartContext";

const CheckoutSteps = () => {
  const { cartContext: cartItems } = useCart();

  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({});
  const [payment, setPayment] = useState("");
  const [orderId, setOrderId] = useState(null);

  // ✅ Handle Shipping
  const handleShipping = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setShipping(Object.fromEntries(data.entries()));
    setStep(2);
  };

  // ✅ Handle Payment
  const handlePayment = (e) => {
    e.preventDefault();
    setStep(3);
  };

  // ✅ Place Order (API Call to backend)
  const placeOrder = async () => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const orderData = {
      user_id: 1, // later replace with logged-in user id
      items: cartItems,
      total: subtotal,
      shipping,
      payment,
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      console.log("👉 Order API Response:", data); // Debugging

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

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ✅ Progress Bar */}
      <div className="flex justify-between items-center mb-8">
        {["Shipping", "Payment", "Review", "Success"].map((label, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center 
              ${step > index
                  ? "bg-green-500 text-white"
                  : step === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
            >
              {index + 1}
            </div>
            <p className="text-sm mt-2">{label}</p>
          </div>
        ))}
      </div>

      {/* ✅ Step 1: Shipping */}
      {step === 1 && (
        <form
          onSubmit={handleShipping}
          className="bg-white p-6 rounded-2xl shadow-md space-y-4"
        >
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <input
            name="name"
            className="w-full p-2 border rounded-lg"
            placeholder="Full Name"
            required
          />
          <input
            name="address"
            className="w-full p-2 border rounded-lg"
            placeholder="Address"
            required
          />
          <input
            name="city"
            className="w-full p-2 border rounded-lg"
            placeholder="City"
            required
          />
          <input
            name="pincode"
            className="w-full p-2 border rounded-lg"
            placeholder="Postal Code"
            required
          />
          <input
            name="phone"
            className="w-full p-2 border rounded-lg"
            placeholder="Phone"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Continue to Payment
          </button>
        </form>
      )}

      {/* ✅ Step 2: Payment */}
      {step === 2 && (
        <form
          onSubmit={handlePayment}
          className="bg-white p-6 rounded-2xl shadow-md space-y-4"
        >
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="COD"
              onChange={(e) => setPayment(e.target.value)}
              required
            />{" "}
            <span>Cash on Delivery</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="UPI"
              onChange={(e) => setPayment(e.target.value)}
            />{" "}
            <span>UPI</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="Card"
              onChange={(e) => setPayment(e.target.value)}
            />{" "}
            <span>Credit/Debit Card</span>
          </label>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Review Order
          </button>
        </form>
      )}

      {/* ✅ Step 3: Review Order */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>
              <b>Name:</b> {shipping.name}
            </p>
            <p>
              <b>Address:</b> {shipping.address}, {shipping.city},{" "}
              {shipping.pincode}
            </p>
            <p>
              <b>Phone:</b> {shipping.phone}
            </p>
            <p>
              <b>Payment:</b> {payment}
            </p>
          </div>

          <h3 className="text-lg font-semibold mt-4">Cart Items</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <span>
                {item.title} (x{item.quantity})
              </span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}

          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total</span>
            <span>
              $
              {cartItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              )}
            </span>
          </div>

          <button
            onClick={placeOrder}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Place Order
          </button>
        </div>
      )}

      {/* ✅ Step 4: Success */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-green-600">
            ✅ Order Placed Successfully!
          </h2>
          <p className="mt-4">
            Your order ID: <b>#{orderId}</b>
          </p>
          <p className="text-gray-600 mt-2">Thank you for shopping with us 🎉</p>
        </div>
      )}
    </div>
  );
};

export default CheckoutSteps;
