import React from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Data Governance
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy & Data Sovereignty Policy</h1>
        <p className="text-xs text-slate-500">Effective Date: 21 September 2026</p>
      </div>

      <Card className="p-8 space-y-6 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">1. Data Sovereignty Principles</h2>
          <p>
            BHUMICRED prioritizes the security and confidentiality of farmer and agricultural data. Land boundaries, tree counts, soil chemistry records, and financial transaction histories are stored with end-to-end encryption.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. Jurisdiction-Scoped Access</h2>
          <p>
            Government and institutional users are strictly granted jurisdiction-bounded access to farmer records only where official administrative mandates and explicit farmer consent apply.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. Bhumitra AI Read-Only Guarantees</h2>
          <p>
            Bhumitra AI queries are read-only and contextually scoped. AI never accesses unauthorized data layers, alters account balances, or overrides human administrative decisions.
          </p>
        </section>
      </Card>
    </div>
  );
};
