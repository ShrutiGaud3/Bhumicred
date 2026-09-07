import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-sm">
                BC
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                BHUMI<span className="text-emerald-400">CRED</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect. Grow. Sustain. The unified digital platform empowering farmers, local governance, and enterprise partners across sustainable agriculture, tree insurance, GIS land verification, and green credits.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Sovereign Infrastructure</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/role-select" className="hover:text-emerald-400 transition-colors">
                  Farmer Portal
                </Link>
              </li>
              <li>
                <Link to="/role-select" className="hover:text-emerald-400 transition-colors">
                  Government Portal
                </Link>
              </li>
              <li>
                <Link to="/role-select" className="hover:text-emerald-400 transition-colors">
                  Enterprise Partner Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Super Admin Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Agriculture Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/solutions" className="hover:text-emerald-400 transition-colors">
                  GIS Land Mapping
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-emerald-400 transition-colors">
                  Tree & Plantation Insurance
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-emerald-400 transition-colors">
                  Soil Testing & Lab Grid
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-emerald-400 transition-colors">
                  Carbon & Green Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About BHUMICRED
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-emerald-400 transition-colors">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact Grievance Officer
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Security & Terms</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BHUMICRED Platforms. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> for sovereign agriculture & sustainability.
          </p>
        </div>
      </div>
    </footer>
  );
};
