import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ShippingLabelDrawer({ isOpen, onClose, order, onCreate, handleStatusChange }) {
  const [selectedCarrier, setSelectedCarrier] = useState("fedex");
  const [packageWeight, setPackageWeight] = useState("");
  const [packageDimensions, setPackageDimensions] = useState({
    length: "",
    width: "",
    height: ""
  });

  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop with blur effect */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Enhanced Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Create Shipping Label</h2>
                  <p className="text-blue-100 text-sm mt-1">Order #{order.id}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800">Order Summary</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-500">Items</p>
                    <p className="font-medium">{order.items.reduce((total, item) => total + item.quantity, 0)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-medium">${order.total}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium text-green-600">Ready to Ship</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800">Shipping Address</h3>
                </div>
                
                <div className="text-gray-700">
                  <p className="font-medium text-gray-900">{order.shipping_name}</p>
                  <p className="mt-1">{order.shipping_address}</p>
                  <p>{order.shipping_city}, {order.shipping_state} {order.shipping_pincode}</p>
                  <p className="mt-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {order.shipping_phone}
                  </p>
                </div>
              </div>

              {/* Package Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800">Package Details</h3>
                </div>
                
                {/* Carrier Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Carrier</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "fedex", name: "FedEx", color: "bg-purple-600" },
                      { id: "ups", name: "UPS", color: "bg-amber-600" },
                      { id: "usps", name: "USPS", color: "bg-blue-800" }
                    ].map(carrier => (
                      <button
                        key={carrier.id}
                        onClick={() => setSelectedCarrier(carrier.id)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedCarrier === carrier.id 
                          ? `${carrier.color} text-white shadow-md` 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {carrier.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Package Weight */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Weight (lbs)</label>
                  <input
                    type="number"
                    value={packageWeight}
                    onChange={(e) => setPackageWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter weight"
                  />
                </div>
                
                {/* Package Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Dimensions (inches)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={packageDimensions.length}
                      onChange={(e) => setPackageDimensions({...packageDimensions, length: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Length"
                    />
                    <input
                      type="number"
                      value={packageDimensions.width}
                      onChange={(e) => setPackageDimensions({...packageDimensions, width: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Width"
                    />
                    <input
                      type="number"
                      value={packageDimensions.height}
                      onChange={(e) => setPackageDimensions({...packageDimensions, height: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Height"
                    />
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800">Package Contents</h3>
                </div>
                
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={
                              item?.image?.startsWith("http")
                                ? item.image
                                : `/${item.image || "fallback.jpg"}`
                            }
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">${item.price} each</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Cost Estimate */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Shipping Cost Estimate</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Carrier</span>
                    <span className="font-medium">
                      {selectedCarrier === "fedex" ? "FedEx" : 
                       selectedCarrier === "ups" ? "UPS" : "USPS"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">Ground Shipping</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Delivery</span>
                    <span className="font-medium">3-5 business days</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Estimated Cost</span>
                      <span className="font-bold text-blue-700">$12.99</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                onClick={() => {
                  onCreate();
                  if (order && typeof order.onStatusChange === 'function') {
                    order.onStatusChange(order.id, "Processing");
                  }
                  onClose();
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Create Shipping Label
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}