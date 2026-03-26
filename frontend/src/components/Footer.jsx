import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-[#faf8f5] pt-20 pb-10 border-t border-[#333]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* TOP SECTION: Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div>
            <h3 className="font-serif text-2xl font-light tracking-[4px] mb-6">Maison</h3>
            <p className="font-sans text-[11px] text-[#888] leading-relaxed max-w-[280px] tracking-wide">
              Celebrating the art of Indian craftsmanship through timeless design and heritage techniques.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-sans text-[10px] tracking-[3px] uppercase text-[#b4a078] mb-6">Shop</h4>
            <div className="flex flex-col space-y-3">
              {['New Arrivals', 'Bridal', 'Sarees', 'Jewellery', 'Menswear'].map(l => (
                <Link key={l} to="/shop" className="font-sans text-[11px] tracking-wider text-[#888] hover:text-[#faf8f5] transition-colors duration-300">
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* About Links (Wired to EditorialPage) */}
          <div>
            <h4 className="font-sans text-[10px] tracking-[3px] uppercase text-[#b4a078] mb-6">About</h4>
            <div className="flex flex-col space-y-3">
              {[
                { name: "Our Story", path: "/our-story" },
                { name: "Artisans", path: "/artisans" },
                { name: "Sustainability", path: "/sustainability" },
                { name: "Press", path: "/press" },
                { name: "Careers", path: "/careers" }
              ].map(link => (
                <Link key={link.name} to={link.path} className="font-sans text-[11px] tracking-wider text-[#888] hover:text-[#faf8f5] transition-colors duration-300">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Help Links (Wired to EditorialPage) */}
          <div>
            <h4 className="font-sans text-[10px] tracking-[3px] uppercase text-[#b4a078] mb-6">Help</h4>
            <div className="flex flex-col space-y-3">
              {[
                { name: "Contact Us", path: "/contact" },
                { name: "Shipping", path: "/shipping" },
                { name: "Returns", path: "/returns" },
                { name: "Size Guide", path: "/size-guide" },
                { name: "Care Guide", path: "/care-guide" }
              ].map(link => (
                <Link key={link.name} to={link.path} className="font-sans text-[11px] tracking-wider text-[#888] hover:text-[#faf8f5] transition-colors duration-300">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Copyright & Socials */}
        <div className="border-t border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-sans text-[9px] text-[#666] tracking-[2px] uppercase">
            © {new Date().getFullYear()} MAISON HERITAGE COUTURE
          </p>
          <div className="flex gap-6">
            {["Instagram", "Pinterest", "Facebook", "Twitter"].map(s => (
              <a key={s} href="#" className="font-sans text-[9px] text-[#666] tracking-[2px] uppercase hover:text-[#faf8f5] transition-colors duration-300">
                {s}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;