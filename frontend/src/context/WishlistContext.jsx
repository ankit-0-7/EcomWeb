import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  // Load from local storage on startup
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('maison_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('maison_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Toggle item in or out of the wishlist
  const toggleWishlist = (product) => {
    setWishlist((prevList) => {
      const exists = prevList.find(item => item._id === product._id);
      if (exists) {
        // If it's already in the wishlist, remove it
        return prevList.filter(item => item._id !== product._id);
      } else {
        // If it's not there, add it
        return [...prevList, product];
      }
    });
  };

  // Helper to check if a specific item is currently liked
  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};