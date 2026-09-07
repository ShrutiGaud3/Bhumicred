import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Drawer } from '../../../components/ui/Drawer.jsx';
import { Button } from '../../../components/ui/Button.jsx';

export const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigate('/marketplace/checkout');
  };

  const handleViewCart = () => {
    onClose();
    navigate('/marketplace/cart');
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Your Farm Cart" position="right">
      <div className="flex flex-col h-full justify-between">
        {/* Items List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-base font-semibold text-gray-600">Your cart is empty</p>
              <p className="text-xs text-gray-400 mt-1">Explore seeds, bio-nutrients, and solar tools</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-gray-100 flex items-start gap-3"
              >
                <div className="w-14 h-14 rounded-lg bg-emerald-100/50 flex items-center justify-center shrink-0 text-emerald-700 font-bold text-xs">
                  {item.category.slice(4).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-xs text-gray-900 line-clamp-2">{item.name}</h5>
                  <span className="text-xs font-bold text-emerald-700 mt-1 block">
                    ₹{item.price.toLocaleString()}
                  </span>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-md bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold text-gray-900 text-base">₹{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-emerald-600">
              Free delivery on orders above ₹1,000 for registered farmers.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={handleViewCart}>
                View Cart
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex items-center justify-center gap-1"
                onClick={handleCheckout}
              >
                Checkout <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
