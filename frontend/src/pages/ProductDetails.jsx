import React, { useState, useEffect, useContext } from 'react'; // 1. Added useContext here
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // 2. Imported the CartContext

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 3. Moved the hook INSIDE the component
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
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToBag = () => {
    addToCart(product); // Send the whole garment object to the cart vault
    
    // Optional: A small visual feedback change instead of an annoying alert
    const btn = document.getElementById('add-btn');
    const originalText = btn.innerText;
    btn.innerText = 'Added to Atelier Bag';
    btn.classList.add('border-heritage-gold', 'bg-heritage-surface');
    
    setTimeout(() => {
      btn.innerText = originalText;
      btn.classList.remove('border-heritage-gold', 'bg-heritage-surface');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-heritage-bg flex justify-center items-center">
        <div className="w-10 h-10 border-2 border-heritage-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-heritage-bg flex flex-col justify-center items-center text-heritage-textLight">
        <h2 className="text-2xl font-serif text-heritage-gold mb-4">An Error Occurred</h2>
        <p className="font-sans text-sm tracking-widest uppercase opacity-70 mb-8">{error}</p>
        <Link to="/shop" className="border-b border-heritage-gold text-heritage-gold pb-1 text-xs uppercase tracking-widest">Return to Collection</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-heritage-bg pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="text-[10px] font-sans text-heritage-textLight opacity-60 tracking-widest uppercase hover:text-heritage-gold transition-colors">
            ← Return to previous
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Image */}
          <div className="relative border border-heritage-border p-4 bg-heritage-surface/30">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto object-cover aspect-[3/4]"
            />
          </div>

          {/* Right Column: Garment Details */}
          <div className="flex flex-col justify-center py-8">
            <p className="text-xs font-sans text-heritage-gold tracking-[0.3em] uppercase mb-4">
              {product.category}
            </p>
            
            <h1 className="text-4xl lg:text-5xl font-serif text-heritage-textLight tracking-wide mb-6 leading-tight">
              {product.name}
            </h1>
            
            <p className="text-2xl font-sans text-heritage-textLight opacity-90 tracking-wider mb-8">
              INR {product.price?.toLocaleString('en-IN')}
            </p>

            <div className="w-16 h-px bg-heritage-gold opacity-50 mb-8"></div>

            <div className="prose prose-invert mb-10">
              <p className="text-sm font-sans text-heritage-textLight opacity-70 leading-relaxed tracking-wide">
                {product.description}
              </p>
            </div>

            <div className="mb-10 flex items-center gap-4 border border-heritage-border p-4">
              <div className="w-10 h-10 rounded-full bg-heritage-surface border border-heritage-gold flex items-center justify-center text-heritage-gold font-serif text-lg">
                {product.user?.name ? product.user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <p className="text-[10px] font-sans text-heritage-textLight opacity-50 tracking-widest uppercase">Curated By</p>
                <p className="text-sm font-serif text-heritage-textLight tracking-wider">{product.user?.name || 'Artisan'}</p>
              </div>
            </div>

            <button
              id="add-btn"
              onClick={handleAddToBag}
              className="w-full bg-heritage-primary hover:bg-heritage-primaryHover text-heritage-textLight font-sans text-sm uppercase tracking-widest py-5 transition-all duration-300 border border-transparent hover:border-heritage-gold shadow-[0_0_15px_rgba(123,24,24,0.3)]"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;