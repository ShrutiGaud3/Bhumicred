import React, { useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How do I register my land on BHUMICRED?',
      a: 'Farmers can navigate to the "My Land" section and click "Add Land". The step-by-step flow guides you through beneficiary selection, entering Khasra/survey details, uploading documents, drawing the GIS polygon boundary, and submitting for BHUMICRED administrative verification.',
    },
    {
      q: 'What types of tree insurance are supported?',
      a: 'BHUMICRED supports single trees, multiple tree batches, and commercial plantations/farms. Species such as Teak, Sandalwood, Mahogany, Fruit Orchards, and Bamboo are supported with automated premium calculation and evidence-backed claim processing.',
    },
    {
      q: 'How does government onboarding work?',
      a: 'Government institutions (Gram Panchayats, Nagar Palikas, Nagar Nigams, Vidhan Sabhas) select their institution type, upload official authorization letters and jurisdiction boundaries. Once verified by BHUMICRED Super Admin, the local portal activates.',
    },
    {
      q: 'What role does Bhumitra AI play?',
      a: 'Bhumitra AI provides contextual guidance on soil parameters, tree protection tips, and government scheme eligibility. In accordance with platform integrity rules, AI provides read-only informational assistance and cannot alter wallet balances or approve applications.',
    },
    {
      q: 'How are wallet earnings and rewards paid out?',
      a: 'All balances are server-authoritative and recorded in an immutable ledger. When you initiate a withdrawal, the request undergoes automated security checks and finance desk review before payout dispatch.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">Help & Support Knowledgebase</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <Card key={idx} className="overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{faq.q}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openIndex === idx ? 'rotate-180 text-emerald-600' : ''
                }`}
              />
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                {faq.a}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
