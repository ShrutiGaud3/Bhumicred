import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Building,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MOCK_LANDS } from '../../../services/mockData/landsMock.js';
import { MOCK_PRODUCTS } from '../../../services/mockData/marketplaceMock.js';

export const CheckoutPage = () => {
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState({
    recipientName: 'Ramesh Patel',
    phone: '+91 98765 43210',
    selectedLand: MOCK_LANDS[0].id,
    addressLine: 'Shree Ram Farm, Survey 402/A, Village Mogri',
    district: 'Anand',
    state: 'Gujarat',
    pincode: '388345',
  });

  const [paymentMethod, setPaymentMethod] = useState('WALLET');
  const [placingOrder, setPlacingOrder] = useState(false);

  const orderItems = [
    { ...MOCK_PRODUCTS[0], quantity: 2 },
    { ...MOCK_PRODUCTS[1], quantity: 1 },
  ];

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 0; // Free
  const totalPayable = subtotal + deliveryFee;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setPlacingOrder(true);
    setTimeout(() => {
      navigate('/marketplace/order-success?orderId=ORD-2026-8819');
    }, 1200);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Checkout & Delivery"
        subtitle="Confirm farm delivery address and choose payment option."
        backTo="/marketplace/cart"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Marketplace', path: '/marketplace' },
          { label: 'Cart', path: '/marketplace/cart' },
          { label: 'Checkout' },
        ]}
      />

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Form: Delivery & Payment Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Farm Delivery Address */}
          <Card className="p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" /> Farm Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Recipient Name"
                value={deliveryAddress.recipientName}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, recipientName: e.target.value })}
                required
              />
              <FormInput
                label="Contact Phone"
                value={deliveryAddress.phone}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                required
              />
            </div>

            <FormSelect
              label="Deliver Directly to Registered Land Plot"
              value={deliveryAddress.selectedLand}
              onChange={(e) => setDeliveryAddress({ ...deliveryAddress, selectedLand: e.target.value })}
              options={MOCK_LANDS.map((l) => ({
                value: l.id,
                label: `${l.landName} (Survey: ${l.surveyNumber} • ${l.address})`,
              }))}
            />

            <FormTextarea
              label="Detailed Road / Landmark Directions"
              rows={2}
              value={deliveryAddress.addressLine}
              onChange={(e) => setDeliveryAddress({ ...deliveryAddress, addressLine: e.target.value })}
              required
            />
          </Card>

          {/* Payment Method Selector */}
          <Card className="p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" /> Payment Method
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: 'WALLET',
                  title: 'BHUMICRED Farmer Wallet (Balance: ₹8,450)',
                  desc: 'Instant 1-click settlement from earnings & rewards.',
                  icon: Wallet,
                },
                {
                  id: 'UPI',
                  title: 'Instant UPI / QR (GPay, PhonePe, Paytm)',
                  desc: 'Zero payment processing charges.',
                  icon: CreditCard,
                },
                {
                  id: 'KCC',
                  title: 'Kisan Credit Card / Direct Agri NetBanking',
                  desc: 'Low-interest short-term seasonal credit facility.',
                  icon: Building,
                },
                {
                  id: 'COD',
                  title: 'Cash on Farm Delivery (Pay on Inspection)',
                  desc: 'Pay cash to delivery logistics executive.',
                  icon: Truck,
                },
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/10'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={isSelected}
                      onChange={() => setPaymentMethod(method.id)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-emerald-700" />
                        <span className="font-bold text-sm text-gray-900">{method.title}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{method.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Sticky Order Summary */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 bg-white sticky top-6">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              Order Summary ({orderItems.length} items)
            </h4>

            <div className="divide-y divide-gray-100 text-xs max-h-56 overflow-y-auto">
              {orderItems.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between gap-2">
                  <div>
                    <span className="font-bold text-gray-900 block truncate max-w-[180px]">
                      {item.name}
                    </span>
                    <span className="text-gray-500">Qty: {item.quantity} × ₹{item.price}</span>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Items Total:</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery:</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 text-base font-black">
                <span>Total Amount:</span>
                <span className="text-emerald-700">₹{totalPayable.toLocaleString()}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={placingOrder}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-4 text-base"
            >
              {placingOrder ? 'Confirming Order...' : `Place Order (₹${totalPayable.toLocaleString()})`}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
};
