import React, { useState } from "react";

const showCart = () => {
  const [cartOpen, setCartOpen] = useState(false);

  if (cartOpen) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300">
        <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out">
          {/* Cart content goes here */}
          <button onClick={() => setCartOpen(false)}>Close Cart</button>
        </div>
      </div>
    );
  }

  return (
    <button onClick={() => setCartOpen(true)} className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg">
      Open Cart
    </button>
  )
}