import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  MapPin,
  Shield,
  Sprout,
  DollarSign,
  FileText,
  Building2,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  LifeBuoy,
  User,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import { adminService } from '../../features/admin/services/adminService.js';

const CORE_SHORTCUTS = [
  // Farmer Lands
  { id: 'lnd_1', title: 'South Riverbed Expansion (Khasra 412/1)', subtitle: 'Navli, Anand • 12.4 Acres • Verified', category: 'Lands & GIS', path: '/farmer/lands', icon: MapPin },
  { id: 'lnd_add', title: 'Add New Land Parcel (GIS Demarcation)', subtitle: 'Register a new cadastral land plot', category: 'Lands & GIS', path: '/farmer/lands/add', icon: MapPin },

  // Soil Health
  { id: 'soil_1', title: 'Soil Health Card & Nutrient Ledger', subtitle: '12-Parameter Chemical & N-P-K Nutrient Card', category: 'Soil Hub', path: '/farmer/soil', icon: Sprout },
  { id: 'soil_book', title: 'Book On-Farm Soil Core Extraction', subtitle: 'Schedule certified lab sample collection', category: 'Soil Hub', path: '/farmer/soil/book', icon: Sprout },

  // Insurance & Wallet
  { id: 'ins_1', title: 'Teak & Sandalwood High-Value Policy', subtitle: 'Parametric tree insurance coverage', category: 'Insurance', path: '/farmer/insurance', icon: Shield },
  { id: 'wal_1', title: 'BHUMICRED Smart Wallet & Treasury', subtitle: 'Direct Benefit Transfer payouts & rewards', category: 'Finance', path: '/wallet', icon: DollarSign },

  // Sustainability & Carbon
  { id: 'crb_1', title: 'Carbon Yield & Monetization Ledger', subtitle: 'Satellite MRV & verified green credits', category: 'Carbon & ESG', path: '/carbon', icon: Sparkles },

  // Grievances & Support
  { id: 'sup_1', title: 'Grievance Redressal & Support Desk', subtitle: 'Toll-free 1800-BHUMI-CRED assistance', category: 'Support Desk', path: '/support', icon: LifeBuoy },

  // Role Dashboards
  { id: 'dash_farmer', title: 'Farmer Portal Dashboard', subtitle: 'Personal land, wallet, and insurance hub', category: 'Navigation', path: '/farmer/dashboard', icon: ArrowRight },
  { id: 'dash_gov', title: 'Government Nodal Portal', subtitle: 'Zonal land assets, district soil & campaigns', category: 'Navigation', path: '/government/dashboard', icon: Building2 },
  { id: 'dash_partner', title: 'Enterprise Partner Dashboard', subtitle: 'Field visits, lab samples & task queue', category: 'Navigation', path: '/partner/dashboard', icon: Briefcase },
  { id: 'dash_admin', title: 'Super Admin Control Center', subtitle: 'Universal approvals, finance & security audit', category: 'Navigation', path: '/admin/dashboard', icon: Shield },
  { id: 'dash_audit', title: 'System Security & Immutable Audit Logs', subtitle: 'Cryptographic mutation trails & access logs', category: 'Navigation', path: '/admin/audit', icon: FileText },
];

const getIconFromType = (iconType, fallbackIcon) => {
  switch (iconType) {
    case 'MAP_PIN':
      return MapPin;
    case 'SPROUT':
      return Sprout;
    case 'SHOPPING_BAG':
      return ShoppingBag;
    case 'LIFE_BUOY':
      return LifeBuoy;
    case 'USER':
      return User;
    case 'SHIELD':
      return Shield;
    case 'SPARKLES':
      return Sparkles;
    default:
      return fallbackIcon || Search;
  }
};

export const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [apiResults, setApiResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live Backend Search Debounce
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setApiResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await adminService.globalSearch(query);
        setApiResults(results);
      } catch (err) {
        console.warn('Global search backend fallback:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
      setApiResults([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Combine live API results with matching core shortcuts
  const localFiltered = CORE_SHORTCUTS.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const combinedResults = [
    ...apiResults.map((r) => ({
      ...r,
      icon: getIconFromType(r.iconType, Search),
    })),
    ...localFiltered.filter((l) => !apiResults.some((a) => a.path === l.path)),
  ];

  const handleSelect = (item) => {
    onClose();
    if (item.path) {
      navigate(item.path);
    }
  };

  const handleKeyDownList = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + combinedResults.length) % Math.max(1, combinedResults.length));
    } else if (e.key === 'Enter' && combinedResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(combinedResults[selectedIndex]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          {loading ? (
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
          ) : (
            <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search parcels, Khasra numbers, claims, farmers, reports, or tools..."
            value={query}
            onKeyDown={handleKeyDownList}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm sm:text-base text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[11px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {combinedResults.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <Search className="w-8 h-8 mx-auto stroke-1 mb-2 text-neutral-300 dark:text-neutral-700" />
              <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-neutral-500 mt-1">
                Try searching for &quot;412/1&quot;, &quot;Ramesh&quot;, &quot;soil&quot;, &quot;wallet&quot;, or &quot;audit&quot;
              </p>
            </div>
          ) : (
            combinedResults.map((item, idx) => {
              const Icon = item.icon || Search;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id || idx}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-200/60 dark:border-emerald-800">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span>
              Navigation: <strong className="text-neutral-600 dark:text-neutral-300">↑ ↓</strong>
            </span>
            <span>
              Select: <strong className="text-neutral-600 dark:text-neutral-300">↵ Enter</strong>
            </span>
          </div>
          <span>BHUMICRED Universal Cross-Collection Search</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
