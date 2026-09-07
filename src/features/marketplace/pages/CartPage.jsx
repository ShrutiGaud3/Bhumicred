import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { MOCK_PRODUCTS } from '../../../services/mockData/marketplaceMock.js';

export const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { ...MOCK_PRODUCTS[0], quantity: 2 },
    { ...MOCK_PRODUCTS[1], quantity: 1 },
  ]);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const handleUpdateQuantity = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const couponDiscount = couponApplied ? Math.round(rawSubtotal * 0.1) : 0; // 10% coupon
  const deliveryFee = rawSubtotal > 1000 ? 0 : 150;
  const netTotal = rawSubtotal - couponDiscount + deliveryFee;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'BHUMI10' || couponCode.trim().length > 2) {
      setCouponApplied(true);
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Shopping Cart"
        subtitle={`You have ${cartItems.length} items in your order bag.`}
        backTo="/marketplace"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Marketplace', path: '/marketplace' },
          { label: 'Cart' },
        ]}
      />

      {cartItems.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-1">Your Cart is Empty</h3>
          <p className="text-sm text-gray-500 mb-6">Discover certified saplings, solar irrigation tools, and bio-nutrients.</p>
          <Button variant="primary" onClick={() => navigate('/marketplace')}>
            Explore Marketplace
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items list */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-5 flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-emerald-900 to-teal-800 text-white flex items-center justify-center shrink-0 font-bold text-xs p-2 text-center">
                  {item.category.slice(4).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] text-emerald-700 font-semibold">{item.seller}</span>
                      <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white p-0.5">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1.5 hover:bg-gray-100 text-gray-600"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-100 text-gray-600"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 block">
                        ₹{item.price.toLocaleString()} each
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate('/marketplace')}
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Button>
          </div>

          {/* Price Summary & Promo Code */}
          <div className="space-y-6">
            {/* Promo Code Card */}
            <Card className="p-5">
              <form onSubmit={handleApplyCoupon} className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Have a Promo / Subsidy Voucher?
                </label>
                <div className="flex gap-2">
                  <FormInput
                    placeholder="e.g. BHUMI10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="text-xs uppercase"
                  />
                  <Button type="submit" variant="outline" size="sm" className="shrink-0">
                    Apply
                  </Button>
                </div>
                {couponApplied && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Coupon BHUMI10 applied (10% discount)</span>
                  </div>
                )}
              </form>
            </Card>

            {/* Bill Details */}
            <Card className="p-6 space-y-4 bg-white">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                Order Bill Summary
              </h4>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Items Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{rawSubtotal.toLocaleString()}</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between pb-2 border-b border-gray-100 text-emerald-700">
                    <span>Voucher Discount</span>
                    <span className="font-bold">- ₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Doorstep Delivery</span>
                  <span className="font-semibold text-emerald-600">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between pt-2 text-base font-black">
                  <span>Grand Total</span>
                  <span className="text-emerald-700">₹{netTotal.toLocaleString()}</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full flex items-center justify-center gap-2 py-3 mt-4 text-base"
                onClick={() => navigate('/marketplace/checkout')}
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
