import React, { useState, useEffect } from 'react';
import { X, Edit2, Plus, MapPin } from 'lucide-react';

const FulfillItem = ({ isOpen, onClose, order, onCreate }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [sendNotification, setSendNotification] = useState(false);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Safely parse items if they're stored as string
  const orderItems = Array.isArray(order?.items) 
    ? order.items 
    : (typeof order?.items === 'string' ? JSON.parse(order.items) : []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Slide-in Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-4xl transform transition-transform duration-300 ease-in-out translate-x-0">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h1 className="text-2xl font-semibold">Fulfill Item</h1>
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Products Section */}
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Products</h2>
                    <div className="space-y-3">
                      {orderItems.map((product, index) => (
                        <div key={product.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-16 h-16 border-2 rounded flex-shrink-0 flex items-center justify-center text-white text-xs font-medium">
                              <img src={product.image || '/fallback.jpg'} alt="" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm mb-1">
                                {product.title || product.title || 'Product'}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {product.color || 'Grey'} • SKU: {product.sku || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 ml-4">
                            <span className="text-sm font-medium">{product.weight || '0 lb'}</span>
                            <div className="flex items-center gap-2 border rounded px-3 py-1">
                              <span className="text-sm font-medium">{product.quantity || 1}</span>
                              <span className="text-sm text-gray-400">of</span>
                              <span className="text-sm text-gray-600">{product.quantity || 1}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking Information Section */}
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Tracking Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tracking Number
                        </label>
                        <input
                          type="text"
                          placeholder="Input tracking number"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
                        <Plus size={16} />
                        Add another tracking number
                      </button>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sendNotification}
                          onChange={(e) => setSendNotification(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Send notif customer of shipment</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Shipping Address Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">Shipping Address</h2>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit2 size={18} />
                      </button>
                    </div>
                    
                    {/* Map */}
                    <div className="relative h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img 
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23e5e7eb' width='400' height='200'/%3E%3Cpath d='M0,100 Q100,80 200,100 T400,100' stroke='%2393c5fd' stroke-width='2' fill='none'/%3E%3Cpath d='M50,120 L350,80' stroke='%23bfdbfe' stroke-width='1' fill='none'/%3E%3C/svg%3E"
                        alt="Map"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <MapPin size={20} className="text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <p className="font-medium">{order?.shipping_name || 'Bagus Fikri'}</p>
                        <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                          View on Map
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">{order?.shipping_address || '2118 Thornridge Cir.'}</p>
                      <p className="text-sm text-gray-600">
                        {order?.shipping_city || 'Syracuse, Connecticut'}
                      </p>
                      <p className="text-sm text-gray-600">{order?.shipping_pincode || '35624'}</p>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">Contact Information</h2>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit2 size={18} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="px-4 py-2 border border-blue-500 rounded-lg text-sm text-blue-600 bg-blue-50">
                        {order?.email || 'bagus.fikri@mail.com'}
                      </div>
                      <div className="px-4 py-2 border border-blue-500 rounded-lg text-sm text-blue-600 bg-blue-50">
                        {order?.shipping_phone || '+(22)-789-907'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t px-6 py-4 bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  onCreate();
                  if (order && typeof order.onStatusChange === 'function') {
                    order.onStatusChange(order.id, "Shipped");
                  }
                  onClose();
                }}>
                  Fulfill Items
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FulfillItem;