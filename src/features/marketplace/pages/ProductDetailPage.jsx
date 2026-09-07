import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MOCK_PRODUCTS } from '../../../services/mockData/marketplaceMock.js';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];

  const handleBuyNow = () => {
    navigate('/marketplace/checkout');
  };

  const handleAddToCart = () => {
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title={product.name}
        subtitle={`Supplied by ${product.seller} • ICFRE & Sovereign Certified`}
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
          <div className="h-96 rounded-3xl bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900 flex flex-col justify-between p-8 text-white shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                In Stock & Verified
              </Badge>
              <div className="flex items-center gap-1 bg-amber-400 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-slate-950" /> {product.rating} ({product.reviewsCount} reviews)
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-emerald-400 uppercase tracking-wider font-bold">
                Certified Clonal Asset
              </span>
              <h3 className="text-2xl font-bold">{product.name}</h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-600">
            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <Truck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span>{product.deliveryEstimate}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span>100% Genuine</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <RotateCcw className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span>7-Day Replacement</span>
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
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-base text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  Save ₹{(product.originalPrice - product.price).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes & doorstep delivery</p>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>

            {/* Quantity Selector */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 uppercase">Quantity (Packs)</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  Total: <strong className="text-gray-900 text-sm">₹{(product.price * quantity).toLocaleString()}</strong>
                </span>
              </div>
            </div>

            {/* Add to cart / Buy now */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-3"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </Button>
              <Button
                variant="primary"
                className="w-full flex items-center justify-center gap-2 py-3"
                onClick={handleBuyNow}
              >
                Buy Now <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {addedToast && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Added to cart successfully!</span>
              </div>
            )}
          </Card>

          {/* Technical Specifications */}
          <Card className="p-6 space-y-4">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              Technical Specifications
            </h4>
            <div className="divide-y divide-gray-100 text-xs">
              {Object.entries(product.specs || {}).map(([key, val], idx) => (
                <div key={idx} className="py-2 flex justify-between">
                  <span className="text-gray-500 capitalize">{key}:</span>
                  <span className="font-semibold text-gray-900">{val}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
