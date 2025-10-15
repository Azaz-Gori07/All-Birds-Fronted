import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartContext, setCartContext] = useState([]);

  const addToCart = (product) => {
    const alreadyInCart = cartContext.find(
      (item) => item.id === product.id && item.size === product.size
    );

    if (alreadyInCart) {
      const updatedCart = cartContext.map((item) =>
        item.id === product.id && item.size === product.size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartContext(updatedCart);
    } else {
      setCartContext([...cartContext, { ...product, quantity: 1 }]);
    }
  };

  const increaseQuantity = (id) => {
    setCartContext((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartContext((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const deleteProduct = (id) => {
    setCartContext((prev) =>
      prev.filter((item) => !(item.id === id))
    );
  };

  const value = {
    cartContext,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    deleteProduct,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
