import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag,
  Star,
  Plus,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Package,
  Leaf,
  Droplets,
  Trees,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { CartDrawer } from '../components/CartDrawer.jsx';
import {
  fetchProducts,
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from '../marketplaceSlice.js';

const CATEGORY_TABS = [
  { id: 'ALL', label: 'All Products' },
  { id: 'SAPLINGS', label: 'Agroforestry Saplings' },
  { id: 'BIO_FERTILIZERS', label: 'Bio-Fertilizers & Nutrients' },
  { id: 'SOLAR_IRRIGATION', label: 'Smart Drip & Solar' },
  { id: 'ORGANIC_PESTICIDES', label: 'Organic Pest Control' },
  { id: 'SEEDS', label: 'Certified Seeds' },
  { id: 'SOIL_AMENDMENTS', label: 'Soil Amendments' },
];

export const MarketplacePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, cart, loading } = useSelector((state) => state.marketplace);

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = (products || []).filter((prod) => {
    const matchesCat = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        ...product,
        quantity: 1,
      })
    );
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, newQty) => {
    dispatch(updateCartQuantity({ id, quantity: newQty }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const totalCartCount = (cart || []).reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Agri Inputs & Machinery Marketplace"
        subtitle="Certified high-yield seeds, bio-nutrients, solar drip automation, and sovereign saplings."
        backTo="/farmer/dashboard"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Marketplace' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/marketplace/orders')}
            >
              My Orders
            </Button>
            <Button
              variant="primary"
              className="flex items-center gap-2 relative bg-emerald-700 hover:bg-emerald-800"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </Button>
          </div>
        }
      />

      {/* Category Pills & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const count =
              tab.id === 'ALL'
                ? products.length
                : products.filter((p) => p.category === tab.id).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === tab.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      selectedCategory === tab.id
                        ? 'bg-emerald-900/50 text-emerald-100'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="w-full md:w-72">
          <SearchInput
            placeholder="Search inputs, saplings, nutrients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && products.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
          <p className="text-sm font-semibold">Loading marketplace catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-gray-200">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No products found in this category</h3>
          <p className="text-xs text-gray-500 mt-1">Try selecting "All Products" or changing your search term.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const prodId = product._id || product.id;
            const price = product.pricing?.price ?? product.price ?? 0;
            const mrp = product.pricing?.mrp ?? product.originalPrice ?? price;
            const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
            const sellerName = product.seller?.name || product.seller || 'Verified Agro Vendor';
            const rating = product.ratings?.average || product.rating || 4.8;
            const specsObj = product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs || {};

            return (
              <Card
                key={prodId}
                className="flex flex-col justify-between overflow-hidden group hover:shadow-xl transition-all border border-gray-200"
              >
                <div>
                  {/* Product Visual Banner */}
                  <div className="h-44 bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900 relative p-4 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {specsObj.certification || product.categoryLabel || 'ICFRE Certified'}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full shadow-sm">
                        <Star className="w-3 h-3 fill-slate-950" /> {rating}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-emerald-300 font-medium block truncate">{sellerName}</span>
                      <h4 className="text-base font-bold text-white line-clamp-1 group-hover:text-emerald-200 transition-colors">
                        {product.name}
                      </h4>
                    </div>
                  </div>

                  {/* Specs & Description */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Specs Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Object.entries(specsObj).slice(0, 2).map(([key, val], idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100 font-medium"
                        >
                          {key}: {val}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="p-5 pt-0">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-black text-gray-900">
                      ₹{price.toLocaleString()}
                    </span>
                    {mrp > price && (
                      <>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{mrp.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          {discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => navigate(`/marketplace/product/${prodId}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full flex items-center justify-center gap-1 text-xs bg-emerald-700 hover:bg-emerald-800"
                      onClick={() => handleAddToCart(product)}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default MarketplacePage;
