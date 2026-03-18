import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the products from your Node.js backend when the page loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load collection');
        }

        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-heritage-bg pt-24 pb-12 px-4 sm:px-8 relative">
      
      {/* Opulent Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-heritage-primary opacity-5 blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Heritage Header */}
        <div className="mb-16 text-center">
          <h2 className="text-xs font-sans text-heritage-gold tracking-[0.4em] uppercase mb-4">
            Chapter I
          </h2>
          <h1 className="text-5xl md:text-6xl font-serif text-heritage-textLight tracking-wider">
            The Heritage Collection
          </h1>
          <div className="w-24 h-px bg-heritage-gold mx-auto mt-8 opacity-50"></div>
        </div>

        {/* Status Handling */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-2 border-heritage-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-400 font-sans tracking-widest text-sm uppercase">
            Error: {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20 text-heritage-textLight opacity-60 font-sans tracking-widest text-sm uppercase">
            The Atelier is currently preparing new garments. Please return later.
          </div>
        )}

        {/* The Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {products.map((product) => (
            <div key={product._id} className="group cursor-pointer">
              
              {/* Image Container (Editorial Aspect Ratio) */}
              <div className="relative aspect-[3/4] overflow-hidden mb-6 border border-heritage-border group-hover:border-heritage-gold/50 transition-colors duration-500">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100"
                />
                
                {/* Dark overlay that appears on hover with the correctly formatted Link */}
                <div className="absolute inset-0 bg-heritage-bg/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <Link 
                    to={`/product/${product._id}`}
                    className="bg-heritage-primary text-heritage-textLight font-sans text-xs uppercase tracking-widest py-3 px-8 hover:bg-heritage-gold transition-colors shadow-2xl"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Garment Details */}
              <div className="text-center">
                <p className="text-[10px] font-sans text-heritage-gold tracking-widest uppercase mb-2 opacity-80">
                  {product.category}
                </p>
                <h3 className="text-xl font-serif text-heritage-textLight tracking-wide mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm font-sans text-heritage-textLight opacity-70 tracking-wider">
                  INR {product.price?.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] font-sans text-heritage-textLight opacity-40 tracking-widest uppercase mt-3">
                  Curated by {product.user?.name || 'Artisan'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;