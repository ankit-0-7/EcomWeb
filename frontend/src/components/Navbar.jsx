import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Menu, Search, Heart, ShoppingBag, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartContext = useContext(CartContext);
  
  // Safely calculate cart items
  const cartItems = cartContext?.cartItems || []; 
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // 🌟 STATES
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // Search Overlay State
  const [searchQuery, setSearchQuery] = useState("");  // What the user types
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false); 
    setSearchOpen(false);
  };

  // 🌟 HANDLE SEARCH SUBMISSION
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      setSearchOpen(false); // Close overlay
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`); // Send query to Shop page
      setSearchQuery(""); // Clear input
    }
  };

  // LOGIC: Transparent ONLY if we are on the Home page AND haven't scrolled AND search is closed
  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled && !searchOpen;

  // DYNAMIC STYLES
  const navBackground = isTransparent 
    ? 'bg-transparent border-transparent' 
    : 'bg-[#faf8f5]/95 backdrop-blur-md border-b border-black/5';
    
  const textColor = isTransparent ? 'text-[#faf8f5]' : 'text-[#1a1a1a]';
  const badgeColors = isTransparent ? 'bg-[#faf8f5] text-[#1a1a1a]' : 'bg-[#1a1a1a] text-[#faf8f5]';

  const menuLinks = [
    { label: "New Arrivals", filter: "All" },
    { label: "Bridal Couture", filter: "Bridal" },
    { label: "Sarees & Weaves", filter: "Sarees" },
    { label: "Menswear", filter: "Menswear" },
    { label: "Jewellery", filter: "Jewellery" }
  ];

  return (
    <>
      {/* --- REAL NAVBAR --- */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${navBackground}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-[80px]">
          
          <div className="flex-1 flex items-center">
            <button 
              onClick={() => setMenuOpen(true)} 
              className={`${textColor} hover:text-[#b4a078] transition-colors duration-300 focus:outline-none`}
            >
              <Menu strokeWidth={1} size={28} />
            </button>
          </div>

          <div 
            onClick={() => { navigate("/"); setMenuOpen(false); setSearchOpen(false); }} 
            className="flex flex-col items-center cursor-pointer shrink-0"
          >
            <h1 className={`font-serif text-2xl md:text-3xl font-light tracking-[0.3em] uppercase transition-colors duration-500 ${textColor}`}>
              Maison
            </h1>
            <p className="font-sans text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-[#b4a078] mt-1 font-medium">
              Heritage Couture
            </p>
          </div>

          <div className="flex-1 flex items-center justify-end gap-5 md:gap-8">
            
            <button 
              onClick={() => setSearchOpen(true)} 
              className={`${textColor} hover:text-[#b4a078] transition-colors duration-300 hidden sm:block`}
            >
              <Search strokeWidth={1} size={22} />
            </button>
            
            <button 
              onClick={() => navigate('/wishlist')} 
              className={`${textColor} hover:text-[#b4a078] transition-colors duration-300`}
            >
              <Heart strokeWidth={1} size={22} />
            </button>
            
            <button 
              onClick={() => navigate('/cart')} 
              className={`relative ${textColor} hover:text-[#b4a078] transition-colors duration-300`}
            >
              <ShoppingBag strokeWidth={1} size={22} />
              {totalItems > 0 && (
                <span className={`absolute -top-1.5 -right-2 text-[9px] w-[16px] h-[16px] flex items-center justify-center rounded-full font-semibold transition-colors duration-500 ${badgeColors}`}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* 🌟 FIX: Updated Account Links to show "My Orders" for Patrons! 🌟 */}
            {user ? (
              <div className="flex items-center gap-4 ml-2 hidden sm:flex">
                {user.role === 'seller' ? (
                  <button 
                    onClick={() => navigate('/dashboard')} 
                    className="font-sans text-[11px] tracking-widest uppercase text-[#b4a078] hover:opacity-70 transition-colors font-semibold"
                  >
                    Workspace
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/patron')} 
                    className="font-sans text-[11px] tracking-widest uppercase text-[#b4a078] hover:opacity-70 transition-colors font-semibold"
                  >
                    My Orders
                  </button>
                )}
                <button 
                  onClick={handleLogout} 
                  className={`font-sans text-[11px] tracking-widest uppercase ${textColor} hover:text-[#b4a078] transition-colors duration-300`}
                >
                  Exit
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className={`font-sans text-[11px] tracking-widest uppercase ${textColor} hover:text-[#b4a078] transition-colors duration-300 ml-2 hidden sm:block`}
              >
                Account
              </button>
            )}
          </div>

        </div>
      </header>

      {/* --- FULL SCREEN SEARCH OVERLAY --- */}
      <div 
        className={`fixed inset-0 z-[3000] bg-[#faf8f5]/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          searchOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
        }`}
      >
        <button 
          onClick={() => setSearchOpen(false)} 
          className="absolute top-8 right-8 md:right-12 text-[#1a1a1a] hover:text-[#b4a078] transition-colors focus:outline-none z-50 cursor-pointer"
        >
          <X strokeWidth={1} size={36} />
        </button>

        <form onSubmit={handleSearchSubmit} className="w-full max-w-[800px] px-8 relative">
          <p className="font-sans text-[10px] tracking-[5px] text-[#b4a078] mb-8 uppercase text-center">
            What are you looking for?
          </p>
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search the Atelier..." 
              className="w-full bg-transparent border-b border-[#1a1a1a] pb-4 text-center font-serif text-3xl md:text-5xl font-light text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#b4a078] transition-colors" 
              autoFocus={searchOpen} 
            />
            <button type="submit" className="absolute right-0 bottom-6 text-[#1a1a1a] hover:text-[#b4a078] transition-colors">
                <ArrowRight strokeWidth={1} size={28} />
            </button>
          </div>
        </form>
      </div>

      {/* --- FULL SCREEN OVERLAY MENU --- */}
      <div 
        className={`fixed inset-0 z-[2000] bg-[#1a1a1a] text-[#faf8f5] flex transition-all duration-500 ease-in-out ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <button 
          onClick={() => setMenuOpen(false)} 
          className="absolute top-8 right-8 md:right-12 text-[#faf8f5] hover:text-[#b4a078] transition-colors focus:outline-none z-50 cursor-pointer"
        >
          <X strokeWidth={1} size={36} />
        </button>
        
        <div className="flex-1 flex flex-col justify-center px-8 md:px-20 z-10">
          
          <p className="font-sans text-[10px] tracking-[4px] text-[#b4a078] mb-10 uppercase">
            {user ? `Welcome, ${user.role === 'seller' ? 'Artisan' : 'Patron'}` : 'Navigation'}
          </p>
          
          {menuLinks.map((item, i) => (
            <div 
              key={item.label} 
              className={`transform transition-all duration-700 ease-out ${
                menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
              }`}
              style={{ transitionDelay: `${0.1 + (i * 0.1)}s` }}
            >
              <Link 
                to={`/shop?category=${item.filter}`} 
                onClick={() => setMenuOpen(false)} 
                className="font-serif text-3xl md:text-5xl font-light text-[#faf8f5] no-underline block py-3 transition-all duration-300 tracking-[2px] hover:text-[#b4a078] hover:pl-6"
              >
                {item.label}
              </Link>
            </div>
          ))}

          {/* 🌟 FIX: Updated Mobile Menu to also show "My Orders" for Patrons! 🌟 */}
          {user && (
            <div 
              className={`transform transition-all duration-700 ease-out mt-6 ${
                menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
              }`}
              style={{ transitionDelay: `0.6s` }}
            >
              <Link 
                to={user.role === 'seller' ? "/dashboard" : "/patron"} 
                onClick={() => setMenuOpen(false)} 
                className="font-serif text-3xl md:text-5xl font-light text-[#b4a078] no-underline block py-3 transition-all duration-300 tracking-[2px] hover:text-[#faf8f5] hover:pl-6 italic"
              >
                {user.role === 'seller' ? 'Artisan Workspace' : 'My Orders'}
              </Link>
            </div>
          )}
          
          <div className="mt-16 flex gap-8 font-sans text-[10px] tracking-[3px] text-[#888]">
            {["Instagram", "Pinterest", "Facebook"].map(s => (
              <a key={s} href="#" className="uppercase hover:text-[#b4a078] transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
        
        <div 
          className="hidden md:block flex-1 bg-cover bg-center opacity-40 z-0 pointer-events-none" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80')" }} 
        />
      </div>
    </>
  );
};

export default Navbar;