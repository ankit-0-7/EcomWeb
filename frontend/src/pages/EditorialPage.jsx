import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Reveal } from '../components/UIElements';

// --- THE NIALI CONTENT DICTIONARY ---
const pageContent = {
  '/our-story': {
    title: 'Our Story',
    subtitle: 'Quiet Luxury by Nisha Bhardwaj',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1400&q=80',
    content: [
      "Founded by Nisha Bhardwaj, Niali is built on the profound principles of craftsmanship, intentional design, and quiet luxury.",
      "The foundation of our brand is not just clothing, but emotional storytelling through fabric and embroidery. We aim to redefine modern Indian luxury by blending traditional craftsmanship with contemporary design.",
      "Niali speaks softly, but leaves a strong impression. Every piece represents time, details, and artistic expression, designed for those who seek uniqueness over mass trends."
    ]
  },
  '/artisans': {
    title: 'Craftsmanship',
    subtitle: 'Crafted with Thread',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1400&q=80',
    content: [
      "At Niali, we believe in details over mass production. Every piece is made with meticulous attention to detail and skill.",
      "We are committed to celebrating craftsmanship, prioritizing quality over quantity, and designing with absolute intention.",
      "Our pieces are handcrafted to tell a story through every thread, honoring the artisans who bring our minimalist, refined visions to life."
    ]
  },
  '/sustainability': {
    title: 'Slow Fashion',
    subtitle: 'Timeless over Trendy',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400&q=80',
    content: [
      "Niali operates strictly on a slow fashion philosophy. We value quality, longevity, and mindful production over fleeting seasonal trends.",
      "We believe luxury succeeds when it creates perceived value beyond the product—focusing on identity, exclusivity, and emotional connection.",
      "Every stitch, fabric, and silhouette has a purpose. We design meaning over noise, creating garments that are inherited, not discarded."
    ]
  },
  '/shipping': {
    title: 'Shipping & Delivery',
    subtitle: 'From Our Atelier to Your Door',
    image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=1400&q=80',
    content: [
      "Niali offers complimentary expedited shipping on all global orders.",
      "Every garment is carefully steamed, folded in acid-free tissue, and enclosed in our signature presentation box. Domestic orders within India arrive within 3-5 business days. International deliveries are handled via our luxury courier partners and typically arrive within 7-10 business days.",
      "Once your piece leaves our atelier, you will receive a bespoke tracking link via email."
    ]
  },
  '/returns': {
    title: 'Returns & Exchanges',
    subtitle: 'Our Commitment to Your Satisfaction',
    image: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=1400&q=80',
    content: [
      "We want your Niali piece to be a cherished part of your wardrobe. If a garment does not meet your expectations, we offer a seamless 14-day return window from the date of delivery.",
      "Garments must be unworn, with all Niali tags and seals intact. Custom-tailored and bespoke bridal pieces are crafted specifically for your measurements and are therefore non-refundable.",
      "To initiate a return, simply contact our concierge team, and we will arrange a complimentary courier pickup from your home."
    ]
  },
  '/contact': {
    title: 'Contact The Atelier',
    subtitle: 'We Are Here to Assist You',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1400&q=80',
    content: [
      "For styling advice, bespoke inquiries, or assistance with an existing order, our dedicated Concierge Team is at your service.",
      "Email: hello@niali.com",
      "Phone: +123-456-7890",
      "Address: 123 Anywhere St. Any City, ST 12345"
    ]
  }
};

const EditorialPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Find the content based on the URL, or show a generic "Coming Soon" page if not found
  const pageData = pageContent[location.pathname] || {
    title: 'Coming Soon',
    subtitle: 'The Atelier is curating this space',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400&q=80',
    content: ["Please check back shortly as we finalize our digital boutique."]
  };

  // Ensure the page always loads at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="bg-[#faf8f5] min-h-screen pt-[80px] selection:bg-[#5A1218] selection:text-[#faf8f5]">
      
      {/* Editorial Hero Banner */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[#1a1a1a]/50 z-10"></div>
        <img 
            src={pageData.image} 
            alt={pageData.title} 
            className="absolute inset-0 w-full h-full object-cover object-center" 
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <Reveal>
            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[5px] text-[#e0d5c1] uppercase mb-4 shadow-black drop-shadow-lg">
              {pageData.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl md:text-6xl font-normal tracking-[3px] text-[#faf8f5] drop-shadow-md">
              {pageData.title}
            </h1>
          </Reveal>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[800px] mx-auto px-6 py-20 md:py-32">
        <Reveal delay={0.2}>
          <div className="w-12 h-[1px] bg-[#5A1218] mx-auto mb-16"></div>
        </Reveal>
        
        <div className="space-y-10">
          {pageData.content.map((paragraph, index) => (
            <Reveal key={index} delay={0.3 + (index * 0.1)}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl md:text-2xl font-normal text-[#1a1a1a] leading-relaxed text-center tracking-wide">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.6}>
            <div className="mt-24 text-center">
                <button 
                    onClick={() => navigate('/shop')} 
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="bg-[#5A1218] text-[#faf8f5] px-10 py-4 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#3a0a0f] transition-colors shadow-lg"
                >
                    <span>Return to Boutique</span>
                </button>
            </div>
        </Reveal>
      </div>
    </div>
  );
};

export default EditorialPage;