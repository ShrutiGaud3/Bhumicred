import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  X,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import {
  removeFromCart,
  updateCartQuantity,
  applyCoupon,
  removeCoupon,
} from '../marketplaceSlice.js';

export const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, appliedCoupon } = useSelector((state) => state.marketplace);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleUpdateQuantity = (id, newQty) => {
    dispatch(updateCartQuantity({ id, quantity: newQty }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const getItemPrice = (item) => item.pricing?.price ?? item.price ?? 0;
  const rawSubtotal = (cart || []).reduce((acc, item) => acc + getItemPrice(item) * (item.quantity || 1), 0);

  let couponDiscount = 0;
  if (appliedCoupon === 'BHUMI10') {
    couponDiscount = Math.round(rawSubtotal * 0.1);
  } else if (appliedCoupon === 'KISAN100') {
    couponDiscount = Math.min(100, rawSubtotal);
  } else if (appliedCoupon === 'HARVEST15') {
    couponDiscount = Math.round(rawSubtotal * 0.15);
  }

  const deliveryFee = rawSubtotal > 1500 || rawSubtotal === 0 ? 0 : 120;
  const taxAmount = Math.round(rawSubtotal * 0.05);
  const netTotal = Math.max(0, rawSubtotal - couponDiscount + deliveryFee + taxAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (code === 'BHUMI10' || code === 'KISAN100' || code === 'HARVEST15') {
      dispatch(applyCoupon(code));
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try BHUMI10 or KISAN100');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Shopping Cart"
        subtitle={`You have ${(cart || []).length} unique items in your order bag.`}
        backTo="/marketplace"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Marketplace', path: '/marketplace' },
          { label: 'Cart' },
        ]}
      />

      {(cart || []).length === 0 ? (
        <Card className="p-16 text-center border-dashed border-2 border-gray-200">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-1">Your Cart is Empty</h3>
          <p className="text-xs text-gray-500 mb-6">Discover certified saplings, solar irrigation tools, and bio-nutrients.</p>
          <Button variant="primary" className="bg-emerald-700 hover:bg-emerald-800" onClick={() => navigate('/marketplace')}>
            Explore Marketplace
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items list */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const itemId = item._id || item.id;
              const unitPrice = getItemPrice(item);
              const qty = item.quantity || 1;
              const sellerName = item.seller?.name || item.seller || 'Verified Vendor';
              const catName = (item.category || 'AGRI').replace(/^(CAT_|CATEGORY_)/i, '').replace(/_/g, ' ');

              return (
                <Card key={itemId} className="p-5 flex items-start gap-4 border border-gray-200 hover:shadow-md transition-all">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-emerald-950 to-teal-800 text-white flex items-center justify-center shrink-0 font-bold text-[10px] p-2 text-center uppercase">
                    {catName.slice(0, 10)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] text-emerald-700 font-semibold">{sellerName}</span>
                        <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(itemId)}
                        className="text-gray-400 hover:text-rose-600 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white p-0.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(itemId, Math.max(1, qty - 1))}
                          className="p-1.5 hover:bg-gray-100 text-gray-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-900">{qty}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(itemId, qty + 1)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-gray-900">
                          ₹{(unitPrice * qty).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 block">
                          ₹{unitPrice.toLocaleString()} each
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

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
            <Card className="p-5 border border-gray-200">
              <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" /> Apply Promo Code
              </h4>

              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Coupon "{appliedCoupon}" Applied</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-gray-400 hover:text-rose-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <FormInput
                      placeholder="e.g. BHUMI10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="text-xs"
                    />
                    <Button type="submit" variant="outline" size="sm" className="shrink-0">
                      Apply
                    </Button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>}
                  <p className="text-[11px] text-gray-400">Available: BHUMI10 (10% off), KISAN100 (₹100 off)</p>
                </form>
              )}
            </Card>

            {/* Price Breakdown */}
            <Card className="p-6 border border-gray-200 space-y-4">
              <h4 className="font-bold text-base text-gray-900 pb-3 border-b border-gray-100">
                Order Price Breakdown
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{rawSubtotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Farm-Gate Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-gray-900'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Estimated GST (5%)</span>
                  <span className="font-semibold text-gray-900">₹{taxAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="font-bold text-gray-900 text-sm">Total Payable</span>
                <span className="font-black text-xl text-emerald-800">
                  ₹{netTotal.toLocaleString()}
                </span>
              </div>

              <Button
                variant="primary"
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800"
                onClick={() => navigate('/marketplace/checkout')}
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sovereign Secure Checkout</span>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
