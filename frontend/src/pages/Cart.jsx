import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Reveal } from '../components/UIElements';
import { Trash2, ShieldCheck, MapPin } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🌟 FIX: Load saved address from local storage so they don't have to retype it!
  const [shipping, setShipping] = useState(() => {
    const savedAddress = localStorage.getItem('maison_shipping');
    return savedAddress ? JSON.parse(savedAddress) : { address: '', city: '', postalCode: '', country: '' };
  });
  const [loading, setLoading] = useState(false);

  // 🌟 FIX: Complimentary shipping for all orders!
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || item.qty)), 0);
  const shippingCost = 0; 
  const total = subtotal + shippingCost;

  // 🌟 Real Backend Checkout Flow
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please sign in to complete your purchase.");
      navigate('/login');
      return;
    }
    
    setLoading(true);

    // 🌟 FIX: Save the address to the browser for next time!
    localStorage.setItem('maison_shipping', JSON.stringify(shipping));

    // Format items exactly how the MongoDB Order schema expects them
    const orderItems = cartItems.map(item => ({
        name: item.name,
        qty: item.quantity || item.qty,
        image: item.image,
        price: item.price,
        product: item.id || item._id,
        seller: item.user // 🌟 This is the Artisan's ID, so it routes to their dashboard!
    }));

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${user.token}` 
        },
        body: JSON.stringify({ 
          orderItems, 
          shippingAddress: shipping, 
          totalPrice: total 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }
      
      clearCart();
      navigate('/success'); // Send to the "Thank You" page
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- EMPTY CART STATE ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5] pt-40 pb-20 flex flex-col items-center justify-center text-center px-6">
        <Reveal><p className="text-[10px] font-sans text-[#b4a078] tracking-[0.3em] uppercase mb-6">Your Atelier Bag</p></Reveal>
        <Reveal delay={0.1}><h1 className="text-3xl font-serif text-[#1a1a1a] tracking-wider mb-8 text-center italic opacity-60">Your bag is currently empty</h1></Reveal>
        <Reveal delay={0.2}>
          <button onClick={() => navigate('/shop')} className="luxury-btn luxury-btn-filled px-10">
            <span>Discover Collections</span>
          </button>
        </Reveal>
      </div>
    );
  }

  // --- ACTIVE CART STATE ---
  return (
    <div className="min-h-screen bg-[#faf8f5] pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        <Reveal><h1 className="font-serif text-4xl md:text-5xl font-light tracking-[2px] text-[#1a1a1a] mb-12 text-center">Shopping Bag</h1></Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left: Items in Cart */}
          <div className="lg:col-span-7 space-y-8">
            {cartItems.map((item) => (
              <Reveal key={item.id || item._id} delay={0.1}>
                <div className="flex gap-6 pb-8 border-b border-[#e8e6e2]">
                  <img src={item.image} alt={item.name} className="w-24 h-32 object-cover bg-[#eee]" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-sans text-[9px] tracking-[2px] text-[#b4a078] uppercase mb-1">{item.category}</p>
                      <h3 className="font-serif text-xl text-[#1a1a1a] tracking-wide mb-1">{item.name}</h3>
                      <p className="font-sans text-[11px] text-[#666]">INR {item.price?.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#e8e6e2]">
                        <button onClick={() => updateQuantity(item.id || item._id, (item.quantity || item.qty) - 1)} className="px-3 py-1 hover:bg-[#f5f3f0] transition-colors">-</button>
                        <span className="px-3 font-sans text-xs">{item.quantity || item.qty}</span>
                        <button onClick={() => updateQuantity(item.id || item._id, (item.quantity || item.qty) + 1)} className="px-3 py-1 hover:bg-[#f5f3f0] transition-colors">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id || item._id)} className="text-[#999] hover:text-red-500 transition-colors flex items-center gap-1 font-sans text-[10px] tracking-widest uppercase">
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Right: Checkout & Shipping Details */}
          <div className="lg:col-span-5">
            <Reveal delay={0.3}>
              <div className="bg-[#f5f3f0] p-8 md:p-10 border border-[#e8e6e2] sticky top-32">
                <h3 className="font-serif text-2xl tracking-[2px] text-[#1a1a1a] mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-8 font-sans text-xs tracking-widest text-[#666] uppercase">
                  <div className="flex justify-between"><p>Subtotal</p><p className="text-[#1a1a1a]">INR {subtotal.toLocaleString('en-IN')}</p></div>
                  <div className="flex justify-between"><p>Shipping</p><p className="text-[#1a1a1a]">Complimentary</p></div>
                  <div className="flex justify-between pt-4 border-t border-[#e8e6e2] font-semibold text-[#1a1a1a]"><p>Total</p><p>INR {total.toLocaleString('en-IN')}</p></div>
                </div>

                {/* 🌟 Shipping Form */}
                <h3 className="font-serif text-xl tracking-[2px] text-[#1a1a1a] mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-[#b4a078]"/> Shipping Destination
                </h3>
                
                <form onSubmit={handlePlaceOrder} className="space-y-4 mb-8">
                  <input type="text" placeholder="Full Street Address" required value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} className="w-full bg-transparent border-b border-[#ccc] pb-2 text-[11px] font-sans tracking-widest uppercase focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a] placeholder:text-[#999]" />
                  <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="City" required value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} className="w-full bg-transparent border-b border-[#ccc] pb-2 text-[11px] font-sans tracking-widest uppercase focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a] placeholder:text-[#999]" />
                      <input type="text" placeholder="Postal Code" required value={shipping.postalCode} onChange={e => setShipping({...shipping, postalCode: e.target.value})} className="w-full bg-transparent border-b border-[#ccc] pb-2 text-[11px] font-sans tracking-widest uppercase focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a] placeholder:text-[#999]" />
                  </div>
                  <input type="text" placeholder="Country" required value={shipping.country} onChange={e => setShipping({...shipping, country: e.target.value})} className="w-full bg-transparent border-b border-[#ccc] pb-2 text-[11px] font-sans tracking-widest uppercase focus:outline-none focus:border-[#1a1a1a] text-[#1a1a1a] placeholder:text-[#999]" />
                  
                  <button type="submit" disabled={loading} className="luxury-btn luxury-btn-filled w-full mt-8 disabled:opacity-50">
                      <span>{loading ? 'Processing...' : 'Complete Purchase'}</span>
                  </button>
                </form>

                <div className="flex items-center gap-2 text-[#888] justify-center mt-6">
                  <ShieldCheck size={14} />
                  <p className="font-sans text-[9px] tracking-[2px] uppercase">Secure Encrypted Transaction</p>
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;