import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Building,
  RefreshCw,
  Trees,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { placeOrder } from '../marketplaceSlice.js';
import { landService } from '../../land/services/landService.js';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, appliedCoupon, orderPlacing } = useSelector((state) => state.marketplace);
  const { user } = useSelector((state) => state.auth);

  const [lands, setLands] = useState([]);
  const [loadingLands, setLoadingLands] = useState(true);

  const [deliveryAddress, setDeliveryAddress] = useState({
    recipientName: user?.name || 'Ramesh Patel',
    phone: user?.mobile || user?.phone || '+91 98765 43210',
    selectedLand: '',
    addressLine: 'Shree Ram Farm, Survey 402/A, Village Mogri',
    district: 'Anand',
    state: 'Gujarat',
    pincode: '388345',
  });

  const [paymentMethod, setPaymentMethod] = useState('WALLET');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch real registered land plots
  useEffect(() => {
    const loadLands = async () => {
      setLoadingLands(true);
      try {
        const res = await landService.getMyLands();
        if (res.data && res.data.length > 0) {
          setLands(res.data);
          const firstLand = res.data[0];
          setDeliveryAddress((prev) => ({
            ...prev,
            selectedLand: firstLand._id || firstLand.id,
            addressLine: firstLand.address || `${firstLand.landName}, Survey ${firstLand.surveyNumber}`,
            district: firstLand.district || 'Anand',
            state: firstLand.state || 'Gujarat',
            pincode: firstLand.pincode || '388345',
          }));
        }
      } catch (e) {
        console.warn('Failed to load farmer lands for checkout:', e);
      } finally {
        setLoadingLands(false);
      }
    };
    loadLands();
  }, []);

  const handleLandChange = (landId) => {
    const selected = lands.find((l) => (l._id || l.id) === landId);
    if (selected) {
      setDeliveryAddress((prev) => ({
        ...prev,
        selectedLand: landId,
        addressLine: selected.address || `${selected.landName}, Survey ${selected.surveyNumber}`,
        district: selected.district || 'Anand',
        state: selected.state || 'Gujarat',
        pincode: selected.pincode || '388345',
      }));
    } else {
      setDeliveryAddress((prev) => ({ ...prev, selectedLand: landId }));
    }
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
  } else if (
    appliedCoupon?.startsWith('BHUMI-') ||
    appliedCoupon?.includes('REWARD') ||
    appliedCoupon?.includes('REFERRAL')
  ) {
    couponDiscount = Math.min(320, rawSubtotal);
  }

  const deliveryFee = rawSubtotal > 1500 || rawSubtotal === 0 ? 0 : 120;
  const taxAmount = Math.round(rawSubtotal * 0.05);
  const totalPayable = Math.max(0, rawSubtotal - couponDiscount + deliveryFee + taxAmount);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) {
      setErrorMsg('Cart is empty. Please add products before checking out.');
      return;
    }

    setErrorMsg('');

    const selectedLandObj = lands.find((l) => (l._id || l.id) === deliveryAddress.selectedLand);
    const landName = selectedLandObj?.landName || 'Registered Plot';

    const orderPayload = {
      items: cart.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        category: item.category,
        price: getItemPrice(item),
        quantity: item.quantity || 1,
      })),
      deliveryAddress: {
        recipientName: deliveryAddress.recipientName,
        phone: deliveryAddress.phone,
        landId: deliveryAddress.selectedLand || undefined,
        landName,
        addressLine: deliveryAddress.addressLine,
        district: deliveryAddress.district,
        state: deliveryAddress.state,
        pincode: deliveryAddress.pincode,
      },
      paymentMethod,
      couponCode: appliedCoupon || undefined,
    };

    try {
      const result = await dispatch(placeOrder(orderPayload)).unwrap();
      const orderRef = result.orderNumber || result._id || result.id;
      navigate(`/marketplace/order-success?orderId=${orderRef}`);
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Failed to place order. Please try again.');
    }
  };

  if ((cart || []).length === 0) {
    return (
      <div className="w-full space-y-6 sm:space-y-8 pb-12">
        <PageHeader
          title="Checkout & Delivery"
          backTo="/marketplace"
          breadcrumbs={[
            { label: 'Farmer Portal', path: '/farmer/dashboard' },
            { label: 'Marketplace', path: '/marketplace' },
            { label: 'Checkout' },
          ]}
        />
        <Card className="p-12 text-center max-w-md mx-auto">
          <p className="text-base font-bold text-gray-800 mb-2">Your Cart is Empty</p>
          <p className="text-xs text-gray-500 mb-6">Add products from the marketplace before checking out.</p>
          <Button variant="primary" onClick={() => navigate('/marketplace')}>
            Explore Marketplace
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Checkout & Farm Delivery"
        subtitle="Confirm farm gate delivery address and choose sovereign payment option."
        backTo="/marketplace/cart"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Marketplace', path: '/marketplace' },
          { label: 'Cart', path: '/marketplace/cart' },
          { label: 'Checkout' },
        ]}
      />

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Form: Delivery & Payment Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Farm Delivery Address */}
          <Card className="p-6 md:p-8 space-y-6 border border-gray-200">
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

            {/* Select from registered land plots */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Trees className="w-3.5 h-3.5 text-emerald-600" /> Deliver Directly to Registered Land Plot
              </label>
              {loadingLands ? (
                <div className="text-xs text-gray-400 py-2">Loading your registered land plots...</div>
              ) : lands.length > 0 ? (
                <FormSelect
                  value={deliveryAddress.selectedLand}
                  onChange={(e) => handleLandChange(e.target.value)}
                  options={[
                    { value: '', label: '-- Select Registered Land Parcel (Optional) --' },
                    ...lands.map((l) => ({
                      value: l._id || l.id,
                      label: `${l.landName} (Survey: ${l.surveyNumber} • ${l.village}, ${l.district})`,
                    })),
                  ]}
                />
              ) : (
                <p className="text-xs text-gray-400 italic">No registered lands found. Enter physical address below.</p>
              )}
            </div>

            <FormInput
              label="Detailed Farm Address / Landmark"
              value={deliveryAddress.addressLine}
              onChange={(e) => setDeliveryAddress({ ...deliveryAddress, addressLine: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput
                label="District"
                value={deliveryAddress.district}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, district: e.target.value })}
                required
              />
              <FormInput
                label="State"
                value={deliveryAddress.state}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                required
              />
              <FormInput
                label="Pincode"
                value={deliveryAddress.pincode}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                required
              />
            </div>
          </Card>

          {/* Payment Method Selector */}
          <Card className="p-6 md:p-8 space-y-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" /> Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'WALLET',
                  title: 'Bhumicred Wallet',
                  desc: 'Instant settlement with green credits & cash balance',
                  icon: Wallet,
                },
                {
                  id: 'UPI',
                  title: 'UPI / QR Code',
                  desc: 'GPay, PhonePe, Paytm, BHIM instant transfer',
                  icon: CreditCard,
                },
                {
                  id: 'CASH_ON_DELIVERY',
                  title: 'Cash on Delivery',
                  desc: 'Pay delivery agent at farm gate upon inspection',
                  icon: Truck,
                },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-700' : 'text-gray-400'}`} />
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <h5 className="font-bold text-xs text-gray-900">{m.title}</h5>
                    <p className="text-[11px] text-gray-500 mt-1 leading-snug">{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <Card className="p-6 border border-gray-200 space-y-4">
            <h4 className="font-bold text-base text-gray-900 pb-3 border-b border-gray-100">
              Order Items ({cart.length})
            </h4>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map((item) => {
                const itemId = item._id || item.id;
                const unitPrice = getItemPrice(item);
                const qty = item.quantity || 1;

                return (
                  <div key={itemId} className="flex justify-between items-center text-xs pb-2 border-b border-gray-50">
                    <div className="pr-2">
                      <p className="font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                      <span className="text-gray-400 text-[11px]">
                        {qty} × ₹{unitPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900 shrink-0">
                      ₹{(unitPrice * qty).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{rawSubtotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount ({appliedCoupon})</span>
                  <span>-₹{couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-gray-900'}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span className="font-semibold text-gray-900">₹{taxAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
              <span className="font-bold text-gray-900 text-sm">Total Payable</span>
              <span className="font-black text-xl text-emerald-800">
                ₹{totalPayable.toLocaleString()}
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={orderPlacing}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 font-bold py-3"
            >
              {orderPlacing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Processing Order...
                </>
              ) : (
                <>
                  Confirm & Place Order <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="text-center text-[11px] text-gray-400">
              By confirming, you agree to Bhumicred Sovereign Purchase Terms.
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
