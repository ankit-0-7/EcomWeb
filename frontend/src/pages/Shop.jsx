import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext'; // 🌟 1. Imported ToastContext
import { Reveal } from '../components/UIElements';
import { Heart } from 'lucide-react';

// 🌟 1. IMPORT ALL YOUR LOCAL IMAGES HERE
// Make sure exact casing and extensions (.jpg vs .jpeg vs .png) match your folder perfectly!
import bridalBg from '../assets/bridal.jpg';
import sareeBg from '../assets/saree.jpg';
import menBg from '../assets/men.jpg';
import jewelBg from '../assets/jewel.jpg';
import accessoryBg from '../assets/accessory.jpg';
import coutureBg from '../assets/couture.jpg';

// 🌟 2. ASSETS DICTIONARY
const defaultAssets = {
  // Fixed: Replaced the missing 'allBg' variable with a reliable web URL so the page doesn't crash
  "All": { title: "The Collection", subtitle: "Crafted with Thread", type: "image", src: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=1400&q=80" },
  "Bridal": { title: "Bridal Couture", subtitle: "A Walk To Remember", type: "image", src: bridalBg },
  "Sarees": { title: "Heritage Weaves", subtitle: "Six Yards of Grace", type: "image", src: sareeBg },
  "Menswear": { title: "Menswear", subtitle: "Tailored Heritage", type: "image", src: menBg },
  "Jewellery": { title: "Fine Jewellery", subtitle: "Heirlooms of Tomorrow", type: "image", src: jewelBg },
  "Accessories": { title: "Accessories", subtitle: "The Final Touch", type: "image", src: accessoryBg },
  "Couture": { title: "Couture", subtitle: "Bespoke Elegance", type: "image", src: coutureBg }
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [dynamicCollections, setDynamicCollections] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionQuery, setCollectionQuery] = useState(""); 

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext); // 🌟 2. Grabbed the addToast function
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    const searchFromUrl = params.get('search');
    const collectionFromUrl = params.get('collection');

    setSearchQuery(searchFromUrl || "");
    setCollectionQuery(collectionFromUrl || "");
    
    if (searchFromUrl || collectionFromUrl) {
      setActiveFilter("All"); 
    } else {
      setActiveFilter(categoryFromUrl || "All");
    }
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, colRes] = await Promise.all([
            fetch('/api/products'),
            fetch('/api/collections')
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (colRes.ok) setDynamicCollections(await colRes.json());
      } catch (err) { setError(err.message); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const categories = ["All", "Sarees", "Bridal", "Menswear", "Jewellery", "Accessories", "Couture"];
  
  let filteredProducts = products;
  
  if (collectionQuery) {
      filteredProducts = filteredProducts.filter(p => p.belongsToCollection === collectionQuery);
  } else if (activeFilter !== "All") {
      filteredProducts = filteredProducts.filter(p => p.category === activeFilter);
  }
  
  if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(lowerCaseQuery) || 
          p.description.toLowerCase().includes(lowerCaseQuery) ||
          p.category.toLowerCase().includes(lowerCaseQuery)
      );
  }

  let activeHero;
  if (searchQuery) {
      activeHero = { title: `"${searchQuery}"`, subtitle: "Search Results", type: "image", src: defaultAssets["All"].src };
  } else if (collectionQuery) {
      const matchedCollection = dynamicCollections.find(c => c.title === collectionQuery);
      if (matchedCollection) {
          activeHero = { 
              title: matchedCollection.title, 
              subtitle: matchedCollection.subtitle, 
              type: matchedCollection.image.includes('video') || matchedCollection.image.endsWith('.mp4') ? 'video' : 'image', 
              src: matchedCollection.image 
          };
      } else {
          activeHero = defaultAssets["All"]; 
      }
  } else {
      activeHero = defaultAssets[activeFilter] || defaultAssets["All"];
  }

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      
      {/* --- DYNAMIC HERO BANNER --- */}
      <div className="relative w-full h-[40vh] md:h-[50vh] mt-[80px] bg-[#1a1a1a] overflow-hidden">
        {activeHero.type === 'video' ? (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
            <source src={activeHero.src} type="video/mp4" />
          </video>
        ) : (
          <img 
            src={activeHero.src} 
            alt={activeHero.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-60" 
            onError={(e) => {
              // Safety fallback: If your local image fails to load, it will show a dark grey background instead of a broken image icon.
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <Reveal>
            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[5px] uppercase text-[#e0d5c1] mb-4">
              {activeHero.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl md:text-6xl font-normal tracking-[3px] text-[#faf8f5]">
              {activeHero.title}
            </h2>
          </Reveal>
        </div>
      </div>

      <section id="shop" className="pt-16 pb-[100px] px-6 md:px-10 max-w-[1400px] mx-auto">
        
        {/* Category Filter Buttons */}
        <Reveal delay={0.2}>
          <div className="flex justify-center gap-3 mb-16 flex-wrap">
            {categories.map(c => (
              <button 
                key={c} 
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className={`filter-btn text-[11px] tracking-[2px] uppercase px-4 py-2 transition-colors ${activeFilter === c && !searchQuery && !collectionQuery ? "text-[#5A1218] border-b border-[#5A1218]" : "text-[#999] hover:text-[#1a1a1a]"}`} 
                onClick={() => navigate(`/shop${c === 'All' ? '' : `?category=${c}`}`)}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {loading && <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-[#5A1218] border-t-transparent rounded-full animate-spin"></div></div>}
        {error && <div className="text-center py-10 text-red-500 font-sans tracking-widest text-sm uppercase">{error}</div>}
        
        {!loading && !error && filteredProducts.length === 0 && (
          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-center text-[12px] tracking-[2px] uppercase text-[#888] mt-10">
              {searchQuery ? `No garments found matching "${searchQuery}".` : "The Atelier is curating new garments for this collection."}
          </p>
        )}

        {/* The Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p, i) => (
            <Reveal key={p._id} delay={0.1 + (i % 4) * 0.08}>
              <div className="product-card group cursor-pointer" onClick={() => navigate(`/product/${p._id}`)}>
                <div className="relative overflow-hidden h-[420px] bg-[#eee]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:brightness-90" />
                  
                  <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/40 to-transparent">
                    <button 
                      className="px-8 py-3 text-[10px] tracking-widest uppercase font-medium bg-[#5A1218] text-[#faf8f5] hover:bg-[#3a0a0f] transition-colors shadow-lg translate-y-4 group-hover:translate-y-0 duration-500" 
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      onClick={e => { 
                        e.stopPropagation(); 
                        if (!user) { navigate('/login'); return; }
                        addToCart({ ...p, id: p._id, qty: 1 }); 
                        
                        // 🌟 3. REPLACED ALERT WITH TOAST NOTIFICATION
                        addToast("Beautiful choice. Added to your bag.", "success");
                      }}
                    >
                      Add to Bag
                    </button>
                  </div>
                  
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="absolute top-4 left-4 bg-[#faf8f5]/90 text-[#1a1a1a] px-3 py-1 text-[9px] tracking-[2px] uppercase font-semibold">
                    {p.tag || "NIALI"}
                  </span>

                  <button 
                    onClick={e => { 
                      e.stopPropagation(); 
                      if (!user) { navigate('/login'); return; }
                      toggleWishlist(p); 
                    }} 
                    className="absolute top-4 right-4 bg-[#faf8f5]/90 border-none w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-colors hover:bg-white shadow-sm z-10"
                  >
                    <Heart size={16} strokeWidth={1.5} fill={isInWishlist(p._id) ? "#5A1218" : "none"} color={isInWishlist(p._id) ? "#5A1218" : "#1a1a1a"} />
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
      </section>
    </div>
  );
};

export default Shop;