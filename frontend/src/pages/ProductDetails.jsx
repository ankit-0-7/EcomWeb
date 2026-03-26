import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Reveal } from '../components/UIElements';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); 

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to load garment details');
        }
        
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToBag = () => {
    // Pass the item to the cart vault, initializing the quantity to 1
    addToCart({ ...product, id: product._id, qty: 1 }); 
    
    // Smooth text transition for the luxury button
    const btn = document.getElementById('add-btn-text');
    const originalText = btn.innerText;
    btn.innerText = 'Added to Bag';
    
    setTimeout(() => { 
        btn.innerText = originalText; 
    }, 2000);
  };

  // Loading State
  if (loading) {
    return (
        <div className="min-h-screen bg-heritage-bg flex justify-center items-center">
            <div className="w-8 h-8 border-2 border-heritage-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  // Error State
  if (error) {
    return (
        <div className="min-h-screen bg-heritage-bg flex flex-col justify-center items-center text-red-500 font-sans tracking-widest uppercase text-sm">
            <p className="mb-4">{error}</p>
            <button onClick={() => navigate(-1)} className="border-b border-red-500 pb-1 text-xs">Return to Collection</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-heritage-bg pt-32 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        <Reveal>
            <button onClick={() => navigate(-1)} className="text-[10px] font-sans text-heritage-textLight opacity-60 tracking-widest uppercase hover:text-heritage-gold transition-colors mb-12">
                ← Return to Boutique
            </button>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Image with Reveal Animation */}
          <Reveal direction="right">
            <div className="relative overflow-hidden bg-heritage-surface aspect-[3/4]">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          </Reveal>

          {/* Right Column: Garment Details */}
          <Reveal delay={0.2} direction="left">
            <div className="flex flex-col justify-center h-full py-8">
              <p className="text-xs font-sans text-heritage-gold tracking-[0.3em] uppercase mb-4">
                  {product.category}
              </p>
              
              <h1 className="text-4xl lg:text-5xl font-serif text-heritage-textLight tracking-wide mb-6 leading-tight">
                  {product.name}
              </h1>
              
              <p className="text-2xl font-serif text-heritage-textLight opacity-80 mb-8">
                  INR {product.price?.toLocaleString('en-IN')}
              </p>

              <div className="gold-line ml-0 mb-8"></div>

              <p className="text-sm font-sans text-heritage-textLight opacity-70 leading-relaxed tracking-wide mb-10 max-w-lg">
                {product.description || "An exquisite piece from our atelier, handcrafted by master artisans using time-honoured techniques passed down through generations."}
              </p>

              <div className="mb-10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-heritage-surface border border-heritage-gold flex items-center justify-center text-heritage-gold font-serif text-lg">
                  {product.user?.name ? product.user.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <div>
                  <p className="text-[10px] font-sans text-heritage-textLight opacity-50 tracking-widest uppercase">Curated By</p>
                  <p className="text-sm font-serif text-heritage-textLight tracking-wider">{product.user?.name || 'Maison Artisan'}</p>
                </div>
              </div>

              {/* The new Luxury Button */}
              <button 
                onClick={handleAddToBag} 
                className="luxury-btn luxury-btn-filled w-full text-center"
              >
                <span id="add-btn-text">Add to Bag</span>
              </button>

            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;