import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Filter,
  Star,
  Plus,
  ArrowRight,
  Sparkles,
  Leaf,
  Droplets,
  Trees,
  Wrench,
  Sprout,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { CartDrawer } from '../components/CartDrawer.jsx';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../../services/mockData/marketplaceMock.js';

export const MarketplacePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      ...MOCK_PRODUCTS[0],
      quantity: 1,
    },
  ]);

  const filteredProducts = MOCK_PRODUCTS.filter((prod) => {
    const matchesCat = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.seller.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
              className="flex items-center gap-2 relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full">
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
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Products ({MOCK_PRODUCTS.length})
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72">
          <SearchInput
            placeholder="Search products or sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="flex flex-col justify-between overflow-hidden group hover:shadow-xl transition-all border border-gray-200"
          >
            <div>
              {/* Product Visual Banner */}
              <div className="h-44 bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900 relative p-4 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full uppercase">
                    {product.specs?.certification || 'Direct Farm Input'}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-400 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-slate-950" /> {product.rating}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-emerald-300 block">{product.seller}</span>
                  <h4 className="text-base font-bold text-white line-clamp-1">{product.name}</h4>
                </div>
              </div>

              {/* Specs & Description */}
              <div className="p-5 space-y-3">
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Specs Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {Object.entries(product.specs || {}).slice(0, 2).map(([key, val], idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100"
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
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => navigate(`/marketplace/product/${product.id}`)}
                >
                  View Details
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full flex items-center justify-center gap-1 text-xs"
                  onClick={() => handleAddToCart(product)}
                >
                  <Plus className="w-3.5 h-3.5" /> Add to Cart
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};
