import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);

  // State for the Upload Form
  const [productData, setProductData] = useState({
    name: '', price: '', category: '', image: '', description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // State for the Seller's existing garments
  const [myProducts, setMyProducts] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(true);

  // Fetch the seller's specific products when the dashboard loads
  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await fetch('/api/products/seller', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setMyProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setFetchingProducts(false);
    }
  };

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  // Handle uploading a new garment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to curate item');

      setMessage({ type: 'success', text: 'Item successfully curated into the Atelier.' });
      setProductData({ name: '', price: '', category: '', image: '', description: '' }); 
      
      // Refresh the list below immediately after uploading
      fetchMyProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a garment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you wish to remove this garment from the Atelier?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (response.ok) {
        // Remove the item from the React state so it disappears instantly from the screen
        setMyProducts(myProducts.filter(product => product._id !== id));
      } else {
        alert("Failed to delete garment.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-bg py-20 px-6 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-heritage-primary opacity-5 blur-[150px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto z-10 relative">
        
        {/* Header Section */}
        <div className="mb-12 border-b border-heritage-border pb-6">
          <h2 className="text-xs font-sans text-heritage-gold tracking-[0.3em] uppercase mb-2">
            The Artisan's Ledger
          </h2>
          <h1 className="text-4xl font-serif text-heritage-textLight tracking-wider">
            Manage Your Boutique
          </h1>
        </div>

        {/* ========================================= */}
        {/* TOP HALF: THE UPLOAD FORM                 */}
        {/* ========================================= */}
        <div className="mb-20">
          <h2 className="text-2xl font-serif text-heritage-gold mb-8">Curate New Garment</h2>
          
          {message && (
            <div className={`mb-8 p-4 border text-xs tracking-widest uppercase font-sans text-center ${message.type === 'success' ? 'border-heritage-gold/50 bg-heritage-gold/10 text-heritage-gold' : 'border-red-500/50 bg-red-500/10 text-red-400'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-heritage-surface p-10 shadow-2xl border border-heritage-border relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-sans text-heritage-textLight uppercase tracking-widest mb-3 opacity-80">Garment Title</label>
                  <input type="text" name="name" value={productData.name} onChange={handleChange} className="w-full bg-transparent border-b border-heritage-border py-2 text-heritage-textLight focus:outline-none focus:border-heritage-gold transition-colors font-serif text-lg" required />
                </div>
                <div>
                  <label className="block text-xs font-sans text-heritage-textLight uppercase tracking-widest mb-3 opacity-80">Price (INR)</label>
                  <input type="number" name="price" value={productData.price} onChange={handleChange} className="w-full bg-transparent border-b border-heritage-border py-2 text-heritage-textLight focus:outline-none focus:border-heritage-gold transition-colors font-serif text-lg" required min="0" />
                </div>
                <div>
                  <label className="block text-xs font-sans text-heritage-textLight uppercase tracking-widest mb-3 opacity-80">Category</label>
                  <select name="category" value={productData.category} onChange={handleChange} className="w-full bg-transparent border-b border-heritage-border py-3 text-heritage-textLight focus:outline-none focus:border-heritage-gold transition-colors font-serif text-lg appearance-none cursor-pointer" required>
                    <option value="" className="bg-heritage-surface text-heritage-textLight">Select Category</option>
                    <option value="Bridal Lehenga" className="bg-heritage-surface">Bridal Lehenga</option>
                    <option value="Sarees" className="bg-heritage-surface">Sarees</option>
                    <option value="Menswear" className="bg-heritage-surface">Menswear</option>
                    <option value="Jewelry" className="bg-heritage-surface">Jewelry</option>
                  </select>
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-sans text-heritage-textLight uppercase tracking-widest mb-3 opacity-80">Image URL</label>
                  <input type="url" name="image" value={productData.image} onChange={handleChange} className="w-full bg-transparent border-b border-heritage-border py-2 text-heritage-textLight focus:outline-none focus:border-heritage-gold transition-colors font-serif text-lg" required />
                </div>
                <div className="h-full">
                  <label className="block text-xs font-sans text-heritage-textLight uppercase tracking-widest mb-3 opacity-80">Heritage Description</label>
                  <textarea name="description" value={productData.description} onChange={handleChange} className="w-full bg-transparent border-b border-heritage-border py-2 text-heritage-textLight focus:outline-none focus:border-heritage-gold transition-colors font-serif text-lg resize-none h-32" required></textarea>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-heritage-border mt-8">
              <button type="submit" disabled={loading} className="w-full md:w-auto px-12 bg-heritage-primary hover:bg-heritage-primaryHover text-heritage-textLight font-sans text-sm uppercase tracking-widest py-4 transition-all duration-300 border border-transparent hover:border-heritage-gold shadow-[0_0_15px_rgba(123,24,24,0.3)] disabled:opacity-50">
                {loading ? 'Curating...' : 'Curate Collection'}
              </button>
            </div>
          </form>
        </div>

        {/* ========================================= */}
        {/* BOTTOM HALF: THE SELLER'S ARCHIVE LIST    */}
        {/* ========================================= */}
        <div>
          <h2 className="text-2xl font-serif text-heritage-gold mb-8">Your Curated Archives</h2>
          
          {fetchingProducts ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-heritage-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : myProducts.length === 0 ? (
            <p className="text-sm font-sans text-heritage-textLight opacity-50 tracking-widest uppercase py-8 border border-heritage-border border-dashed text-center">
              You have not curated any garments yet.
            </p>
          ) : (
            <div className="space-y-6">
              {myProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between bg-heritage-surface/30 border border-heritage-border p-4 hover:border-heritage-gold/50 transition-colors">
                  
                  <div className="flex items-center gap-6">
                    <img src={product.image} alt={product.name} className="w-16 h-20 object-cover" />
                    <div>
                      <p className="text-[10px] font-sans text-heritage-gold tracking-widest uppercase mb-1">{product.category}</p>
                      <h3 className="text-lg font-serif text-heritage-textLight tracking-wide">{product.name}</h3>
                      <p className="text-xs font-sans text-heritage-textLight opacity-70 tracking-wider mt-1">INR {product.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="p-3 text-heritage-textLight opacity-50 hover:opacity-100 hover:text-red-400 transition-colors border border-transparent hover:border-red-400/30"
                    title="Remove Garment"
                  >
                    <Trash2 size={20} />
                  </button>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;