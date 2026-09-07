import React from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { ShieldCheck } from 'lucide-react';

export const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Legal & Compliance
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-500">Effective Date: 21 September 2026</p>
      </div>

      <Card className="p-8 space-y-6 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">1. Platform Scope & Acceptance</h2>
          <p>
            By accessing or using the BHUMICRED platform, you agree to comply with and be bound by these Terms of Service. BHUMICRED provides digital infrastructure connecting farmers, local government bodies, and enterprise partners for GIS mapping, insurance underwriting, soil health analysis, and subsidy administration.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. Role-Based Access & Integrity</h2>
          <p>
            Users must register with accurate identity details. Any attempt to impersonate another role, falsify GIS land coordinates, or bypass backend verification controls is strictly prohibited and subject to legal action under applicable laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. Financial Transactions & Ledger Authority</h2>
          <p>
            All wallet balances, tree insurance premiums, claims, and withdrawal authorizations are server-authoritative and recorded in immutable audit ledgers.
          </p>
        </section>
      </Card>
    </div>
  );
};
