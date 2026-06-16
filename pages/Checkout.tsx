
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, CreditCard, ShieldCheck, ArrowRight, CheckCircle, ShoppingCart } from 'lucide-react';
import { getCart, getCourses, removeFromCart } from '../services/storageService';
import { Course } from '../types';
import { Button } from '../components/Button';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<Course[]>([]);
  const [step, setStep] = useState<'cart' | 'success'>('cart');
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    usi: '',
    paymentMethod: 'credit_card'
  });

  useEffect(() => {
    loadCart();
    // Listen for cart changes
    const handleStorageChange = () => loadCart();
    window.addEventListener('cartUpdated', handleStorageChange);
    return () => window.removeEventListener('cartUpdated', handleStorageChange);
  }, []);

  const loadCart = () => {
    const cartIds = getCart();
    const allCourses = getCourses();
    const items = cartIds.map(id => allCourses.find(c => c.id === id)).filter(Boolean) as Course[];
    setCartItems(items);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
    // State will update via event listener
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate processing
    setTimeout(() => {
        // Clear cart
        cartItems.forEach(item => removeFromCart(item.id));
        setStep('success');
        window.scrollTo(0, 0);
    }, 1500);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <Breadcrumbs />
        <div className="container mx-auto px-4 md:px-8 py-16 flex justify-center">
           <div className="bg-white p-12 rounded-3xl shadow-xl max-w-2xl text-center border border-gray-100">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 shadow-sm">
                 <CheckCircle size={48} />
              </div>
              <h1 className="text-4xl font-heading font-bold text-secondary mb-4">Enrollment Successful!</h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                 Thank you, <span className="font-bold text-gray-800">{formData.firstName}</span>. 
                 Your enrollment has been processed. A confirmation email with your student portal login details has been sent to <span className="font-bold text-primary">{formData.email}</span>.
              </p>
              <div className="flex justify-center gap-4">
                 <Link to="/">
                    <Button variant="outline" className="px-8 py-3">Return Home</Button>
                 </Link>
                 <Link to="/student-info">
                    <Button className="px-8 py-3 shadow-lg">Student Portal</Button>
                 </Link>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Breadcrumbs />
      
      <div className="bg-secondary text-white py-12 mb-12">
         <div className="container mx-auto px-4 md:px-8">
            <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
               <ShoppingCart className="text-accent" /> Checkout & Enrollment
            </h1>
         </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        {cartItems.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-200">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                 <ShoppingCart size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Browse our courses to start your learning journey.</p>
              <Link to="/courses">
                 <Button className="px-8 py-3">View Courses</Button>
              </Link>
           </div>
        ) : (
           <div className="grid lg:grid-cols-3 gap-12">
              {/* Left Column: Cart & Payment */}
              <div className="lg:col-span-2 space-y-8">
                 
                 {/* Cart Summary */}
                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
                    <div className="space-y-6">
                       {cartItems.map(item => (
                          <div key={item.id} className="flex gap-4 items-center group">
                             <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1">
                                <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.duration} • {item.level}</p>
                             </div>
                             <div className="text-right">
                                <div className="font-bold text-lg text-secondary">${item.price}</div>
                                <button 
                                   onClick={() => handleRemove(item.id)}
                                   className="text-xs text-red-500 hover:text-red-700 flex items-center justify-end gap-1 mt-1 font-medium"
                                >
                                   <Trash2 size={12} /> Remove
                                </button>
                             </div>
                          </div>
                       ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                       <span className="text-gray-500 font-medium">Total Amount</span>
                       <span className="text-3xl font-heading font-bold text-primary">${calculateTotal()}</span>
                    </div>
                 </div>

                 {/* Student Details Form */}
                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Student Details</h2>
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                       <div className="grid md:grid-cols-2 gap-6">
                          <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                             <input 
                                required
                                type="text" 
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={formData.firstName}
                                onChange={e => setFormData({...formData, firstName: e.target.value})}
                             />
                          </div>
                          <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                             <input 
                                required
                                type="text" 
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={formData.lastName}
                                onChange={e => setFormData({...formData, lastName: e.target.value})}
                             />
                          </div>
                       </div>
                       <div className="grid md:grid-cols-2 gap-6">
                          <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                             <input 
                                required
                                type="email" 
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                             />
                          </div>
                          <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                             <input 
                                required
                                type="tel" 
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                             />
                          </div>
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Unique Student Identifier (USI) <span className="font-normal text-gray-400">(Optional)</span></label>
                          <input 
                             type="text" 
                             placeholder="Ex: 3BN88A992"
                             className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase"
                             value={formData.usi}
                             onChange={e => setFormData({...formData, usi: e.target.value})}
                          />
                          <p className="text-xs text-gray-500 mt-2">Don't have a USI? Create one at <a href="#" className="text-primary underline">usi.gov.au</a></p>
                       </div>
                    </form>
                 </div>

              </div>

              {/* Right Column: Payment & Action */}
              <div className="lg:col-span-1 space-y-8">
                 <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 sticky top-24">
                    <h2 className="text-xl font-bold text-secondary mb-6">Payment Method</h2>
                    
                    <div className="space-y-4 mb-8">
                       <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-blue-50/50 has-[:checked]:ring-1 has-[:checked]:ring-primary">
                          <input 
                             type="radio" 
                             name="payment" 
                             value="credit_card"
                             checked={formData.paymentMethod === 'credit_card'}
                             onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                             className="w-5 h-5 text-primary focus:ring-primary"
                          />
                          <div className="flex-1">
                             <span className="font-bold text-gray-800 block">Credit Card</span>
                             <span className="text-xs text-gray-500">Secure payment via Stripe</span>
                          </div>
                          <CreditCard className="text-gray-400" />
                       </label>

                       <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-blue-50/50 has-[:checked]:ring-1 has-[:checked]:ring-primary">
                          <input 
                             type="radio" 
                             name="payment" 
                             value="invoice"
                             checked={formData.paymentMethod === 'invoice'}
                             onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                             className="w-5 h-5 text-primary focus:ring-primary"
                          />
                          <div className="flex-1">
                             <span className="font-bold text-gray-800 block">Send Invoice</span>
                             <span className="text-xs text-gray-500">Net 14 days for companies</span>
                          </div>
                          <FileText className="text-gray-400" size={20} />
                       </label>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 mb-8 flex items-start gap-3 text-sm text-blue-800">
                       <ShieldCheck className="shrink-0 mt-0.5" size={18} />
                       <p>Your payment information is encrypted and secure. By enrolling, you agree to our Terms of Service.</p>
                    </div>

                    <Button 
                       type="submit" 
                       form="checkout-form"
                       className="w-full py-4 text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                    >
                       Complete Enrollment <ArrowRight size={20} className="ml-2" />
                    </Button>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

// Simple Icon component for the radio button
const FileText = ({ className, size }: { className?: string, size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);
