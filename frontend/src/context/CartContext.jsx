import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize the cart from localStorage so users don't lose items when refreshing
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('heritage_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Whenever the cart changes, save it to localStorage automatically
  useEffect(() => {
    localStorage.setItem('heritage_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if the garment is already in the bag
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // If it is, just increase the quantity
        return prevItems.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      // If it's new, add it to the bag with a quantity of 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems((prevItems) => 
      prevItems.map(item => 
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};