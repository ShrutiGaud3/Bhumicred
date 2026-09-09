import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, CheckCircle2, Star, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { marketplaceService } from '../../features/marketplace/services/marketplaceService.js';
import { formatCurrency } from '../../utils/formatters.js';

export const MarketplacePublicPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await marketplaceService.getProducts({ limit: 6 });
        if (res.data) {
          setProducts(res.data);
        }
      } catch (e) {
        console.warn('Failed to load featured products for public page:', e);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

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
      {loading ? (
        <div className="py-12 text-center text-slate-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
          <p className="text-xs">Loading marketplace catalog...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((prod) => {
            const prodId = prod._id || prod.id;
            const price = prod.pricing?.price ?? prod.price ?? 0;
            const mrp = prod.pricing?.mrp ?? prod.originalPrice ?? price;
            const sellerName = prod.seller?.name || prod.seller || 'Verified Agro Vendor';
            const rating = prod.ratings?.average || prod.rating || 4.8;

            return (
              <Card key={prodId} hoverable className="p-6 flex flex-col justify-between border border-gray-200">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 truncate max-w-[160px]">
                      {sellerName}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{rating}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-2 leading-snug line-clamp-1">{prod.name}</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{prod.description}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-slate-900">{formatCurrency(price)}</span>
                    {mrp > price && (
                      <span className="text-xs text-slate-400 line-through ml-2">
                        {formatCurrency(mrp)}
                      </span>
                    )}
                  </div>
                  <Link to="/login?role=FARMER">
                    <Button size="sm" variant="outline">
                      Buy Now
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default MarketplacePublicPage;
