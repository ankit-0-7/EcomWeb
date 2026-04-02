import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { Reveal } from '../components/UIElements';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-[#faf8f5] pt-32 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto selection:bg-[#5A1218] selection:text-[#faf8f5]">
      
      <Reveal>
        <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-center text-[10px] tracking-[5px] uppercase text-[#5A1218] mb-3">
          Your Favourites
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-center text-4xl md:text-5xl font-normal tracking-[3px] mb-6 text-[#1a1a1a]">
          Wishlist
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="w-12 h-[1px] bg-[#5A1218] mx-auto mb-16"></div>
      </Reveal>

      {/* --- EMPTY STATE --- */}
      {wishlist.length === 0 ? (
        <Reveal delay={0.3}>
          <div className="flex flex-col items-center justify-center mt-10">
            <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-[#1a1a1a] tracking-wider mb-8 text-center italic opacity-60">
              Your wishlist awaits its first treasure
            </p>
            <button 
              onClick={() => navigate('/shop')} 
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className="bg-[#5A1218] text-[#faf8f5] px-10 py-4 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#3a0a0f] transition-colors shadow-lg"
            >
              <span>Discover Collections</span>
            </button>
          </div>
        </Reveal>
      ) : (
        /* --- FILLED STATE (Exact same layout as Niali Shop) --- */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map((p, i) => (
            <Reveal key={p._id} delay={0.1 + (i * 0.08)}>
              <div className="product-card group cursor-pointer" onClick={() => navigate(`/product/${p._id}`)}>
                
                <div className="relative overflow-hidden h-[420px] bg-[#eee]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:brightness-90" />
                  
                  {/* Hover Overlay with Add to Bag */}
                  <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/40 to-transparent">
                    <button 
                      className="px-8 py-3 text-[10px] tracking-widest uppercase font-medium bg-[#5A1218] text-[#faf8f5] hover:bg-[#3a0a0f] transition-colors shadow-lg translate-y-4 group-hover:translate-y-0 duration-500" 
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      onClick={e => { 
                        e.stopPropagation(); 
                        addToCart({ ...p, id: p._id, qty: 1 }); 
                        alert("Added to Niali Bag!");
                      }}
                    >
                      Add to Bag
                    </button>
                  </div>
                  
                  {/* Remove from Wishlist Button (Filled Burgundy Heart) */}
                  <button 
                      onClick={e => { e.stopPropagation(); toggleWishlist(p); }} 
                      className="absolute top-4 right-4 bg-[#faf8f5]/90 border-none w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-colors hover:bg-white shadow-sm z-10"
                  >
                      <Heart size={16} strokeWidth={1.5} fill="#5A1218" color="#5A1218" />
                  </button>
                </div>
                
                <div className="py-5 px-1 text-center">
                  <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] tracking-[2px] text-[#5A1218] uppercase mb-2">
                    {p.category}
                  </p>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-normal tracking-[1px] mb-2 text-[#1a1a1a] group-hover:text-[#5A1218] transition-colors">
                    {p.name}
                  </h4>
                  <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs text-[#666] tracking-wider">
                    INR {p.price?.toLocaleString('en-IN')}
                  </p>
                </div>

              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
};

export default Wishlist;