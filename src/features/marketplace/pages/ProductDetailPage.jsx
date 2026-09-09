import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Award,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { fetchProductById, addToCart } from '../marketplaceSlice.js';
import { marketplaceService } from '../services/marketplaceService.js';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await marketplaceService.getProductById(id);
        if (res.data) {
          setProduct(res.data);
        }
      } catch (e) {
        console.warn('Failed to load product details:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
        <p className="text-sm font-semibold">Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <Card className="p-12 text-center max-w-lg mx-auto my-12">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Product Not Found</h3>
        <p className="text-xs text-gray-500 mb-6">The requested product listing could not be located in the catalog.</p>
        <Button variant="primary" onClick={() => navigate('/marketplace')}>
          Back to Marketplace
        </Button>
      </Card>
    );
  }

  const price = product.pricing?.price ?? product.price ?? 0;
  const mrp = product.pricing?.mrp ?? product.originalPrice ?? price;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const sellerName = product.seller?.name || product.seller || 'Verified Agro Vendor';
  const rating = product.ratings?.average || product.rating || 4.8;
  const reviewsCount = product.ratings?.count || product.reviewsCount || 42;
  const specsObj = product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs || {};
  const deliveryEstimate = product.deliveryEstimate || '3-5 Business Days';

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity,
      })
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    dispatch(
      addToCart({
        ...product,
        quantity,
      })
    );
    navigate('/marketplace/checkout');
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title={product.name}
        subtitle={`Supplied by ${sellerName} • Sovereign Certified Agri Asset`}
        backTo="/marketplace"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Marketplace', path: '/marketplace' },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Product Visual Showcase */}
        <div className="space-y-4">
          <div className="h-96 rounded-3xl bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900 flex flex-col justify-between p-8 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                {product.status === 'ACTIVE' ? 'In Stock & Verified' : product.status}
              </Badge>
              <div className="flex items-center gap-1 bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full shadow-sm">
                <Star className="w-3.5 h-3.5 fill-slate-950" /> {rating} ({reviewsCount} reviews)
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-emerald-400 uppercase tracking-wider font-bold">
                {specsObj.certification || product.categoryLabel || 'Sovereign Certified'}
              </span>
              <h3 className="text-2xl font-bold">{product.name}</h3>
              <p className="text-xs text-gray-300 font-mono">SKU: {product.sku || 'AGR-INP-001'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-600">
            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <Truck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="font-semibold">{deliveryEstimate}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="font-semibold">100% Genuine</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <RotateCcw className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="font-semibold">7-Day Replacement</span>
            </div>
          </div>
        </div>

        {/* Product Order Form & Specs */}
        <div className="space-y-6">
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <span className="text-xs text-gray-400 block mb-1">Official Price</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-gray-900">
                  ₹{price.toLocaleString()}
                </span>
                {mrp > price && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      ₹{mrp.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                      {discount}% SAVINGS
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes & farm-gate logistics insurance</p>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Product Overview</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Benefits if present */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Key Benefits</h4>
                <ul className="space-y-1">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="text-xs text-gray-700 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications Grid */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Technical Specifications</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(specsObj).map(([key, val], idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg">
                    <span className="text-gray-400 block capitalize">{key}</span>
                    <span className="font-semibold text-gray-800">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Order Buttons */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 text-gray-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 text-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {addedToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Added {quantity} item(s) to your cart!</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </Button>
                <Button
                  variant="primary"
                  className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800"
                  onClick={handleBuyNow}
                >
                  Buy Now <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
