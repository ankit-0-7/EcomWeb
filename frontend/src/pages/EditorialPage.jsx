import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Reveal } from '../components/UIElements';

// --- THE CONTENT DICTIONARY ---
// This holds the text and images for every single footer link.
const pageContent = {
  '/our-story': {
    title: 'Our Story',
    subtitle: 'A Legacy of Woven Dreams',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1400&q=80',
    content: [
      "Founded on the philosophy of enduring elegance, Maison was born from a desire to preserve the meticulous art of Indian craftsmanship.",
      "For decades, our founders traveled across the subcontinent, sitting with master weavers and jewelers, learning the secrets of techniques that have been passed down through generations. Today, Maison stands as a bridge between this rich heritage and modern, timeless design.",
      "Every thread, every bead, and every silhouette tells a story of cultural richness, designed not just to be worn, but to be inherited."
    ]
  },
  '/artisans': {
    title: 'Our Artisans',
    subtitle: 'The Hands Behind the Heritage',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1400&q=80',
    content: [
      "At the heart of Maison are our artisans—the true custodians of our heritage. We work directly with over 500 weaving families, embroiderers, and craftsmen across India.",
      "By eliminating intermediaries, we ensure that the creators of your garments are compensated fairly and treated with the deep respect their skills command. We are committed to funding community schools and healthcare initiatives in the villages where our ateliers are located.",
      "When you wear Maison, you wear the culmination of hundreds of hours of dedicated, joyful human craft."
    ]
  },
  '/sustainability': {
    title: 'Sustainability',
    subtitle: 'A Vow to the Earth',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400&q=80',
    content: [
      "True luxury does not come at the expense of our planet. Maison operates on a strict slow-fashion ethos.",
      "Our fabrics are hand-loomed using organic, locally sourced yarns, drastically reducing our carbon footprint compared to machine-milled textiles. We utilize natural, plant-based dyes derived from indigo, madder root, and marigold, ensuring no toxic runoff enters our waterways.",
      "We produce in highly limited, curated batches to ensure zero inventory waste. What we take from the earth, we strive to return in equal, beautiful measure."
    ]
  },
  '/shipping': {
    title: 'Shipping & Delivery',
    subtitle: 'From Our Atelier to Your Door',
    image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=1400&q=80',
    content: [
      "Maison offers complimentary expedited shipping on all global orders.",
      "Every garment is carefully steamed, folded in acid-free tissue, and enclosed in our signature heritage presentation box. Domestic orders within India arrive within 3-5 business days. International deliveries are handled via our luxury courier partners and typically arrive within 7-10 business days.",
      "Once your piece leaves our atelier, you will receive a bespoke tracking link via email."
    ]
  },
  '/returns': {
    title: 'Returns & Exchanges',
    subtitle: 'Our Commitment to Your Satisfaction',
    image: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=1400&q=80',
    content: [
      "We want your Maison piece to be a cherished part of your wardrobe. If a garment does not meet your expectations, we offer a seamless 14-day return window from the date of delivery.",
      "Garments must be unworn, with all Maison heritage tags and seals intact. Custom-tailored and bespoke bridal pieces are crafted specifically for your measurements and are therefore non-refundable.",
      "To initiate a return, simply contact our concierge team, and we will arrange a complimentary courier pickup from your home."
    ]
  },
  '/contact': {
    title: 'Contact The Atelier',
    subtitle: 'We Are Here to Assist You',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1400&q=80',
    content: [
      "For styling advice, bespoke bridal inquiries, or assistance with an existing order, our dedicated Concierge Team is at your service.",
      "Email: concierge@maisonheritage.com",
      "Phone: +91 98765 43210 (Mon-Sat, 10am - 7pm IST)",
      "Flagship Boutique: The Heritage Quarter, Mumbai, India."
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
    <div className="bg-[#faf8f5] min-h-screen pt-[80px]">
      
      {/* Editorial Hero Banner */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[#1a1a1a]/40 z-10"></div>
        <img 
            src={pageData.image} 
            alt={pageData.title} 
            className="absolute inset-0 w-full h-full object-cover object-center" 
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <Reveal>
            <p className="font-sans text-[10px] tracking-[5px] text-[#d4c5a9] uppercase mb-4 shadow-black drop-shadow-lg">
              {pageData.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-serif text-4xl md:text-6xl font-light tracking-[3px] text-[#faf8f5] drop-shadow-md">
              {pageData.title}
            </h1>
          </Reveal>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[800px] mx-auto px-6 py-20 md:py-32">
        <Reveal delay={0.2}>
          <div className="gold-line mb-16 mx-auto"></div>
        </Reveal>
        
        <div className="space-y-10">
          {pageData.content.map((paragraph, index) => (
            <Reveal key={index} delay={0.3 + (index * 0.1)}>
              <p className="font-serif text-xl md:text-2xl font-light text-[#1a1a1a] leading-relaxed text-center tracking-wide">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.6}>
            <div className="mt-24 text-center">
                <button onClick={() => navigate('/shop')} className="luxury-btn luxury-btn-filled">
                    <span>Return to Boutique</span>
                </button>
            </div>
        </Reveal>
      </div>
    </div>
  );
};

export default EditorialPage;