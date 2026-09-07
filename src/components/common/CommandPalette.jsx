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
  Command
} from 'lucide-react';

const SEARCHABLE_ITEMS = [
  // Farmer Lands
  { id: 'lnd_1', title: 'South Riverbed Expansion (Khasra 412/1)', subtitle: 'Navli, Anand • 12.4 Acres • Verified', category: 'Lands & GIS', path: '/farmer/lands/land_01', icon: MapPin },
  { id: 'lnd_2', title: 'North Orchard & Agroforestry (Survey 108/A)', subtitle: 'Mogri, Anand • 8.5 Acres • Verified', category: 'Lands & GIS', path: '/farmer/lands/land_02', icon: MapPin },
  { id: 'lnd_add', title: 'Add New Land Parcel (GIS Demarcation)', subtitle: 'Register a new cadastral land plot', category: 'Lands & GIS', path: '/farmer/lands/add', icon: MapPin },

  // Soil Health
  { id: 'soil_1', title: 'Soil Health Card #SHC-2026-90812', subtitle: '12-Parameter Chemical & N-P-K Nutrient Card', category: 'Soil Hub', path: '/farmer/soil/report/soil_001', icon: Sprout },
  { id: 'soil_book', title: 'Book On-Farm Soil Core Extraction', subtitle: 'Schedule certified lab sample collection', category: 'Soil Hub', path: '/farmer/soil/book', icon: Sprout },

  // Insurance
  { id: 'ins_1', title: 'Teak & Sandalwood High-Value Policy', subtitle: 'Policy #POL-TEAK-2026 • ₹4,80,000 Sum Insured', category: 'Insurance', path: '/farmer/insurance', icon: Shield },
  { id: 'ins_claim', title: 'Raise Emergency Insurance Claim', subtitle: 'Parametric & damage claim registration', category: 'Insurance', path: '/farmer/insurance/raise-claim', icon: Shield },

  // Sustainability & Carbon
  { id: 'crb_1', title: 'Carbon Yield & Monetization Ledger', subtitle: '305 Trees • 10.7 tCO2e Annual Carbon Credits', category: 'Carbon & ESG', path: '/farmer/carbon', icon: Sparkles },
  { id: 'crb_audit', title: 'Request Satellite Carbon Audit', subtitle: 'LiDAR & drone biomass audit for Verra credits', category: 'Carbon & ESG', path: '/farmer/carbon/request-audit', icon: Sparkles },

  // Marketplace & Schemes
  { id: 'mkt_1', title: 'Bio-NPK Consortium Fertilizer (5L)', subtitle: 'Organic certified soil regenerative input', category: 'Marketplace', path: '/marketplace', icon: Layers },
  { id: 'sch_1', title: 'PM-PRANAM Alternative Fertilizer Subsidy', subtitle: '50% direct subsidy grant on bio-inputs', category: 'Govt Schemes', path: '/schemes', icon: Building2 },

  // Role Dashboards
  { id: 'dash_farmer', title: 'Farmer Portal Dashboard', subtitle: 'Personal land, wallet, and insurance hub', category: 'Navigation', path: '/farmer/dashboard', icon: ArrowRight },
  { id: 'dash_gov', title: 'Government Nodal Portal', subtitle: 'Zonal land assets, district soil & campaigns', category: 'Navigation', path: '/government/dashboard', icon: Building2 },
  { id: 'dash_partner', title: 'Enterprise Partner Dashboard', subtitle: 'Field visits, lab samples & task queue', category: 'Navigation', path: '/partner/dashboard', icon: Briefcase },
  { id: 'dash_admin', title: 'Super Admin Control Center', subtitle: 'Universal approvals, finance & security audit', category: 'Navigation', path: '/admin/dashboard', icon: Shield },

  // Bhumitra AI
  { id: 'ai_page', title: 'Bhumitra AI Dedicated Assistant', subtitle: 'Multi-lingual agricultural guidance & advice', category: 'AI Assistant', path: '/bhumitra-ai', icon: Sparkles },
];

export const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredItems = SEARCHABLE_ITEMS.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleSelect = (item) => {
    onClose();
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, parcel ID, scheme name, or tool..."
            value={query}
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
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <Search className="w-8 h-8 mx-auto stroke-1 mb-2 text-neutral-300 dark:text-neutral-700" />
              <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-neutral-500 mt-1">Try searching for &quot;soil&quot;, &quot;khasra&quot;, &quot;insurance&quot;, or &quot;admin&quot;</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-900 dark:text-primary-100'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-primary-600 dark:text-primary-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span>Navigation: <strong className="text-neutral-600 dark:text-neutral-300">↑ ↓</strong></span>
            <span>Select: <strong className="text-neutral-600 dark:text-neutral-300">↵ Enter</strong></span>
          </div>
          <span>BHUMICRED Unified Command Palette</span>
        </div>
      </div>
    </div>
  );
};
