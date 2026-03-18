import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handlePayment = async () => {
    if (!user) {
      alert("Please sign in to complete your purchase.");
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    // ==========================================
    // 1. MOCK CHECKOUT FLOW (CURRENTLY ACTIVE)
    // ==========================================
    // We simulate a 2-second processing delay so the UI looks real
    setTimeout(() => {
      setIsProcessing(false);
      clearCart(); // Empty the bag
      navigate('/success'); // Send to confirmation page
    }, 2000);


    // ==========================================
    // 2. REAL RAZORPAY FLOW (FOR THE FUTURE)
    // ==========================================
    /* const res = await loadRazorpayScript();
    if (!res) { alert('Razorpay SDK failed to load.'); setIsProcessing(false); return; }

    try {
      const orderResponse = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ amount: cartTotal })
      });
      const orderData = await orderResponse.json();

      const options = {
        key: 'REPLACE_WITH_YOUR_FUTURE_KEY', // <-- You will put your key here later
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'The Brand Atelier',
        order_id: orderData.id,
        handler: async function (response) {
            // Verify payment on backend...
            clearCart();
            navigate('/success');
        },
        theme: { color: '#7B1818' }
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
    */
  };

  // ... (The rest of your Cart UI remains exactly the same as before)
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-heritage-bg flex flex-col items-center justify-center pt-20 px-4">
        <h2 className="text-sm font-sans text-heritage-gold tracking-[0.3em] uppercase mb-6">Your Atelier Bag</h2>
        <h1 className="text-4xl font-serif text-heritage-textLight tracking-wider mb-8 text-center">Your bag is currently empty</h1>
        <Link to="/shop" className="border border-heritage-gold text-heritage-gold hover:bg-heritage-surface font-sans text-xs uppercase tracking-widest py-4 px-10 transition-colors">Explore Collections</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-heritage-bg pt-24 pb-20 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 border-b border-heritage-border pb-6">
          <h2 className="text-xs font-sans text-heritage-gold tracking-[0.3em] uppercase mb-2">Review Selections</h2>
          <h1 className="text-4xl font-serif text-heritage-textLight tracking-wider">Your Atelier Bag</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            {cartItems.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row gap-6 bg-heritage-surface/30 border border-heritage-border p-4">
                <div className="w-full sm:w-32 aspect-[3/4] shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-sans text-heritage-gold tracking-widest uppercase mb-1">{item.category}</p>
                        <h3 className="text-xl font-serif text-heritage-textLight tracking-wide mb-2">{item.name}</h3>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="text-heritage-textLight opacity-50 hover:opacity-100 hover:text-red-400 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-sm font-sans text-heritage-textLight opacity-70 tracking-wider">INR {item.price?.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <p className="text-[10px] font-sans text-heritage-textLight opacity-60 tracking-widest uppercase">Quantity:</p>
                    <div className="flex items-center border border-heritage-border">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 text-heritage-textLight hover:text-heritage-gold transition-colors">-</button>
                      <span className="px-3 py-1 text-sm font-sans text-heritage-textLight">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 text-heritage-textLight hover:text-heritage-gold transition-colors">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-heritage-surface border border-heritage-border p-8 sticky top-32">
              <h2 className="text-xl font-serif text-heritage-textLight tracking-wide mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-sans text-heritage-textLight opacity-80 tracking-wide">
                  <span>Subtotal</span>
                  <span>INR {cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-sans text-heritage-textLight opacity-80 tracking-wide">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="w-full h-px bg-heritage-border mb-6"></div>
              
              <div className="flex justify-between text-lg font-serif text-heritage-textLight tracking-wide mb-8">
                <span>Total</span>
                <span>INR {cartTotal.toLocaleString('en-IN')}</span>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-heritage-primary hover:bg-heritage-primaryHover text-heritage-textLight font-sans text-sm uppercase tracking-widest py-5 transition-all duration-300 border border-transparent hover:border-heritage-gold shadow-[0_0_15px_rgba(123,24,24,0.3)] disabled:opacity-50"
              >
                {isProcessing ? 'Securing Transaction...' : 'Complete Purchase'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;