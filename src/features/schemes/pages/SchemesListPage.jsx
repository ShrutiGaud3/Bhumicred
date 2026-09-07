import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Calendar,
  Building,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { MOCK_SCHEMES } from '../../../services/mockData/schemesMock.js';
import { MOCK_LANDS } from '../../../services/mockData/landsMock.js';

export const SchemesListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [applySchemeModal, setApplySchemeModal] = useState(null);
  const [selectedLandId, setSelectedLandId] = useState(MOCK_LANDS[0].id);
  const [applySuccess, setApplySuccess] = useState(false);

  const filteredSchemes = MOCK_SCHEMES.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApply = () => {
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setApplySchemeModal(null);
    }, 1800);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Government Schemes & Agricultural Subsidies"
        subtitle="Direct benefit transfers, organic farming incentives, and solar drip capital subsidies."
        backTo="/farmer/dashboard"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Government Schemes' },
        ]}
      />

      {/* Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-900">
          Available Schemes ({filteredSchemes.length})
        </h3>
        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Search schemes or subsidies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="space-y-6">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} className="p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <Badge variant="success">{scheme.category}</Badge>
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-emerald-600" /> {scheme.authority}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900">{scheme.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{scheme.description}</p>

                {/* Benefits Pill */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                  <strong>Direct Benefit:</strong> {scheme.benefits}
                </div>

                {/* Eligibility & Documents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-gray-600">
                  <div>
                    <span className="font-bold text-gray-800 block mb-1">Eligibility Criteria:</span>
                    <p>{scheme.eligibility}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block mb-1">Required Documents:</span>
                    <div className="flex flex-wrap gap-1">
                      {scheme.requiredDocuments.map((doc, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Column */}
              <div className="lg:w-56 shrink-0 flex flex-col justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                <div className="text-left lg:text-right space-y-1 mb-4">
                  <span className="text-xs text-gray-500 block">Application Deadline</span>
                  <span className="text-xs font-bold text-gray-900 block">{scheme.deadline}</span>
                  <span className="text-[11px] text-emerald-700 font-semibold block">{scheme.geography}</span>
                </div>

                <Button
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setApplySchemeModal(scheme)}
                >
                  Apply Directly <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Apply Modal */}
      {applySchemeModal && (
        <Modal
          isOpen={Boolean(applySchemeModal)}
          onClose={() => setApplySchemeModal(null)}
          title={`Apply for ${applySchemeModal.title}`}
        >
          <div className="space-y-6 py-2">
            {applySuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Application Submitted!</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Attached 7/12 land extract and Aadhaar KYC from your BHUMICRED Vault.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your registered KYC and Land records will be transmitted directly to{' '}
                  <strong>{applySchemeModal.authority}</strong> portal.
                </p>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Select Eligible Land Parcel
                  </label>
                  <select
                    value={selectedLandId}
                    onChange={(e) => setSelectedLandId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:ring-emerald-500"
                  >
                    {MOCK_LANDS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.landName} (Survey: ${l.surveyNumber} • {l.area} {l.areaUnit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-gray-800">Auto-Attached from Vault:</span>
                  <div className="text-gray-600 space-y-0.5">
                    <div>✓ Aadhaar KYC Identity Document.pdf</div>
                    <div>✓ Survey 402/A Revenue Record 7-12 Extract.pdf</div>
                    <div>✓ Bank Passbook Verification Proof</div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full py-3"
                  onClick={handleApply}
                >
                  Submit Scheme Application
                </Button>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
