import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReserveItemModal({
  isOpen,
  onClose,
  items,
  onReserve,
  existingReserve,
  orderId,
}) {
  const [reserveUntil, setReserveUntil] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (existingReserve) {
      setReserveUntil(new Date(existingReserve.until));
      setSelectedItems(existingReserve.items || []);
    }
  }, [existingReserve]);

  const handleSubmit = () => {
    if (!reserveUntil || selectedItems.length === 0) {
      alert("Please select at least one item and date/time!");
      return;
    }

    const reserveData = {
      items: selectedItems,
      until: reserveUntil,
      createdAt: Date.now(),
      expiryTime: Date.now() + 24 * 60 * 60 * 1000,
    };

    if (orderId) {
      localStorage.setItem(`reservedItems_${orderId}`, JSON.stringify(reserveData));
    }


    onReserve(reserveData);

    onClose();
  };

  useEffect(() => {
    if (isOpen && orderId) {
      const saved = localStorage.getItem(`reservedItems_${orderId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setReserveUntil(new Date(parsed.until));
        setSelectedItems(parsed.items);
      }
    }
  }, [isOpen, orderId]);



  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-[440px] p-6 relative"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-1">Reserve Item</h2>
            <p className="text-sm text-gray-500 mb-4">
              Reserve your item now to secure it for 24 hours. Limited stock
              available!
            </p>

            {/* Calendar Picker */}
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Reserve Until
            </label>
            <DatePicker
              selected={reserveUntil}
              onChange={(date) => setReserveUntil(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full border rounded-lg px-3 py-2 mb-5 focus:ring focus:ring-orange-300 outline-none"
              placeholderText="Select date and time"
            />

            {/* Available Stock */}
            <p className="font-semibold text-gray-700 mb-2">Available Stock</p>
            <div className="space-y-3 mb-5">
              {items && items.length > 0 ? (
                items.map((item, index) => {
                  const isSelected = selectedItems.some(
                    (i) => i.id === item.id
                  );
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedItems(
                            selectedItems.filter((i) => i.id !== item.id)
                          );
                        } else {
                          setSelectedItems([...selectedItems, item]);
                        }
                      }}
                      className={`flex items-center gap-3 border p-2 rounded-lg cursor-pointer transition ${isSelected
                        ? "border-2 border-orange-500 bg-orange-50"
                        : "border-gray-200"
                        }`}
                    >
                      <img
                        src={item.image || "https://via.placeholder.com/60"}
                        alt={item.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity
                            ? `${item.quantity} available`
                            : "In stock"}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">No items available</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
