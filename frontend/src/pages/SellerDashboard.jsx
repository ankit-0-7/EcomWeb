import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Reveal } from '../components/UIElements';
import { Trash2, Edit2, Plus, Archive, UploadCloud, X, Layout, Package } from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('garments');
  const [myOrders, setMyOrders] = useState([]);

  // --- GARMENT STATES ---
  const [productData, setProductData] = useState({ name: '', price: '', category: '', image: '', description: '', belongsToCollection: '' });
  const [myProducts, setMyProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // --- COLLECTION STATES ---
  const [collectionData, setCollectionData] = useState({ title: '', subtitle: '', image: '' });
  const [myCollections, setMyCollections] = useState([]);

  // --- SHARED STATES ---
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMyProducts();
    fetchCollections();
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/seller', { headers: { Authorization: `Bearer ${user?.token}` } });
      if (res.ok) setMyOrders(await res.json());
    } catch (error) { console.error(error); }
  };

  const fetchMyProducts = async () => {
    try {
      const response = await fetch('/api/products/seller', { headers: { Authorization: `Bearer ${user?.token}` } });
      if (response.ok) setMyProducts(await response.json());
    } catch (error) { console.error(error); } 
    finally { setFetchingData(false); }
  };

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      if (response.ok) setMyCollections(await response.json());
    } catch (error) { console.error(error); }
  };

  const handleImageUpload = (e, isCollection = false) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("Please upload an image smaller than 5MB.");
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isCollection) {
            setCollectionData({ ...collectionData, image: reader.result });
        } else {
            setProductData({ ...productData, image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- GARMENT HANDLERS ---
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productData.image) return alert("Please upload an image.");
    setLoading(true); setMessage(null);

    const url = isEditing ? `/api/products/${editId}` : '/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error('Failed to process request');
      setMessage({ type: 'success', text: isEditing ? 'Garment updated.' : 'Garment curated.' });
      
      resetForm(); 
      fetchMyProducts();
      setTimeout(() => setMessage(null), 4000);
    } catch (err) { setMessage({ type: 'error', text: err.message }); } 
    finally { setLoading(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Permanently remove this garment?")) return;
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${user?.token}` } });
      if (response.ok) {
        setMyProducts(myProducts.filter(p => p._id !== id));
        if (isEditing && editId === id) resetForm();
      }
    } catch (error) { console.error(error); }
  };

  const handleEditClick = (product) => {
    setIsEditing(true); setEditId(product._id);
    setProductData({ 
        name: product.name, 
        price: product.price, 
        category: product.category, 
        image: product.image, 
        description: product.description,
        belongsToCollection: product.belongsToCollection || '' 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false); setEditId(null);
    setProductData({ name: '', price: '', category: '', image: '', description: '', belongsToCollection: '' });
  };

  // --- COLLECTION HANDLERS ---
  const handleCollectionSubmit = async (e) => {
    e.preventDefault();
    if (!collectionData.image) return alert("Please upload a cover image.");
    setLoading(true); setMessage(null);
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify(collectionData)
      });
      if (!response.ok) throw new Error('Failed to curate collection');
      setMessage({ type: 'success', text: 'Collection published to Home page.' });
      setCollectionData({ title: '', subtitle: '', image: '' });
      fetchCollections();
      setTimeout(() => setMessage(null), 4000);
    } catch (err) { setMessage({ type: 'error', text: err.message }); } 
    finally { setLoading(false); }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm("Remove this collection from the Home page?")) return;
    try {
      const response = await fetch(`/api/collections/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${user?.token}` } });
      if (response.ok) setMyCollections(myCollections.filter(c => c._id !== id));
    } catch (error) { console.error(error); }
  };

  // 🌟 DYNAMIC STATUS UPDATER 🌟
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setMyOrders(myOrders.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-32 pb-20 px-6 md:px-12 selection:bg-[#5A1218] selection:text-[#faf8f5]">
      <div className="max-w-[1200px] mx-auto">
        
        <Reveal>
          <div className="text-center mb-12">
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl md:text-5xl font-normal tracking-[3px] text-[#1a1a1a] mb-8">
              Artisan Workspace
            </h1>
            
            <div className="flex justify-center flex-wrap gap-6 md:gap-10 border-b border-[#e8e6e2] pb-4">
              <button 
                onClick={() => setActiveTab('garments')} 
                style={{ fontFamily: "'Montserrat', sans-serif" }} 
                className={`text-[11px] tracking-[2px] uppercase px-4 py-2 transition-colors ${activeTab === 'garments' ? 'text-[#5A1218] border-b border-[#5A1218]' : 'text-[#999] hover:text-[#1a1a1a]'}`}
              >
                Manage Garments
              </button>
              <button 
                onClick={() => setActiveTab('collections')} 
                style={{ fontFamily: "'Montserrat', sans-serif" }} 
                className={`text-[11px] tracking-[2px] uppercase px-4 py-2 transition-colors ${activeTab === 'collections' ? 'text-[#5A1218] border-b border-[#5A1218]' : 'text-[#999] hover:text-[#1a1a1a]'}`}
              >
                Curate Collections
              </button>
              <button 
                onClick={() => setActiveTab('orders')} 
                style={{ fontFamily: "'Montserrat', sans-serif" }} 
                className={`text-[11px] tracking-[2px] uppercase px-4 py-2 transition-colors ${activeTab === 'orders' ? 'text-[#5A1218] border-b border-[#5A1218]' : 'text-[#999] hover:text-[#1a1a1a]'}`}
              >
                Client Orders
              </button>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-7">
            <Reveal delay={0.2}>
              <div className={`bg-[#f5f3f0] p-10 md:p-14 border transition-colors duration-500 ${isEditing ? 'border-[#5A1218] shadow-lg shadow-[#5A1218]/10' : 'border-[#e8e6e2]'}`}>
                
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    {activeTab === 'garments' && (isEditing ? <Edit2 size={20} className="text-[#5A1218]" /> : <Plus size={20} className="text-[#5A1218]" />)}
                    {activeTab === 'collections' && <Layout size={20} className="text-[#5A1218]" />}
                    {activeTab === 'orders' && <Package size={20} className="text-[#5A1218]" />}
                    
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl tracking-[1px] text-[#1a1a1a]">
                      {activeTab === 'garments' && (isEditing ? 'Modify Garment' : 'Curate New Garment')}
                      {activeTab === 'collections' && 'Curate Home Collection'}
                      {activeTab === 'orders' && 'Order Management'}
                    </h2>
                  </div>
                  {isEditing && activeTab === 'garments' && (
                    <button onClick={resetForm} style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-widest uppercase text-[#999] hover:text-red-800 flex items-center gap-1">
                      <X size={12}/> Cancel Edit
                    </button>
                  )}
                </div>

                {message && (
                  <div style={{ fontFamily: "'Montserrat', sans-serif" }} className={`mb-8 p-4 border text-[10px] tracking-[2px] uppercase text-center ${message.type === 'success' ? 'border-[#5A1218] bg-[#5A1218]/10 text-[#5A1218]' : 'border-red-800 bg-red-50 text-red-800'}`}>
                    {message.text}
                  </div>
                )}

                {/* --- FORM 1: GARMENTS --- */}
                {activeTab === 'garments' && (
                  <form onSubmit={handleProductSubmit} className="space-y-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <input type="text" name="name" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} className="w-full bg-transparent border-b border-[#ccc] pb-3 text-[11px] tracking-widest uppercase focus:outline-none focus:border-[#5A1218] text-[#1a1a1a] placeholder:text-[#999] transition-colors" placeholder="Garment Title" required />
                      <input type="number" name="price" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} className="w-full bg-transparent border-b border-[#ccc] pb-3 text-[11px] tracking-widest uppercase focus:outline-none focus:border-[#5A1218] text-[#1a1a1a] placeholder:text-[#999] transition-colors" placeholder="Price (INR)" required min="0" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <select name="category" value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})} className="w-full bg-transparent border-b border-[#ccc] pb-3 text-[11px] tracking-widest uppercase focus:outline-none focus:border-[#5A1218] text-[#1a1a1a] appearance-none transition-colors" required>
                        <option value="" disabled className="text-[#aaa]">Select Category</option>
                        <option value="Bridal">Bridal</option>
                        <option value="Sarees">Sarees</option>
                        <option value="Menswear">Menswear</option>
                        <option value="Jewellery">Jewellery</option>
                        <option value="Accessories">Accessories</option>
                      </select>

                      <select name="belongsToCollection" value={productData.belongsToCollection} onChange={e => setProductData({...productData, belongsToCollection: e.target.value})} className="w-full bg-transparent border-b border-[#ccc] pb-3 text-[11px] tracking-widest uppercase focus:outline-none focus:border-[#5A1218] text-[#1a1a1a] appearance-none transition-colors">
                        <option value="">Standard Catalog (No Collection)</option>
                        {myCollections.map(c => <option key={c._id} value={c.title}>{c.title}</option>)}
                      </select>
                    </div>

                    <div className="relative">
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={e => handleImageUpload(e, false)} className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current.click()} className="w-full py-4 border-b border-[#ccc] flex items-center justify-between text-[11px] tracking-[2px] uppercase text-[#1a1a1a] hover:border-[#5A1218] transition-colors focus:outline-none">
                        <span className="truncate pr-4 opacity-70">{productData.image ? 'Image Uploaded ✓' : 'Upload Local Image'}</span>
                        <UploadCloud size={16} className="text-[#5A1218]" />
                      </button>
                    </div>

                    {productData.image && <div className="w-24 h-32 bg-[#eee] border border-[#e8e6e2] overflow-hidden"><img src={productData.image} alt="Preview" className="w-full h-full object-cover" /></div>}
                    
                    <textarea name="description" value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} className="w-full bg-transparent border-b border-[#ccc] pb-3 text-[11px] tracking-widest uppercase focus:outline-none focus:border-[#5A1218] text-[#1a1a1a] placeholder:text-[#999] transition-colors resize-none h-24" placeholder="Story & Heritage Description..." required></textarea>
                    
                    <button type="submit" disabled={loading} className="w-full bg-[#5A1218] text-[#faf8f5] px-10 py-4 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#3a0a0f] transition-colors shadow-lg disabled:opacity-50">
                      <span>{loading ? 'Processing...' : isEditing ? 'Update Garment' : 'Publish Garment'}</span>
                    </button>
                  </form>
                )}

                {/* --- FORM 2: COLLECTIONS --- */}
                {activeTab === 'collections' && (
                  <form onSubmit={handleCollectionSubmit} className="space-y-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    <input type="text" value={collectionData.title} onChange={e => setCollectionData({...collectionData, title: e.target.value})} className="w-full bg-transparent border-b border-[#ccc] pb-3 text-[11px] tracking-widest uppercase focus:outline-none focus:border-[#5A1218] text-[#1a1a1a] placeholder:text-[#999] transition-colors" placeholder="Collection Title (e.g. The Bridal Edit)" required />
                    <input type="text" value={collectionData.subtitle} onChange={e => setCollectionData({...collectionData, subtitle: e.target.value})} className="w-full bg-transparent border-b border-[#ccc] pb-3 text-[11px] tracking-widest uppercase focus:outline-none focus:border-[#5A1218] text-[#1a1a1a] placeholder:text-[#999] transition-colors" placeholder="Subtitle (e.g. Timeless traditions)" required />
                    
                    <div>
                      <p className="text-[10px] tracking-[2px] uppercase text-[#666] mb-3">Cover Image / Video</p>
                      <input type="file" accept="image/*,video/mp4" onChange={e => handleImageUpload(e, true)} className="text-sm text-[#1a1a1a] file:mr-4 file:py-3 file:px-6 file:rounded-none file:border-0 file:text-[10px] file:tracking-widest file:uppercase file:bg-[#1a1a1a] file:text-[#faf8f5] hover:file:bg-[#5A1218] file:transition-colors file:cursor-pointer" required={!collectionData.image} />
                    </div>

                    {collectionData.image && (
                      <div className="w-full h-48 bg-[#eee] border border-[#e8e6e2] overflow-hidden">
                        {collectionData.image.includes('video') || collectionData.image.endsWith('.mp4') ? (
                          <video src={collectionData.image} autoPlay loop muted className="w-full h-full object-cover" />
                        ) : (
                          <img src={collectionData.image} alt="Preview" className="w-full h-full object-cover" />
                        )}
                      </div>
                    )}
                    
                    <button type="submit" disabled={loading} className="w-full bg-[#5A1218] text-[#faf8f5] px-10 py-4 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#3a0a0f] transition-colors shadow-lg disabled:opacity-50">
                      <span>{loading ? 'Processing...' : 'Publish Collection to Home'}</span>
                    </button>
                  </form>
                )}

                {/* --- STATE 3: ORDERS PLACEHOLDER --- */}
                {activeTab === 'orders' && (
                  <div className="text-center py-20">
                     <Package size={48} className="mx-auto text-[#ccc] mb-4" strokeWidth={1}/>
                     <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-[#1a1a1a] mb-2 font-normal">Order Management</h3>
                     <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] text-[#666] tracking-widest uppercase">Review and fulfill your client orders from the archive panel.</p>
                  </div>
                )}

              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.4}>
              <div className="sticky top-32">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e8e6e2]">
                  <div className="flex items-center gap-3">
                    <Archive size={20} className="text-[#5A1218]" />
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl tracking-[1px] text-[#1a1a1a]">Archives</h2>
                  </div>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[2px] text-[#999] uppercase">
                    {activeTab === 'garments' && `${myProducts.length} Items`}
                    {activeTab === 'collections' && `${myCollections.length} Items`}
                    {activeTab === 'orders' && `${myOrders.length} Orders`}
                  </span>
                </div>

                <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#e8e6e2] scrollbar-track-transparent">
                  {fetchingData ? (
                    <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-[#5A1218] border-t-transparent rounded-full animate-spin"></div></div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* ARCHIVE 1: GARMENTS */}
                      {activeTab === 'garments' && myProducts.length === 0 && <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] tracking-[2px] text-[#999] uppercase text-center py-12 italic">Your ledger is empty.</p>}
                      {activeTab === 'garments' && myProducts.map((product) => (
                        <div key={product._id} className="flex items-center gap-4 group bg-[#f5f3f0] border border-transparent hover:border-[#e8e6e2] p-3 transition-colors">
                          <img src={product.image} alt={product.name} className="w-16 h-24 object-cover bg-[#eee]" />
                          <div className="flex-1">
                            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] tracking-[2px] text-[#5A1218] uppercase mb-1">{product.category}</p>
                            <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl text-[#1a1a1a] tracking-wide leading-tight mb-1">{product.name}</h3>
                            {product.belongsToCollection && <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] text-[#888] tracking-widest uppercase mb-1">Col: {product.belongsToCollection}</p>}
                            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] text-[#666] tracking-wide">INR {product.price?.toLocaleString('en-IN')}</p>
                          </div>
                          <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                            <button onClick={() => handleEditClick(product)} className="p-2 text-[#ccc] hover:text-[#5A1218] transition-colors" title="Edit Garment"><Edit2 size={16} strokeWidth={1.5} /></button>
                            <button onClick={() => handleDeleteProduct(product._id)} className="p-2 text-[#ccc] hover:text-red-800 transition-colors" title="Remove Garment"><Trash2 size={16} strokeWidth={1.5} /></button>
                          </div>
                        </div>
                      ))}

                      {/* ARCHIVE 2: COLLECTIONS */}
                      {activeTab === 'collections' && myCollections.length === 0 && <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] tracking-[2px] text-[#999] uppercase text-center py-12 italic">No collections curated yet.</p>}
                      {activeTab === 'collections' && myCollections.map((col) => (
                        <div key={col._id} className="flex items-center gap-4 group bg-[#f5f3f0] border border-transparent hover:border-[#e8e6e2] p-3 transition-colors">
                          <div className="w-24 h-16 bg-[#eee] overflow-hidden">
                            {col.image.includes('video') || col.image.endsWith('.mp4') ? (
                              <video src={col.image} className="w-full h-full object-cover" />
                            ) : (
                              <img src={col.image} alt={col.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] tracking-[2px] text-[#5A1218] uppercase mb-1">{col.subtitle}</p>
                            <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl text-[#1a1a1a] tracking-wide leading-tight mb-1">{col.title}</h3>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                            <button onClick={() => handleDeleteCollection(col._id)} className="p-2 text-[#ccc] hover:text-red-800 transition-colors" title="Remove Collection"><Trash2 size={16} strokeWidth={1.5} /></button>
                          </div>
                        </div>
                      ))}

                      {/* ARCHIVE 3: CLIENT ORDERS WITH DYNAMIC DROPDOWN */}
                      {activeTab === 'orders' && myOrders.length === 0 && (
                        <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] tracking-[2px] text-[#999] uppercase text-center py-12 italic">No client orders yet.</p>
                      )}
                      {activeTab === 'orders' && myOrders.map((order) => (
                        <div key={order._id} className="bg-[#f5f3f0] border border-[#e8e6e2] p-6 mb-6">
                          <div className="flex justify-between border-b border-[#e8e6e2] pb-4 mb-4">
                            <div>
                              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] tracking-widest uppercase text-[#5A1218] mb-1">Order #{order._id.slice(-6)}</p>
                              <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl text-[#1a1a1a]">{order.user?.name || "Guest Patron"}</p>
                            </div>
                            <div className="text-right">
                              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] tracking-widest uppercase text-[#999] mb-2">{new Date(order.createdAt).toLocaleDateString()}</p>
                              
                              <select 
                                  value={order.status || 'Order Received'}
                                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                                  className="text-[9px] tracking-widest uppercase border border-[#ccc] bg-transparent text-[#1a1a1a] p-1.5 focus:outline-none focus:border-[#5A1218] cursor-pointer hover:bg-[#5A1218] hover:text-[#faf8f5] hover:border-[#5A1218] transition-colors"
                              >
                                  <option value="Order Received" className="bg-[#faf8f5] text-[#1a1a1a]">Order Received</option>
                                  <option value="In Transit" className="bg-[#faf8f5] text-[#1a1a1a]">In Transit</option>
                                  <option value="Out for Delivery" className="bg-[#faf8f5] text-[#1a1a1a]">Out for Delivery</option>
                                  <option value="Delivered" className="bg-[#faf8f5] text-[#1a1a1a]">Delivered</option>
                                  <option value="Delayed" className="bg-[#faf8f5] text-[#1a1a1a]">Delayed</option>
                              </select>

                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[2px] uppercase text-[#666] mb-2 flex items-center gap-1">Shipping Destination:</p>
                            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] text-[#1a1a1a] leading-relaxed uppercase tracking-wider">
                              {order.shippingAddress.address}<br/>
                              {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br/>
                              {order.shippingAddress.country}
                            </p>
                          </div>

                          <div className="space-y-3 bg-white p-4 border border-[#e8e6e2]">
                            {order.orderItems.filter(item => item.seller === user._id).map(item => (
                              <div key={item._id} className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                   <img src={item.image} className="w-10 h-12 object-cover border border-[#eee]" alt={item.name} />
                                   <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-lg tracking-wide">{item.name} <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] text-[#999] ml-2 tracking-widest">x {item.qty}</span></p>
                                </div>
                                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] font-medium text-[#1a1a1a] tracking-wider">INR {(item.price * item.qty).toLocaleString('en-IN')}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;