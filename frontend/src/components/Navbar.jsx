import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Menu, Search, Heart, ShoppingBag, X, ArrowRight } from 'lucide-react';

// 🌟 IMPORT BOTH LOGOS HERE
import nialiLogoLight from '../assets/niali-logo-light.png'; 
import nialiLogoMaroon from '../assets/niali-logo-maroon.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartContext = useContext(CartContext);

  const cartItems = cartContext?.cartItems || [];
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when overlays are open
  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, searchOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      setSearchOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled && !searchOpen;

  const navBg = isTransparent
    ? 'bg-transparent border-transparent'
    : 'bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#5A1218]/10';

  const textColor = isTransparent ? 'text-[#faf8f5]' : 'text-[#1a1a1a]';
  const badgeColors = isTransparent
    ? 'bg-[#faf8f5] text-[#5A1218]'
    : 'bg-[#5A1218] text-[#faf8f5]';

  const menuLinks = [
    { label: 'New Arrivals', filter: 'All' },
    { label: 'Bridal Couture', filter: 'Bridal' },
    { label: 'Sarees & Weaves', filter: 'Sarees' },
    { label: 'Menswear', filter: 'Menswear' },
    { label: 'Jewellery', filter: 'Jewellery' },
  ];

  return (
    <>
      {/* ─── NAVBAR ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${navBg}`}
      >
        <div className="w-full px-6 md:px-12 lg:px-16 flex items-center justify-between h-[80px] md:h-[90px]">
          
          {/* ── LEFT: Hamburger ── */}
          <div className="flex-1 flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(true)}
              className={`${textColor} hover:text-[#5A1218] transition-colors duration-300 focus:outline-none`}
              aria-label="Open menu"
            >
              <Menu strokeWidth={1.2} size={30} />
            </button>
          </div>

          {/* ── CENTER: Logo ── */}
          <div
            onClick={() => {
              navigate('/');
              setMenuOpen(false);
              setSearchOpen(false);
            }}
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer"
          >
            <img
              src={isTransparent ? nialiLogoLight : nialiLogoMaroon}
              alt="Niali"
              className="w-[150px] md:w-[200px] h-auto object-contain transition-all duration-500"
            />
          </div>

          {/* ── RIGHT: Icons & Auth ── */}
          <div className="flex-1 flex items-center justify-end gap-5 md:gap-7">
            <button
              onClick={() => setSearchOpen(true)}
              className={`${textColor} hover:text-[#5A1218] transition-colors duration-300`}
              aria-label="Search"
            >
              <Search strokeWidth={1.2} size={25} />
            </button>

            <button
              onClick={() => navigate('/wishlist')}
              className={`${textColor} hover:text-[#5A1218] transition-colors duration-300`}
              aria-label="Wishlist"
            >
              <Heart strokeWidth={1.2} size={25} />
            </button>

            <button
              onClick={() => navigate('/cart')}
              className={`relative ${textColor} hover:text-[#5A1218] transition-colors duration-300`}
              aria-label="Cart"
            >
              <ShoppingBag strokeWidth={1.2} size={25} />
              {totalItems > 0 && (
                <span
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className={`absolute -top-1.5 -right-2 text-[10px] w-[18px] h-[18px] flex items-center justify-center rounded-full font-semibold transition-colors duration-500 ${badgeColors}`}
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth buttons — desktop only */}
            {user ? (
              <div className="hidden sm:flex items-center gap-5 ml-2">
                <button
                  onClick={() => navigate(user.role === 'admin' ? '/dashboard' : '/patron')}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className={`text-[11px] tracking-[2px] uppercase font-semibold transition-all duration-300 ${
                    isTransparent ? 'text-[#faf8f5] hover:text-[#e0d5c1] drop-shadow-sm' : 'text-[#5A1218] hover:opacity-70'
                  }`}
                >
                  {user.role === 'admin' ? 'Workspace' : 'My Orders'}
                </button>
                <button
                  onClick={handleLogout}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className={`text-[11px] tracking-[2px] uppercase ${textColor} hover:text-[#5A1218] transition-colors duration-300`}
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className={`hidden sm:block text-[11px] tracking-[2px] uppercase ${textColor} hover:text-[#5A1218] transition-colors duration-300 ml-2`}
              >
                Account
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── SEARCH OVERLAY ─── */}
      <div
        className={`fixed inset-0 z-[3000] bg-[#faf8f5]/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          searchOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setSearchOpen(false)}
          className="absolute top-6 right-6 md:top-8 md:right-12 text-[#1a1a1a] hover:text-[#5A1218] transition-colors focus:outline-none z-50 cursor-pointer"
        >
          <X strokeWidth={1} size={32} />
        </button>

        <form onSubmit={handleSearchSubmit} className="w-full max-w-[700px] px-6 relative">
          <p
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className="text-[10px] tracking-[5px] text-[#5A1218] mb-8 uppercase text-center"
          >
            What are you looking for?
          </p>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the Atelier..."
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="w-full bg-transparent border-b border-[#1a1a1a] pb-4 text-center text-2xl md:text-5xl font-normal text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#5A1218] transition-colors"
              autoFocus={searchOpen}
            />
            <button
              type="submit"
              className="absolute right-0 bottom-5 text-[#1a1a1a] hover:text-[#5A1218] transition-colors"
            >
              <ArrowRight strokeWidth={1} size={26} />
            </button>
          </div>
        </form>
      </div>

      {/* ─── MENU OVERLAY (Restored Split-Screen Design) ─── */}
      <div
        className={`fixed inset-0 z-[2000] bg-[#1a1a1a] text-[#faf8f5] flex transition-all duration-500 ease-in-out ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 md:top-8 md:right-12 text-[#faf8f5] hover:text-[#5A1218] transition-colors focus:outline-none z-50 cursor-pointer"
          aria-label="Close menu"
        >
          <X strokeWidth={1} size={32} />
        </button>

        {/* Text Section (Left) */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-20 z-10">
          
          {/* 🌟 FIXED: Changed color to #e0d5c1 (champagne gold) and increased font size for perfect readability! */}
          <p
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className="text-[12px] md:text-[14px] tracking-[5px] text-[#e0d5c1] mb-10 uppercase"
          >
            {user ? `Welcome, ${user.role === 'admin' ? 'Nisha' : 'Patron'}` : 'Navigation'}
          </p>

          {menuLinks.map((item, i) => (
            <div
              key={item.label}
              className={`transform transition-all duration-700 ease-out ${
                menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
              }`}
              style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
            >
              <Link
                to={`/shop?category=${item.filter}`}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-3xl md:text-5xl font-normal text-[#faf8f5] no-underline block py-3 transition-all duration-300 tracking-[2px] hover:text-[#e0d5c1] hover:pl-6"
              >
                {item.label}
              </Link>
            </div>
          ))}

          {/* Mobile Auth Links */}
          <div className="sm:hidden mt-8 border-t border-[#faf8f5]/10 pt-8">
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/dashboard' : '/patron'}
                  onClick={() => setMenuOpen(false)}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className="block text-[11px] tracking-[3px] uppercase text-[#e0d5c1] mb-4"
                >
                  {user.role === 'admin' ? 'Atelier Workspace' : 'My Orders'}
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className="text-[11px] tracking-[3px] uppercase text-[#faf8f5]/60 hover:text-[#e0d5c1] transition-colors"
                >
                  Exit
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className="block text-[11px] tracking-[3px] uppercase text-[#faf8f5]/60 hover:text-[#e0d5c1] transition-colors"
              >
                Account / Login
              </Link>
            )}
          </div>

          {/* Desktop Auth Links */}
          {user && (
            <div
              className={`hidden sm:block transform transition-all duration-700 ease-out mt-6 ${
                menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
              }`}
              style={{ transitionDelay: '0.6s' }}
            >
              <Link
                to={user.role === 'admin' ? '/dashboard' : '/patron'}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-3xl md:text-5xl font-normal text-[#e0d5c1] no-underline block py-3 transition-all duration-300 tracking-[2px] hover:text-[#faf8f5] hover:pl-6 italic"
              >
                {user.role === 'admin' ? 'Atelier Workspace' : 'My Orders'}
              </Link>
            </div>
          )}

          {/* Social Links */}
          <div
            className="mt-16 flex gap-8 text-[10px] tracking-[3px] text-[#888]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {['Instagram', 'Pinterest', 'Facebook'].map((s) => (
              <a
                key={s}
                href="#"
                className="uppercase hover:text-[#faf8f5] transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Image Section (Right) */}
        <div
          className="hidden md:block flex-1 bg-cover bg-center opacity-40 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80')",
          }}
        />
      </div>
    </>
  );
};

export default Navbar;