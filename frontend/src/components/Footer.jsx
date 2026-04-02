import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-[#faf8f5] pt-20 pb-10 border-t border-[#333]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* TOP SECTION: Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          
          {/* NIALI BRAND INFO */}
          <div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-normal tracking-[0.2em] mb-4 uppercase">
              NIALI
            </h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[0.2em] text-[#e0d5c1] mb-6 uppercase font-medium">
              Crafted with Thread
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] text-[#888] leading-relaxed max-w-[280px] tracking-wide font-light">
              Niali is built on the principles of craftsmanship, intentional design and quiet luxury. Every piece represents time, details and artistic expression.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[3px] uppercase text-[#e0d5c1] mb-6 font-medium">Shop</h4>
            <div className="flex flex-col space-y-3">
              {['New Arrivals', 'Bridal', 'Sarees', 'Jewellery', 'Menswear'].map(l => (
                <Link key={l} to="/shop" style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] tracking-wider text-[#888] hover:text-[#faf8f5] transition-colors duration-300 uppercase">
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* About Links */}
          <div>
            <h4 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[3px] uppercase text-[#e0d5c1] mb-6 font-medium">About</h4>
            <div className="flex flex-col space-y-3">
              {[
                { name: "Our Story", path: "/our-story" },
                { name: "Artisans", path: "/artisans" },
                { name: "Sustainability", path: "/sustainability" },
                { name: "Press", path: "/press" },
                { name: "Careers", path: "/careers" }
              ].map(link => (
                <Link key={link.name} to={link.path} style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] tracking-wider text-[#888] hover:text-[#faf8f5] transition-colors duration-300 uppercase">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* NIALI CONTACT INFO (From Stationary) */}
          <div>
            <h4 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[3px] uppercase text-[#e0d5c1] mb-6 font-medium">Contact</h4>
            <div className="flex flex-col space-y-3">
               <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] tracking-wider text-[#888] uppercase">
                 +123-456-7890
               </p>
               <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] tracking-wider text-[#888] uppercase">
                 hello@niali.com
               </p>
               <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] tracking-wider text-[#888] uppercase leading-relaxed">
                 123 Anywhere St.<br />Any City, ST 12345
               </p>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Copyright & Website */}
        <div className="border-t border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] text-[#666] tracking-[2px] uppercase">
            © {new Date().getFullYear()} NIALI. CRAFTED WITH THREAD.
          </p>
          <div className="flex gap-6">
            <a href="https://www.niali.com" style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] text-[#666] tracking-[2px] uppercase hover:text-[#faf8f5] transition-colors duration-300">
              www.Niali.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;