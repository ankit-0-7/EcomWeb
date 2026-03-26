import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import { Reveal } from '../components/UIElements';
import { Heart } from 'lucide-react';

const defaultAssets = {
  "All": { title: "The Boutique", subtitle: "New Season Arrivals", type: "image", src: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=1400&q=80" },
  "Bridal": { title: "Bridal Couture", subtitle: "A Walk To Remember", type: "video", src: "/hero-video.mp4" },
  "Sarees": { title: "Sarees & Weaves", subtitle: "Six Yards of Grace", type: "image", src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1400&q=80" },
  "Menswear": { title: "Menswear", subtitle: "Tailored Heritage", type: "image", src: "https://images.unsplash.com/photo-1617120084333-a26189ea7111?w=1400&q=80" },
  "Jewellery": { title: "Fine Jewellery", subtitle: "Heirlooms of Tomorrow", type: "image", src: "https://images.unsplash.com/photo-1599643477874-1065c711a7c7?w=1400&q=80" }
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [dynamicCollections, setDynamicCollections] = useState([]); // 🌟 NEW: Fetch dynamic collections for the banner
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionQuery, setCollectionQuery] = useState(""); // 🌟 NEW: Track selected collection

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🌟 WATCH THE URL FOR CHANGES
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    const searchFromUrl = params.get('search');
    const collectionFromUrl = params.get('collection');

    setSearchQuery(searchFromUrl || "");
    setCollectionQuery(collectionFromUrl || "");
    
    if (searchFromUrl || collectionFromUrl) {
      setActiveFilter("All"); // Clear category buttons if searching or viewing a collection
    } else {
      setActiveFilter(categoryFromUrl || "All");
    }
  }, [location.search]);

  // FETCH DATA
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
  
  // 🌟 THE FILTERING LOGIC
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

  // 🌟 DYNAMIC HERO BANNER LOGIC
  let activeHero;
  if (searchQuery) {
      activeHero = { title: `"${searchQuery}"`, subtitle: "Search Results", type: "image", src: defaultAssets["All"].src };
  } else if (collectionQuery) {
      // Find the specific collection the user clicked to use its image!
      const matchedCollection = dynamicCollections.find(c => c.title === collectionQuery);
      if (matchedCollection) {
          activeHero = { 
              title: matchedCollection.title, 
              subtitle: matchedCollection.subtitle, 
              type: matchedCollection.image.includes('video') || matchedCollection.image.endsWith('.mp4') ? 'video' : 'image', 
              src: matchedCollection.image 
          };
      } else {
          activeHero = defaultAssets["All"]; // Fallback
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
          <img src={activeHero.src} alt={activeHero.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <Reveal><p className="font-sans text-[10px] tracking-[5px] uppercase text-[#d4c5a9] mb-4">{activeHero.subtitle}</p></Reveal>
          <Reveal delay={0.1}><h2 className="font-serif text-4xl md:text-6xl font-light tracking-[3px] text-[#faf8f5]">{activeHero.title}</h2></Reveal>
        </div>
      </div>

      <section id="shop" className="pt-16 pb-[100px] px-6 md:px-10 max-w-[1400px] mx-auto">
        
        {/* Category Filter Buttons */}
        <Reveal delay={0.2}>
          <div className="flex justify-center gap-3 mb-16 flex-wrap font-sans">
            {categories.map(c => (
              <button 
                key={c} 
                className={`filter-btn ${activeFilter === c && !searchQuery && !collectionQuery ? "active" : ""}`} 
                onClick={() => {
                  navigate(`/shop${c === 'All' ? '' : `?category=${c}`}`);
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {loading && <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-[#b4a078] border-t-transparent rounded-full animate-spin"></div></div>}
        {error && <div className="text-center py-10 text-red-500 font-sans tracking-widest text-sm uppercase">{error}</div>}
        
        {!loading && !error && filteredProducts.length === 0 && (
          <p className="text-center font-sans text-[12px] tracking-[2px] uppercase text-[#888] mt-10">
              {searchQuery ? `No garments found matching "${searchQuery}".` : "The Atelier is curating new garments for this collection."}
          </p>
        )}

        {/* The Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p, i) => (
            <Reveal key={p._id} delay={0.1 + (i % 4) * 0.08}>
              <div className="product-card group cursor-pointer" onClick={() => navigate(`/product/${p._id}`)}>
                <div className="relative overflow-hidden h-[380px] bg-[#eee]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-90" />
                  
                  <div className="overlay group-hover:bg-black/25">
                    <button 
                      className="luxury-btn luxury-btn-filled px-8 py-3 text-[10px] group-hover:opacity-100 group-hover:translate-y-0" 
                      onClick={e => { 
                        e.stopPropagation(); 
                        if (!user) { navigate('/login'); return; }
                        addToCart({ ...p, id: p._id, qty: 1 }); 
                        alert("Added to bag!");
                      }}
                    >
                      <span>Add to Bag</span>
                    </button>
                  </div>
                  
                  <span className="tag absolute top-4 left-4 bg-white/80 text-[#1a1a1a] px-3 py-1 text-[9px] tracking-[2px] uppercase font-medium">{p.tag || "NEW SEASON"}</span>

                  <button 
                    onClick={e => { 
                      e.stopPropagation(); 
                      if (!user) { navigate('/login'); return; }
                      toggleWishlist(p); 
                    }} 
                    className="absolute top-4 right-4 bg-white/90 border-none w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-colors hover:bg-white shadow-sm z-10"
                  >
                    <Heart size={16} strokeWidth={1.5} fill={isInWishlist(p._id) ? "#1a1a1a" : "none"} color="#1a1a1a" />
                  </button>
                </div>
                
                <div className="py-5 px-1 font-serif">
                  <p className="font-sans text-[10px] tracking-[2px] text-[#999] uppercase mb-1.5">{p.category}</p>
                  <h4 className="text-lg font-light tracking-[1px] mb-1.5 text-[#1a1a1a] group-hover:text-[#b4a078] transition-colors">{p.name}</h4>
                  <p className="text-sm text-[#666]">INR {p.price?.toLocaleString('en-IN')}</p>
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