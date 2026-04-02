import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, TrendingUp, Package, Users, Search, ChevronDown, Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import { AuthContext } from '../context/AuthContext'; // 🌟 Added AuthContext to get the token

// --- FALLBACK MOCK DATA ---
const MOCK_ORDERS = [
  { _id: "ORD-001", date: "2026-03-31", customer: "Aria Montgomery", item: "Ivory Silk Saree", total: 45000, status: "Delivered" },
  { _id: "ORD-002", date: "2026-03-30", customer: "Elena Rostova", item: "Midnight Velvet Sherwani", total: 62000, status: "Processing" },
];
const MOCK_PATRONS = [
  { _id: "PAT-001", name: "Sofia Chen", email: "sofia.c@example.com", totalSpent: 250000, orders: 5, joined: "2024-11-03" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // 🌟 Get the logged-in user

  // 🌟 Helper to get the auth token (Adjust if you store it differently, e.g., user.token)
  const token = localStorage.getItem('token') || (user && user.token);
  
  // Headers for API calls
  const authHeaders = {
    'Authorization': `Bearer ${token}`
  };
  const jsonAuthHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // --- STATES ---
  const [activeTab, setActiveTab] = useState('Overview');

  // Data States
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [patrons, setPatrons] = useState(MOCK_PATRONS);

  // Filter States
  const [timeframe, setTimeframe] = useState('All Time');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [search, setSearch] = useState('');

  // Modal States - Products
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: 'Sarees', belongsToCollection: '', stock: '', tag: ''
  });
  const [productImage, setProductImage] = useState(null);

  // Modal States - Collections
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [collectionForm, setCollectionForm] = useState({ title: '', subtitle: '' });
  const [collectionMedia, setCollectionMedia] = useState(null);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 🌟 Added Auth headers to GET requests in case your backend protects viewing data too
      const [prodRes, colRes, ordRes] = await Promise.all([
        fetch('/api/products', { headers: authHeaders }),
        fetch('/api/collections', { headers: authHeaders }),
        fetch('/api/orders', { headers: authHeaders }) 
      ]);
      
      if (prodRes.ok) setProducts(await prodRes.json());
      if (colRes.ok) setCollections(await colRes.json());
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData.length > 0 ? ordData : MOCK_ORDERS);
      } else {
        setOrders(MOCK_ORDERS);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setOrders(MOCK_ORDERS);
    }
  };

  // --- PRODUCT LOGIC ---
  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || '', description: product.description || '', price: product.price || '',
        category: product.category || 'Sarees', belongsToCollection: product.belongsToCollection || '',
        stock: product.stock || '', tag: product.tag || ''
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', category: 'Sarees', belongsToCollection: '', stock: '', tag: '' });
    }
    setProductImage(null);
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(productForm).forEach(key => formData.append(key, productForm[key]));
    if (productImage) formData.append('image', productImage);

    const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      // 🌟 Added Auth header (Do NOT set Content-Type for FormData, the browser handles it)
      const res = await fetch(url, { method, headers: authHeaders, body: formData });
      if (res.ok) {
        setIsProductModalOpen(false);
        fetchData();
        alert(`Garment successfully ${editingProduct ? 'updated' : 'added'}!`);
      } else {
        alert("Failed to save garment. You may not be authorized.");
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to permanently remove this garment from the archive?")) {
      try {
        // 🌟 Added Auth header
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: authHeaders });
        if (res.ok) fetchData();
      } catch (error) { console.error(error); }
    }
  };

  // --- COLLECTION LOGIC ---
  const handleCollectionSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', collectionForm.title);
    formData.append('subtitle', collectionForm.subtitle);
    if (collectionMedia) formData.append('image', collectionMedia);

    try {
      // 🌟 Added Auth header
      const res = await fetch('/api/collections', { method: 'POST', headers: authHeaders, body: formData });
      if (res.ok) {
        setIsCollectionModalOpen(false);
        setCollectionForm({ title: '', subtitle: '' });
        setCollectionMedia(null);
        fetchData();
        alert("Collection curated successfully!");
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteCollection = async (id) => {
    if (window.confirm("Delete this collection? Garments will remain but won't belong to this collection anymore.")) {
      try {
        // 🌟 Added Auth header
        const res = await fetch(`/api/collections/${id}`, { method: 'DELETE', headers: authHeaders });
        if (res.ok) fetchData();
      } catch (error) { console.error(error); }
    }
  };

  // --- ORDER LOGIC ---
  const handleOrderStatusChange = async (orderId, newStatus) => {
    // 🌟 THE FIX: Stop 500 error on mock data
    if (orderId.startsWith('ORD-')) {
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      return; 
    }

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: jsonAuthHeaders, 
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("Unauthorized: Failed to update order status.");
      }
    } catch (error) { console.error(error); }
  };

  // --- FILTERING & EXPORT LOGIC ---
  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(o => 
        (o._id && o._id.toLowerCase().includes(lowerSearch)) || 
        (o.customer && o.customer.toLowerCase().includes(lowerSearch)) ||
        (o.item && o.item.toLowerCase().includes(lowerSearch))
      );
    }
    const today = new Date();
    filtered = filtered.filter(order => {
      if (!order.date) return true;
      const orderDate = new Date(order.date);
      switch (timeframe) {
        case 'Today': return orderDate.toDateString() === today.toDateString();
        case 'This Month': return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
        case 'This Year': return orderDate.getFullYear() === today.getFullYear();
        case 'Custom':
          if (customStart && customEnd) {
            const start = new Date(customStart);
            const end = new Date(customEnd);
            end.setHours(23, 59, 59, 999); 
            return orderDate >= start && orderDate <= end;
          }
          return true;
        default: return true;
      }
    });
    return filtered;
  }, [orders, timeframe, customStart, customEnd, search]);

  const handleExportExcel = () => {
    if (filteredOrders.length === 0) return alert("No orders to export.");
    const excelData = filteredOrders.map(order => ({
      "Order ID": order._id, "Date": order.date, "Patron Name": order.customer,
      "Garment": order.item, "Total Amount (INR)": order.total, "Status": order.status
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, `Niali_Orders_${timeframe.replace(' ', '_')}.xlsx`);
  };

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  // --- RENDERERS ---

  return (
    <div className="min-h-screen bg-[#faf8f5] flex font-sans text-[#1a1a1a]">
      
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-white border-r border-[#1a1a1a]/5 hidden md:flex flex-col z-10 shrink-0">
        <div 
          onClick={() => navigate('/')}
          className="p-10 flex flex-col items-center border-b border-[#1a1a1a]/5 cursor-pointer hover:opacity-70 transition-opacity"
          title="Return to Storefront"
        >
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl tracking-widest text-[#5A1218]">NIALI</h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[8px] tracking-[4px] uppercase text-[#999] mt-2">Director's Desk</p>
        </div>
        <nav className="flex-1 py-10 px-6 flex flex-col gap-2">
          {['Overview', 'Orders', 'Atelier Inventory', 'Curated Collections', 'Patrons'].map((item) => (
            <button 
              key={item} onClick={() => setActiveTab(item)}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className={`text-left text-[11px] tracking-[2px] uppercase px-4 py-4 transition-all duration-300 ${
                activeTab === item ? 'bg-[#faf8f5] text-[#5A1218] font-semibold border-l-2 border-[#5A1218]' : 'text-[#666] hover:bg-[#faf8f5] hover:text-[#1a1a1a] border-l-2 border-transparent'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="p-8">
          <button onClick={() => navigate('/')} style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[2px] uppercase text-[#999] hover:text-[#5A1218] transition-colors w-full text-left">
            ← Return to Storefront
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-[100px] bg-white/50 backdrop-blur-md border-b border-[#1a1a1a]/5 flex items-center justify-between px-10 shrink-0 z-10">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light tracking-wide text-[#1a1a1a] capitalize">
            {activeTab}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#5A1218] text-white flex items-center justify-center font-serif text-xl shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          
          {/* OVERVIEW & ORDERS */}
          {(activeTab === 'Overview' || activeTab === 'Orders') && (
            <div className="animate-fade-in">
              {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white p-8 border border-[#1a1a1a]/5 shadow-sm rounded-sm">
                    <div className="flex items-center justify-between mb-4 text-[#999]">
                      <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[3px] uppercase">Total Revenue</p>
                      <TrendingUp size={16} strokeWidth={1.5} />
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl text-[#1a1a1a]">₹ {totalRevenue.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-white p-8 border border-[#1a1a1a]/5 shadow-sm rounded-sm">
                    <div className="flex items-center justify-between mb-4 text-[#999]">
                      <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[3px] uppercase">Orders Placed</p>
                      <Package size={16} strokeWidth={1.5} />
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl text-[#1a1a1a]">{filteredOrders.length}</p>
                  </div>
                  <div className="bg-white p-8 border border-[#1a1a1a]/5 shadow-sm rounded-sm">
                    <div className="flex items-center justify-between mb-4 text-[#999]">
                      <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[3px] uppercase">Active Patrons</p>
                      <Users size={16} strokeWidth={1.5} />
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl text-[#1a1a1a]">{[...new Set(filteredOrders.map(o => o.customer))].length}</p>
                  </div>
                </div>
              )}

              {/* Order Controls */}
              <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8">
                <div className="flex flex-col sm:flex-row items-end gap-4 w-full lg:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
                    <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ fontFamily: "'Montserrat', sans-serif" }} className="w-full bg-white border border-[#1a1a1a]/10 text-[11px] tracking-widest pl-10 pr-4 py-3 focus:outline-none focus:border-[#5A1218]" />
                  </div>
                  <div className="relative w-full sm:w-48">
                    <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} style={{ fontFamily: "'Montserrat', sans-serif" }} className="w-full bg-white border border-[#1a1a1a]/10 text-[11px] tracking-[2px] uppercase pl-4 pr-10 py-3 appearance-none cursor-pointer focus:outline-none focus:border-[#5A1218]">
                      <option value="All Time">All Time</option><option value="Today">Today</option><option value="This Month">This Month</option><option value="This Year">This Year</option><option value="Custom">Custom Date</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a1a] pointer-events-none" />
                  </div>
                  {timeframe === 'Custom' && (
                    <div className="flex items-center gap-2 animate-fade-in">
                      <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} style={{ fontFamily: "'Montserrat', sans-serif" }} className="bg-white border border-[#1a1a1a]/10 text-[10px] px-3 py-3 outline-none focus:border-[#5A1218]" />
                      <span className="text-[#999]">-</span>
                      <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} style={{ fontFamily: "'Montserrat', sans-serif" }} className="bg-white border border-[#1a1a1a]/10 text-[10px] px-3 py-3 outline-none focus:border-[#5A1218]" />
                    </div>
                  )}
                </div>
                <button onClick={handleExportExcel} style={{ fontFamily: "'Montserrat', sans-serif" }} className="flex items-center gap-3 bg-[#5A1218] text-[#faf8f5] px-6 py-3 text-[10px] tracking-[3px] uppercase hover:bg-[#3a0a0f] transition-colors shadow-md w-full lg:w-auto justify-center">
                  <Download size={14} /> Export to Excel
                </button>
              </div>

              {/* Orders Table */}
              <div className="bg-white border border-[#1a1a1a]/5 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]/10 bg-[#faf8f5]/50">
                      {['Order ID', 'Date', 'Patron', 'Garment', 'Status', 'Total'].map((head) => (
                        <th key={head} style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-[9px] tracking-[3px] uppercase text-[#999] font-medium">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                      <tr key={order._id} className="border-b border-[#1a1a1a]/5 hover:bg-[#faf8f5]/50">
                        <td style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-xs text-[#1a1a1a] font-medium">{order._id.substring(0,8).toUpperCase()}</td>
                        <td style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-xs text-[#666]">{order.date ? new Date(order.date).toLocaleDateString() : '-'}</td>
                        <td style={{ fontFamily: "'Cormorant Garamond', serif" }} className="py-5 px-6 text-xl text-[#1a1a1a] italic">{order.customer || 'Guest'}</td>
                        <td style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-xs text-[#666]">{order.item || 'Multiple Items'}</td>
                        <td className="py-5 px-6">
                          <select
                            value={order.status || 'Processing'}
                            onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                            className={`appearance-none outline-none cursor-pointer text-[9px] tracking-widest uppercase px-3 py-2 rounded-sm font-semibold transition-colors ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800 border border-green-200' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-sm text-[#1a1a1a] font-medium">₹ {(order.total || 0).toLocaleString('en-IN')}</td>
                      </tr>
                    )) : <tr><td colSpan="6" className="py-16 text-center text-[#999] text-[11px] uppercase tracking-[2px]">No orders found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'Atelier Inventory' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-[#1a1a1a]">Garment Archive</h3>
                <button onClick={() => openProductModal()} style={{ fontFamily: "'Montserrat', sans-serif" }} className="flex items-center gap-2 bg-[#5A1218] text-[#faf8f5] px-6 py-3 text-[10px] tracking-[3px] uppercase hover:bg-[#3a0a0f] transition-colors shadow-sm">
                  <Plus size={14} /> Add Garment
                </button>
              </div>
              <div className="bg-white border border-[#1a1a1a]/5 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]/10 bg-[#faf8f5]/50">
                      {['Image', 'Garment Name', 'Category', 'Collection', 'Stock', 'Price', 'Actions'].map((head) => (
                        <th key={head} style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-[9px] tracking-[3px] uppercase text-[#999] font-medium">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? products.map((item) => (
                      <tr key={item._id} className="border-b border-[#1a1a1a]/5 hover:bg-[#faf8f5]/50 transition-colors">
                        <td className="py-3 px-6"><img src={item.image || '/placeholder.jpg'} alt="" className="w-12 h-16 object-cover rounded-sm" /></td>
                        <td style={{ fontFamily: "'Cormorant Garamond', serif" }} className="py-5 px-6 text-xl text-[#1a1a1a]">{item.name}</td>
                        <td style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-xs text-[#666]">{item.category}</td>
                        <td style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-xs text-[#666] italic">{item.belongsToCollection || '-'}</td>
                        <td style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-xs text-[#1a1a1a] font-medium">{item.stock}</td>
                        <td style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-sm text-[#1a1a1a] font-medium">₹ {(item.price || 0).toLocaleString('en-IN')}</td>
                        <td className="py-5 px-6 flex gap-4 h-full items-center mt-3">
                          <button onClick={() => openProductModal(item)} className="text-[#999] hover:text-[#5A1218] transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteProduct(item._id)} className="text-[#999] hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    )) : <tr><td colSpan="7" className="py-16 text-center text-[#999] text-[11px] uppercase tracking-[2px]">No garments in archive.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CURATED COLLECTIONS TAB */}
          {activeTab === 'Curated Collections' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-[#1a1a1a]">Collections</h3>
                <button onClick={() => setIsCollectionModalOpen(true)} style={{ fontFamily: "'Montserrat', sans-serif" }} className="flex items-center gap-2 bg-[#5A1218] text-[#faf8f5] px-6 py-3 text-[10px] tracking-[3px] uppercase hover:bg-[#3a0a0f] transition-colors shadow-sm">
                  <Plus size={14} /> Curate Collection
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map(c => (
                  <div key={c._id} className="bg-white border border-[#1a1a1a]/5 p-6 rounded-sm shadow-sm group">
                    <div className="h-[200px] w-full bg-[#eee] mb-4 overflow-hidden rounded-sm relative">
                      {c.image?.includes('video') || c.image?.endsWith('.mp4') ? (
                        <video src={c.image} autoPlay loop muted className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <img src={c.image} alt={c.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                      )}
                      <button onClick={() => handleDeleteCollection(c._id)} className="absolute top-3 right-3 bg-white/90 p-2 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100 shadow-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] tracking-[3px] uppercase text-[#5A1218] mb-1">{c.subtitle}</p>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-[#1a1a1a]">{c.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PATRONS TAB */}
          {activeTab === 'Patrons' && (
            <div className="animate-fade-in">
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-[#1a1a1a] mb-8">Clientele Directory</h3>
              <div className="bg-white border border-[#1a1a1a]/5 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]/10 bg-[#faf8f5]/50">
                      {['Patron ID', 'Name', 'Contact', 'Orders', 'Lifetime Value', 'Joined'].map((head) => (
                        <th key={head} style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-[9px] tracking-[3px] uppercase text-[#999] font-medium">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patrons.map((patron) => (
                      <tr key={patron._id} className="border-b border-[#1a1a1a]/5 hover:bg-[#faf8f5]/50">
                        <td style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-xs text-[#999]">{patron._id.substring(0,8).toUpperCase()}</td>
                        <td style={{ fontFamily: "'Cormorant Garamond', serif" }} className="py-5 px-6 text-xl text-[#1a1a1a] italic">{patron.name}</td>
                        <td style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-xs text-[#666]">{patron.email}</td>
                        <td style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-xs text-[#1a1a1a]">{patron.orders}</td>
                        <td style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-sm text-[#1a1a1a] font-medium">₹ {(patron.totalSpent||0).toLocaleString('en-IN')}</td>
                        <td style={{ fontFamily: "'Montserrat', sans-serif" }} className="py-5 px-6 text-xs text-[#666]">{patron.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* --- MODALS --- */}
        
        {/* ADD/EDIT GARMENT MODAL */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#faf8f5] w-full max-w-2xl shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between px-8 py-6 border-b border-[#1a1a1a]/10 bg-white shrink-0">
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-[#1a1a1a]">
                  {editingProduct ? 'Edit Garment' : 'Add to Archive'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)} className="text-[#999] hover:text-[#5A1218] transition-colors"><X size={24} strokeWidth={1} /></button>
              </div>
              <div className="overflow-y-auto p-8 custom-scrollbar">
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div>
                    <label style={{ fontFamily: "'Montserrat', sans-serif" }} className="block text-[10px] tracking-[2px] uppercase text-[#666] mb-2">Garment Name</label>
                    <input type="text" required value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} style={{ fontFamily: "'Cormorant Garamond', serif" }} className="w-full bg-transparent border-b border-[#1a1a1a]/20 text-2xl py-2 focus:outline-none focus:border-[#5A1218] placeholder:text-[#ccc]" placeholder="e.g. Ivory Silk Saree" />
                  </div>
                  
                  <div>
                    <label style={{ fontFamily: "'Montserrat', sans-serif" }} className="block text-[10px] tracking-[2px] uppercase text-[#666] mb-2">Description</label>
                    <textarea rows="3" required value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} style={{ fontFamily: "'Montserrat', sans-serif" }} className="w-full bg-white border border-[#1a1a1a]/20 text-xs px-4 py-3 outline-none focus:border-[#5A1218] resize-none" placeholder="Garment details..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label style={{ fontFamily: "'Montserrat', sans-serif" }} className="block text-[10px] tracking-[2px] uppercase text-[#666] mb-2">Section (Category)</label>
                      <select required value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} style={{ fontFamily: "'Montserrat', sans-serif" }} className="w-full bg-white border border-[#1a1a1a]/20 text-xs px-4 py-3 outline-none focus:border-[#5A1218]">
                        <option value="Sarees">Sarees & Weaves</option>
                        <option value="Bridal">Bridal Couture</option>
                        <option value="Menswear">Menswear</option>
                        <option value="Jewellery">Jewellery</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Couture">Couture</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Montserrat', sans-serif" }} className="block text-[10px] tracking-[2px] uppercase text-[#666] mb-2">Curated Collection (Optional)</label>
                      <select value={productForm.belongsToCollection} onChange={(e) => setProductForm({...productForm, belongsToCollection: e.target.value})} style={{ fontFamily: "'Montserrat', sans-serif" }} className="w-full bg-white border border-[#1a1a1a]/20 text-xs px-4 py-3 outline-none focus:border-[#5A1218]">
                        <option value="">-- None --</option>
                        {collections.map(c => <option key={c._id} value={c.title}>{c.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Montserrat', sans-serif" }} className="block text-[10px] tracking-[2px] uppercase text-[#666] mb-2">Price (INR)</label>
                      <input type="number" required min="0" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} style={{ fontFamily: "'Montserrat', sans-serif" }} className="w-full bg-white border border-[#1a1a1a]/20 text-xs px-4 py-3 outline-none focus:border-[#5A1218]" placeholder="0" />
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Montserrat', sans-serif" }} className="block text-[10px] tracking-[2px] uppercase text-[#666] mb-2">Stock Quantity</label>
                      <input type="number" required min="0" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} style={{ fontFamily: "'Montserrat', sans-serif" }} className="w-full bg-white border border-[#1a1a1a]/20 text-xs px-4 py-3 outline-none focus:border-[#5A1218]" placeholder="0" />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ fontFamily: "'Montserrat', sans-serif" }} className="block text-[10px] tracking-[2px] uppercase text-[#666] mb-2">Garment Imagery</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#1a1a1a]/10 border-dashed rounded-sm cursor-pointer bg-white hover:bg-[#faf8f5] transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-6 h-6 mb-2 text-[#999]" />
                          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[1px] uppercase text-[#666]">
                            {productImage ? productImage.name : (editingProduct && editingProduct.image ? 'Upload new to replace existing image' : 'Click to upload media')}
                          </p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => setProductImage(e.target.files[0])} />
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4 justify-end border-t border-[#1a1a1a]/10 mt-6">
                    <button type="button" onClick={() => setIsProductModalOpen(false)} style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[2px] uppercase text-[#666] hover:text-[#1a1a1a] px-6 py-3">Cancel</button>
                    <button type="submit" style={{ fontFamily: "'Montserrat', sans-serif" }} className="bg-[#5A1218] text-[#faf8f5] px-8 py-3 text-[10px] tracking-[3px] uppercase hover:bg-[#3a0a0f] shadow-sm">
                      {editingProduct ? 'Update Garment' : 'Save to Archive'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* CURATE COLLECTION MODAL */}
        {isCollectionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white w-full max-w-lg shadow-2xl rounded-sm overflow-hidden">
              <div className="flex items-center justify-between px-8 py-6 border-b border-[#1a1a1a]/5 bg-[#faf8f5]">
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-[#1a1a1a]">Curate Collection</h3>
                <button onClick={() => setIsCollectionModalOpen(false)} className="text-[#999] hover:text-[#5A1218] transition-colors"><X size={24} strokeWidth={1} /></button>
              </div>
              <form onSubmit={handleCollectionSubmit} className="p-8 space-y-6">
                <div>
                  <label style={{ fontFamily: "'Montserrat', sans-serif" }} className="block text-[10px] tracking-[2px] uppercase text-[#666] mb-2">Collection Title</label>
                  <input type="text" required value={collectionForm.title} onChange={(e) => setCollectionForm({...collectionForm, title: e.target.value})} style={{ fontFamily: "'Cormorant Garamond', serif" }} className="w-full bg-transparent border-b border-[#1a1a1a]/20 text-2xl py-2 outline-none focus:border-[#5A1218]" placeholder="e.g. Quiet Luxury" />
                </div>
                <div>
                  <label style={{ fontFamily: "'Montserrat', sans-serif" }} className="block text-[10px] tracking-[2px] uppercase text-[#666] mb-2">Subtitle / Tagline</label>
                  <input type="text" required value={collectionForm.subtitle} onChange={(e) => setCollectionForm({...collectionForm, subtitle: e.target.value})} style={{ fontFamily: "'Montserrat', sans-serif" }} className="w-full bg-white border border-[#1a1a1a]/20 text-xs px-4 py-3 outline-none focus:border-[#5A1218]" placeholder="Timeless over trendy" />
                </div>
                <div>
                  <label style={{ fontFamily: "'Montserrat', sans-serif" }} className="block text-[10px] tracking-[2px] uppercase text-[#666] mb-2">Cover Media (Image/Video)</label>
                  <input type="file" required accept="image/*,video/*" onChange={(e) => setCollectionMedia(e.target.files[0])} style={{ fontFamily: "'Montserrat', sans-serif" }} className="w-full text-xs text-[#666] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:tracking-[2px] file:uppercase file:bg-[#faf8f5] file:text-[#5A1218] hover:file:bg-[#f0ece1] cursor-pointer" />
                </div>
                <div className="pt-4 flex gap-4 justify-end">
                  <button type="submit" style={{ fontFamily: "'Montserrat', sans-serif" }} className="bg-[#5A1218] text-[#faf8f5] px-8 py-3 text-[10px] tracking-[3px] uppercase hover:bg-[#3a0a0f] shadow-sm">Publish Collection</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;