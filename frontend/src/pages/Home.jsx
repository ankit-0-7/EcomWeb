import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reveal, Marquee } from '../components/UIElements';

// Fallback collections in case the database is empty or still loading
const DEFAULT_COLLECTIONS = [
  { _id: '1', title: "The Bridal Edit", subtitle: "Timeless traditions, reimagined", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80" },
  { _id: '2', title: "Heritage Weaves", subtitle: "Handcrafted by master artisans", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80" },
  { _id: '3', title: "The Royal Archive", subtitle: "Where history meets haute couture", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80" },
];

const Home = () => {
  const navigate = useNavigate();
  const [heroLoaded, setHeroLoaded] = useState(false);
  
  // 🌟 State to hold the dynamic collections from the database
  const [collections, setCollections] = useState([]);

  useEffect(() => { 
    // Triggers the slow fade-in and zoom-out effect for the luxury feel
    setTimeout(() => setHeroLoaded(true), 300); 

    // Fetch collections from the database
    const fetchCollections = async () => {
        try {
            const res = await fetch('/api/collections');
            const data = await res.json();
            if (res.ok && data.length > 0) {
                setCollections(data);
            } else {
                setCollections(DEFAULT_COLLECTIONS);
            }
        } catch (err) {
            setCollections(DEFAULT_COLLECTIONS);
        }
    };
    fetchCollections();
  }, []);

  return (
    <div className="bg-heritage-bgLight">
      
      {/* --- HERO SECTION WITH VIDEO BACKGROUND --- */}
      <section style={{ height: "100vh", position: "relative", overflow: "hidden", background: "#111" }}>
        <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            style={{ 
                position: "absolute", 
                inset: 0, 
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                opacity: heroLoaded ? 0.75 : 0, 
                transform: heroLoaded ? "scale(1)" : "scale(1.1)", 
                transition: "opacity 2s ease, transform 8s ease" 
            }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))" }} />
        
        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#faf8f5", textAlign: "center", padding: "0 20px" }}>
          <p style={{ fontSize: 10, letterSpacing: 6, textTransform: "uppercase", color: "#d4c5a9", marginBottom: 24, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "none" : "translateY(20px)", transition: "all 1.2s ease 0.5s" }}>
              Autumn / Winter 2026
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px, 7vw, 80px)", fontWeight: 300, letterSpacing: "0.1em", lineHeight: 1.1, maxWidth: 700, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "none" : "translateY(40px)", transition: "all 1.5s cubic-bezier(.16,1,.3,1) 0.8s" }}>
              The Art of<br /><em style={{ fontWeight: 300, fontStyle: "italic" }}>Heritage</em>
          </h2>
          <div style={{ width: 60, height: 1, background: "#b4a078", margin: "32px auto", opacity: heroLoaded ? 1 : 0, transition: "opacity 1s ease 1.5s" }} />
          <p style={{ fontSize: 13, letterSpacing: 3, fontWeight: 200, maxWidth: 450, lineHeight: 1.8, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "none" : "translateY(20px)", transition: "all 1.2s ease 1.2s" }}>
              Where tradition meets timeless elegance
          </p>
          <button className="luxury-btn luxury-btn-gold" style={{ marginTop: 40, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "none" : "translateY(20px)", transition: "all 1.2s ease 1.6s" }} onClick={() => navigate('/shop')}>
              <span>Explore Collection</span>
          </button>
        </div>
      </section>

      {/* --- MARQUEE --- */}
      <Marquee text="Free Worldwide Shipping  ·  Handcrafted With Love  ·  Since 1901  ·  Authenticity Guaranteed  ·  Heritage Couture" />

      {/* --- DYNAMIC COLLECTIONS SECTION --- */}
      <section style={{ padding: "120px 40px", maxWidth: 1400, margin: "0 auto" }}>
        <Reveal>
            <p style={{ textAlign: "center", fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: "#b4a078", marginBottom: 12 }}>Curated For You</p>
        </Reveal>
        <Reveal delay={0.1}>
            <h2 style={{ textAlign: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 300, letterSpacing: 3, marginBottom: 8 }}>The Collections</h2>
        </Reveal>
        <Reveal delay={0.2}>
            <div className="gold-line" style={{ marginBottom: 60 }} />
        </Reveal>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {collections.map((c, i) => (
            <Reveal key={c._id} delay={0.2 + i * 0.15}>
              <div 
                className="collection-card relative group overflow-hidden cursor-pointer" 
                style={{ height: 500 }} 
                onClick={() => navigate(`/shop?collection=${encodeURIComponent(c.title)}`)}
              >
                
                {/* 🌟 Support for both Images and Local Videos uploaded by the Seller! */}
                {c.image.includes('video') || c.image.endsWith('.mp4') || c.image.includes('data:video') ? (
                   <video src={c.image} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : (
                   <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                )}

                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 36, top: "auto", height: "50%" }}>
                  <div className="mt-auto relative z-10">
                    <p style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "#d4c5a9", marginBottom: 8 }}>{c.subtitle}</p>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400, color: "#faf8f5", letterSpacing: 2 }}>{c.title}</h3>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --- EDITORIAL BANNER --- */}
      <section style={{ position: "relative", height: 500, overflow: "hidden", margin: "40px 0" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1400&q=80)", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#faf8f5", padding: "0 20px" }}>
          <Reveal>
              <p style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: "#d4c5a9", marginBottom: 16 }}>The Atelier</p>
          </Reveal>
          <Reveal delay={0.15}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 300, letterSpacing: 4, fontStyle: "italic", maxWidth: 600, lineHeight: 1.3 }}>"Every thread tells a story of heritage and artistry"</h2>
          </Reveal>
          <Reveal delay={0.3}>
              <button className="luxury-btn luxury-btn-gold" style={{ marginTop: 36 }} onClick={() => navigate('/our-story')}>
                  <span>Discover Our Story</span>
              </button>
          </Reveal>
        </div>
      </section>

      {/* --- STAY CONNECTED --- */}
      <section style={{ padding: "100px 40px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
            <p style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: "#b4a078", marginBottom: 12 }}>Stay Connected</p>
        </Reveal>
        <Reveal delay={0.1}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 300, letterSpacing: 3, marginBottom: 8 }}>Join Our World</h2>
        </Reveal>
        <Reveal delay={0.2}>
            <div className="gold-line" style={{ marginBottom: 32 }} />
        </Reveal>
        <Reveal delay={0.3}>
          <div style={{ display: "flex", gap: 0 }}>
            <input className="input-field" placeholder="Enter your email" style={{ flex: 1 }} />
            <button className="luxury-btn luxury-btn-filled" style={{ padding: "14px 32px", whiteSpace: "nowrap" }}>
                <span>Subscribe</span>
            </button>
          </div>
        </Reveal>
      </section>
      
    </div>
  );
};

export default Home;