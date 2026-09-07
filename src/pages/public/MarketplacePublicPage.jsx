import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, CheckCircle2, Star, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../services/mockData/marketplaceMock.js';
import { formatCurrency } from '../../utils/formatters.js';

export const MarketplacePublicPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Verified Agri Commerce</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Agri Inputs, Saplings & Precision Tech
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Direct access to sovereign-certified agroforestry saplings, bio-organic composts, solar drip controllers, and farming tools.
        </p>
        <div className="pt-2">
          <Link to="/login?role=FARMER">
            <Button size="lg" variant="primary" icon={ArrowRight}>
              Explore Marketplace
            </Button>
          </Link>
        </div>
      </div>

      {/* Featured Products Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_PRODUCTS.map((prod) => (
          <Card key={prod.id} hoverable className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  {prod.seller}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{prod.rating}</span>
                </div>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-2 leading-snug">{prod.name}</h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">{prod.description}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-base font-black text-slate-900">{formatCurrency(prod.price)}</span>
                <span className="text-xs text-slate-400 line-through ml-2">
                  {formatCurrency(prod.originalPrice)}
                </span>
              </div>
              <Link to="/login?role=FARMER">
                <Button size="sm" variant="outline">
                  Buy Now
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
