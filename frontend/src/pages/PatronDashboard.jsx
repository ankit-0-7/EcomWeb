import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Reveal } from '../components/UIElements';
import { Package, MapPin } from 'lucide-react';

const PatronDashboard = () => {
  const { user } = useContext(AuthContext);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (res.ok) setMyOrders(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyOrders();
  }, [user]);

  const getStatusColor = (status) => {
      switch(status) {
          case 'Order Received': return 'bg-[#1a1a1a] text-[#faf8f5]';
          case 'In Transit': return 'bg-[#5A1218] text-[#faf8f5]'; // 🌟 Niali Burgundy
          case 'Out for Delivery': return 'bg-yellow-600 text-[#faf8f5]';
          case 'Delivered': return 'bg-green-700 text-[#faf8f5]';
          case 'Delayed': return 'bg-red-800 text-[#faf8f5]';
          default: return 'bg-[#1a1a1a] text-[#faf8f5]';
      }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-32 pb-20 px-6 md:px-12 selection:bg-[#5A1218] selection:text-[#faf8f5]">
      <div className="max-w-[1000px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] tracking-[5px] uppercase text-[#5A1218] mb-3">
              Patron Profile
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl md:text-5xl font-normal tracking-[3px] text-[#1a1a1a] mb-6">
              Order History
            </h1>
            <div className="w-12 h-[1px] bg-[#5A1218] mx-auto mb-16"></div>
          </div>
        </Reveal>

        {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#5A1218] border-t-transparent rounded-full animate-spin"></div></div>
        ) : myOrders.length === 0 ? (
            <div className="text-center py-20">
                <Package size={48} className="mx-auto text-[#ccc] mb-6" strokeWidth={1} />
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-[#1a1a1a] mb-2 tracking-wide font-normal">
                  No Recent Orders
                </h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] text-[#999] tracking-widest uppercase">
                  Your collection history will appear here.
                </p>
            </div>
        ) : (
            <div className="space-y-10">
              {myOrders.map((order, i) => (
                  <Reveal key={order._id} delay={0.1 * i}>
                      <div className="bg-[#f5f3f0] border border-[#e8e6e2] p-8 md:p-10 shadow-sm">
                          
                          {/* Order Header */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#e8e6e2] pb-6 mb-6 gap-4">
                              <div>
                                  <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] tracking-widest uppercase text-[#999] mb-2">Order Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                                  <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl text-[#1a1a1a] tracking-wide">Order #{order._id.slice(-8).toUpperCase()}</p>
                              </div>
                              <div className="text-left md:text-right">
                                  <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] tracking-widest uppercase text-[#999] mb-2">Current Status</p>
                                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className={`px-4 py-2 text-[9px] tracking-widest uppercase font-medium ${getStatusColor(order.status)}`}>
                                      {order.status}
                                  </span>
                              </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-6 mb-8">
                              {order.orderItems.map(item => (
                                  <div key={item._id} className="flex items-center gap-6">
                                      <img src={item.image} alt={item.name} className="w-16 h-24 object-cover border border-[#e8e6e2] shadow-sm" />
                                      <div className="flex-1">
                                          <h4 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl text-[#1a1a1a] tracking-wide">{item.name}</h4>
                                          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] text-[#666] tracking-wider mt-2 uppercase">Qty: {item.qty}</p>
                                      </div>
                                      <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] text-[#1a1a1a] tracking-wider font-medium">INR {(item.price * item.qty).toLocaleString('en-IN')}</p>
                                  </div>
                              ))}
                          </div>

                          {/* Footer Info */}
                          <div className="flex flex-col md:flex-row justify-between pt-6 border-t border-[#e8e6e2] gap-6">
                              <div className="flex gap-3 text-[#666]">
                                  <MapPin size={18} className="text-[#5A1218] shrink-0" />
                                  <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] tracking-wider leading-relaxed uppercase">
                                      {order.shippingAddress.address}<br/>
                                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                  </p>
                              </div>
                              <div className="md:text-right">
                                  <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] tracking-widest uppercase text-[#999] mb-2">Total Paid</p>
                                  <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-[#1a1a1a] tracking-wide">INR {order.totalPrice.toLocaleString('en-IN')}</p>
                              </div>
                          </div>

                      </div>
                  </Reveal>
              ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default PatronDashboard;