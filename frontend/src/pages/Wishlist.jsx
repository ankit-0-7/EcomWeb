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
    <section className="min-h-screen bg-heritage-bgLight pt-[140px] pb-[100px] px-10 max-w-[1400px] mx-auto selection:bg-heritage-primary selection:text-heritage-bgLight">
      
      <Reveal><p className="text-center font-sans text-[10px] letter-spacing-[5px] uppercase text-heritage-tan mb-3">Your Favourites</p></Reveal>
      <Reveal delay={0.1}><h2 className="text-center font-serif text-[42px] font-light letter-spacing-[3px] mb-2 text-heritage-textDark">Wishlist</h2></Reveal>
      <Reveal delay={0.2}><div className="gold-line mb-16"></div></Reveal>

      {/* --- EMPTY STATE --- */}
      {wishlist.length === 0 ? (
        <Reveal delay={0.3}>
          <div className="flex flex-col items-center justify-center mt-10">
            <p className="font-serif text-[24px] text-[#999] italic mb-8">Your wishlist awaits its first treasure</p>
            <button onClick={() => navigate('/shop')} className="luxury-btn luxury-btn-filled">
              <span>Discover Collections</span>
            </button>
          </div>
        </Reveal>
      ) : (
        /* --- FILLED STATE (Exact same layout as Shop) --- */
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {wishlist.map((p, i) => (
            <Reveal key={p._id} delay={0.1 + (i * 0.08)}>
              <div className="product-card group cursor-pointer" onClick={() => navigate(`/product/${p._id}`)}>
                
                <div className="relative overflow-hidden height-[380px] bg-[#eee]">
                  <img src={p.image} alt={p.name} className="width-full height-full object-cover transition-transform duration-1200 group-hover:scale-105 group-hover:brightness-90" />
                  
                  {/* Hover Overlay with Add to Bag */}
                  <div className="overlay group-hover:bg-[rgba(0,0,0,0.25)]">
                    <button 
                      className="luxury-btn luxury-btn-filled padding-[12px_32px] text-[10px] group-hover:opacity-100 group-hover:translate-y-0" 
                      onClick={e => { 
                        e.stopPropagation(); 
                        addToCart({ ...p, id: p._id, qty: 1 }); 
                        alert("Garment added to Atelier Bag.");
                      }}
                    >
                      <span>Add to Bag</span>
                    </button>
                  </div>
                  
                  {/* Remove from Wishlist Button (Heart) */}
                  <button 
                      onClick={e => { e.stopPropagation(); toggleWishlist(p); }} 
                      className="absolute top-[14px] right-[14px] bg-[rgba(255,255,255,0.9)] border-none width-[32px] height-[32px] rounded-full cursor-pointer flex items-center justify-center transition-colors hover:bg-heritage-bgLight shadow-md"
                  >
                      {/* Heart is filled because it's already in the wishlist */}
                      <Heart size={16} strokeWidth={1} fill="#1a1a1a" color="#1a1a1a" />
                  </button>
                </div>
                
                <div className="padding-[20px_4px] font-serif">
                  <p className="font-sans text-[10px] letter-spacing-[2px] color-[#999] uppercase mb-[6px]">{p.category}</p>
                  <h4 className="text-[18px] font-extralight letter-spacing-[1px] mb-[6px] text-heritage-textDark group-hover:text-heritage-tan transition-colors">{p.name}</h4>
                  <p className="text-[14px] color-[#666]">INR {p.price?.toLocaleString('en-IN')}</p>
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