import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reveal } from '../components/UIElements';
import { X } from 'lucide-react'; // 🌟 Added for the close button

import atelierBg from '../assets/atelier-bg.jpg';

const DEFAULT_COLLECTIONS = [
  { _id: '1', title: "The Handcrafted Edit", subtitle: "Details over mass production", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80" },
  { _id: '2', title: "Quiet Luxury", subtitle: "Timeless over trendy", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80" },
  { _id: '3', title: "Intentional Design", subtitle: "Meaning over noise", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80" },
];

const DEFAULT_FEATURED = [
  { _id: 'f1', name: "Midnight Velvet Sherwani", description: "Understated yet unmistakable, our signature velvet layered over a tailored waistcoat.", image: "https://images.unsplash.com/photo-1597983073493-88ec35e4af46?w=1000&q=80", category: "Menswear" },
  { _id: 'f2', name: "Ivory Silk Saree", description: "Intricate hand-embroidery on pure silk, redefining timeless grace.", image: "https://images.unsplash.com/photo-1615886284693-018ce5f2a176?w=1000&q=80", category: "Sarees" },
  { _id: 'f3', name: "Crimson Bridal Lehenga", description: "A masterpiece of craftsmanship, designed for your most unforgettable day.", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=80", category: "Bridal" },
];

/* ─── AUTO-ROTATING CAROUSEL ─── */
const FeaturedCarousel = ({ products, navigate }) => {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, hasMoved: false });
  const autoplayRef = useRef(null);

  const getCardWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.children.length) return 0;
    return track.children[0].offsetWidth + 24; // gap-6 = 24px
  }, []);

  // Auto-rotate every 4 seconds
  const startAutoplay = useCallback(() => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % products.length;
        const track = trackRef.current;
        if (track) {
          track.scrollTo({ left: getCardWidth() * next, behavior: 'smooth' });
        }
        return next;
      });
    }, 4000);
  }, [products.length, getCardWidth]);

  const stopAutoplay = () => clearInterval(autoplayRef.current);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay]);

  // Update active dot on manual scroll
  const handleScroll = useCallback(() => {
    const cw = getCardWidth();
    if (!cw) return;
    const index = Math.round(trackRef.current.scrollLeft / cw);
    setActiveIndex(Math.min(index, products.length - 1));
  }, [products.length, getCardWidth]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Drag to scroll
  const onMouseDown = (e) => {
    stopAutoplay();
    setIsDragging(true);
    dragState.current = { startX: e.pageX, scrollLeft: trackRef.current.scrollLeft, hasMoved: false };
    trackRef.current.style.cursor = 'grabbing';
    trackRef.current.style.scrollSnapType = 'none';
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const dx = e.pageX - dragState.current.startX;
    if (Math.abs(dx) > 5) dragState.current.hasMoved = true;
    trackRef.current.scrollLeft = dragState.current.scrollLeft - dx;
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    trackRef.current.style.cursor = 'grab';
    trackRef.current.style.scrollSnapType = 'x mandatory';
    startAutoplay();
  };

  const scrollTo = (index) => {
    stopAutoplay();
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: getCardWidth() * index, behavior: 'smooth' });
    setActiveIndex(index);
    startAutoplay();
  };

  return (
    <div
      className="relative"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 select-none"
        style={{
          cursor: 'grab',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: 'max(1.25rem, calc((100vw - 1320px) / 2 + 1.25rem))',
          paddingRight: 'max(1.25rem, calc((100vw - 1320px) / 2 + 1.25rem))',
        }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => {
              if (!dragState.current.hasMoved) {
                navigate(`/shop?category=${encodeURIComponent(product.category)}`);
              }
            }}
            className="snap-start shrink-0 w-[80vw] sm:w-[65vw] md:w-[42vw] lg:w-[35vw] xl:w-[400px] relative overflow-hidden cursor-pointer group"
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                draggable={false}
                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                <span
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className="text-[9px] tracking-[4px] uppercase text-[#faf8f5] bg-[#5A1218]/80 backdrop-blur-sm px-6 py-2.5"
                >
                  View Piece
                </span>
              </div>
            </div>

            <div className="pt-4 pb-1">
              <p
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className="text-[9px] tracking-[4px] uppercase text-[#5A1218] mb-1.5"
              >
                {product.category}
              </p>
              <h3
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-xl md:text-2xl font-light tracking-[1px] text-[#1a1a1a] mb-1.5 leading-snug"
              >
                {product.name}
              </h3>
              <p
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className="text-[11px] text-[#888] leading-[1.7] font-light line-clamp-2"
              >
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {products.length > 1 && (
        <div className="flex justify-center gap-2.5 mt-6">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-500 cursor-pointer border-none ${
                i === activeIndex
                  ? 'w-7 h-[3px] bg-[#5A1218]'
                  : 'w-[3px] h-[3px] bg-[#1a1a1a]/20 hover:bg-[#1a1a1a]/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── HOME PAGE ─── */
const Home = () => {
  const navigate = useNavigate();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [collections, setCollections] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle');
  
  // 🌟 NEW: State for the Welcome Offer
  const [showOffer, setShowOffer] = useState(false);

  // 🌟 NEW: Check if they've already seen the offer this session.
  // If not, wait 3.5 seconds and show it smoothly.
  useEffect(() => {
    const hasSeenOffer = sessionStorage.getItem('niali_welcome_offer');
    if (!hasSeenOffer) {
      const timer = setTimeout(() => setShowOffer(true), 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 300);

    const fetchData = async () => {
      try {
        const colRes = await fetch('/api/collections');
        const colData = await colRes.json();
        setCollections(colRes.ok && colData.length > 0 ? colData : DEFAULT_COLLECTIONS);
      } catch {
        setCollections(DEFAULT_COLLECTIONS);
      }

      try {
        const prodRes = await fetch('/api/products');
        const prodData = await prodRes.json();
        setFeaturedProducts(prodRes.ok && prodData.length > 0 ? prodData.slice(0, 5) : DEFAULT_FEATURED);
      } catch {
        setFeaturedProducts(DEFAULT_FEATURED);
      }
    };

    fetchData();
  }, []);

  // 🌟 NEW: Function to close the offer and remember they closed it
  const handleCloseOffer = () => {
    setShowOffer(false);
    sessionStorage.setItem('niali_welcome_offer', 'true');
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

    setSubscribeStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      setSubscribeStatus(res.ok ? 'success' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setSubscribeStatus('error');
    }
  };

  return (
    <div className="bg-[#faf8f5] selection:bg-[#5A1218] selection:text-[#faf8f5]">

      {/* 🌟 NEW: CLASSY WELCOME OFFER MODAL */}
      <div
        className={`fixed inset-0 z-[5000] flex items-center justify-center transition-all duration-1000 ease-in-out ${
          showOffer ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Subtle dark backdrop with blur */}
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm cursor-pointer transition-opacity duration-1000" 
          onClick={handleCloseOffer} 
        />

        {/* Elegant Modal Box */}
        <div 
          className="relative bg-[#faf8f5] w-[90%] max-w-[480px] p-10 md:p-14 text-center shadow-2xl transform transition-transform duration-1000 ease-out border border-[#e0d5c1]/50"
          style={{ transform: showOffer ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <button 
            onClick={handleCloseOffer} 
            className="absolute top-5 right-5 text-[#1a1a1a] hover:text-[#5A1218] transition-colors bg-transparent border-none cursor-pointer"
            aria-label="Close offer"
          >
            <X size={24} strokeWidth={1} />
          </button>

          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] tracking-[4px] uppercase text-[#5A1218] mb-4">
            An Invitation
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl md:text-5xl text-[#1a1a1a] font-light tracking-[2px] mb-4">
            A Gift For You
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs text-[#666] leading-relaxed mb-8 px-4">
            Enjoy 10% off your first curation from the Niali Atelier. Use the code below at checkout.
          </p>
          
          <div className="border border-[#ccc] py-4 mb-8 bg-white/50 select-all cursor-text">
            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm md:text-base font-medium tracking-[5px] uppercase text-[#1a1a1a]">
              ATELIER10
            </p>
          </div>

          <button 
            onClick={() => { handleCloseOffer(); navigate('/shop'); }}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className="w-full bg-[#5A1218] text-[#faf8f5] border-none cursor-pointer px-8 py-4 text-[10px] tracking-[3px] uppercase hover:bg-[#3a0a0f] transition-colors"
          >
            Begin Exploring
          </button>
        </div>
      </div>

      {/* ─── HERO ─── */}
      <section className="relative h-screen overflow-hidden bg-[#0a0a0a]">
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[2500ms] ease-out"
          style={{
            opacity: heroLoaded ? 0.55 : 0,
            transform: heroLoaded ? 'scale(1)' : 'scale(1.05)',
          }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.85) 100%)' }}
        />

        <div className="relative h-full flex flex-col items-center justify-center text-center text-[#faf8f5] px-5">
          <Reveal delay={0.6} direction="down">
            <div className="flex flex-col items-center">
              <h1
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-[clamp(34px,6vw,72px)] font-light tracking-[0.1em] leading-[0.9] text-[#faf8f5]"
              >
                Crafted with
              </h1>
              <span
                style={{ fontFamily: "'Allura', cursive" }}
                className="text-[clamp(60px,12vw,130px)] text-[#e0d5c1] mt-3 -mb-1 leading-[0.7] font-light block"
              >
                Thread
              </span>
            </div>
          </Reveal>

          <Reveal delay={1.1} direction="up">
            <div className="w-10 h-[1.5px] bg-[#5A1218] mx-auto mt-3 mb-6" />
          </Reveal>

          <Reveal delay={1.5} direction="up">
            <p
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className="text-[12px] md:text-[13px] tracking-[2px] md:tracking-[3px] font-light max-w-[550px] leading-[1.9] mb-10 md:mb-12 text-[#faf8f5]/90"
            >
              Emotional storytelling through fabric and embroidery.
            </p>
          </Reveal>

          <Reveal delay={1.9} direction="up">
            <button
              onClick={() => navigate('/shop')}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className="
                bg-[#5A1218] text-[#faf8f5] px-10 md:px-12 py-4
                text-[10px] md:text-[11px] tracking-[0.3em] uppercase
                border border-transparent rounded-sm
                hover:bg-[#3a0a0f] hover:scale-[1.02] hover:shadow-2xl
                active:scale-[0.98]
                transition-all duration-500 ease-out cursor-pointer
              "
            >
              Explore Niali
            </button>
          </Reveal>
        </div>
      </section>

      {/* ─── COLLECTIONS (reduced gap) ─── */}
      <section className="px-5 md:px-10 lg:px-10 pt-16 md:pt-20 pb-10 md:pb-14 max-w-[1400px] mx-auto">
        <Reveal>
          <p
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className="text-center text-[10px] tracking-[5px] uppercase text-[#5A1218] mb-3"
          >
            Curated For You
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-center text-3xl md:text-4xl lg:text-5xl font-light tracking-[3px] mb-8 md:mb-10 text-[#1a1a1a]"
          >
            The Collections
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {collections.map((c, i) => (
            <Reveal key={c._id} delay={0.2 + i * 0.15}>
              <div
                className="collection-card relative group overflow-hidden cursor-pointer rounded-sm"
                style={{ height: 'clamp(380px, 45vw, 500px)' }}
                onClick={() => navigate(`/shop?collection=${encodeURIComponent(c.title)}`)}
              >
                {c.image.includes('video') || c.image.endsWith('.mp4') || c.image.includes('data:video') ? (
                  <video
                    src={c.image} autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={c.image} alt={c.title} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                )}

                <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent">
                  <div className="relative z-10">
                    <p
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      className="text-[9px] tracking-[4px] uppercase text-[#e0d5c1] mb-2"
                    >
                      {c.subtitle}
                    </p>
                    <h3
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      className="text-2xl md:text-3xl text-[#faf8f5] tracking-[2px]"
                    >
                      {c.title}
                    </h3>
                    <p
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      className="text-[9px] tracking-[3px] uppercase text-[#faf8f5]/0 group-hover:text-[#faf8f5]/70 mt-3 transition-all duration-500 translate-y-2 group-hover:translate-y-0"
                    >
                      View Collection →
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── FEATURED CAROUSEL (auto-rotating) ─── */}
      <section className="pt-10 md:pt-14 pb-14 md:pb-20 bg-[#faf8f5]">
        <Reveal>
          <p
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className="text-center text-[10px] tracking-[5px] uppercase text-[#5A1218] mb-3"
          >
            From the Atelier
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-center text-3xl md:text-4xl lg:text-5xl font-light tracking-[3px] mb-10 md:mb-12 text-[#1a1a1a]"
          >
            Featured Pieces
          </h2>
        </Reveal>

        <Reveal delay={0.25}>
          <FeaturedCarousel products={featuredProducts} navigate={navigate} />
        </Reveal>
      </section>

      {/* ─── EDITORIAL BANNER (shorter height) ─── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: 'clamp(350px, 45vw, 450px)' }}
      >
        <img
          src={atelierBg}
          alt="Niali Atelier"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/60 to-[#5A1218]/40" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center text-[#faf8f5] px-6 md:px-10">
          <Reveal>
            <p
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className="text-[10px] tracking-[5px] uppercase text-[#e0d5c1] mb-4"
            >
              The Atelier
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-2xl md:text-3xl lg:text-4xl font-light tracking-[2px] md:tracking-[3px] italic max-w-[700px] leading-[1.4] mb-3 drop-shadow-md"
            >
              "Every piece represents time, details and artistic expression."
            </h2>
          </Reveal>

          <Reveal delay={0.3}>
            <p
              style={{ fontFamily: "'Allura', cursive" }}
              className="text-2xl md:text-3xl text-[#faf8f5] opacity-90 mb-6 drop-shadow-md"
            >
              Nisha Bhardwaj
            </p>
          </Reveal>

          <Reveal delay={0.5}>
            <button
              onClick={() => navigate('/our-story')}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className="
                bg-transparent text-[#faf8f5] border border-[#faf8f5]
                px-7 md:px-9 py-3 text-[10px] tracking-[3px] uppercase
                rounded-sm cursor-pointer
                hover:bg-[#faf8f5] hover:text-[#5A1218] hover:scale-[1.02]
                active:scale-[0.98]
                transition-all duration-500 ease-out
              "
            >
              Discover Our Story
            </button>
          </Reveal>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="px-6 py-16 md:py-24 max-w-[560px] mx-auto text-center">
        <Reveal>
          <p
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className="text-[10px] tracking-[5px] uppercase text-[#5A1218] mb-3"
          >
            Stay Connected
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-3xl lg:text-4xl font-light tracking-[2px] mb-8 md:mb-10 text-[#1a1a1a]"
          >
            Join Our World
          </h2>
        </Reveal>
        <Reveal delay={0.3}>
          <form onSubmit={handleSubscribe} className="relative">
            <div className="flex border-b border-[#ccc] focus-within:border-[#5A1218] transition-colors duration-300 pb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (subscribeStatus !== 'idle') setSubscribeStatus('idle');
                }}
                className="bg-transparent focus:outline-none text-[#1a1a1a] placeholder:text-[#999] px-1 w-full"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
                placeholder="Enter your email"
                required
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className="
                  text-[#5A1218] hover:text-[#1a1a1a] transition-colors
                  uppercase font-medium text-[11px] tracking-[2px] px-3
                  cursor-pointer bg-transparent border-none shrink-0
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {subscribeStatus === 'loading' ? '...' : 'Subscribe'}
              </button>
            </div>

            {subscribeStatus === 'success' && (
              <p
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className="text-[10px] tracking-[2px] text-[#5A1218] mt-4"
              >
                Welcome to the Niali world.
              </p>
            )}
            {subscribeStatus === 'error' && (
              <p
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className="text-[10px] tracking-[2px] text-red-500 mt-4"
              >
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </Reveal>
      </section>
    </div>
  );
};

export default Home;