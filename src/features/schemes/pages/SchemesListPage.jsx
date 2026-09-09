import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  RefreshCw,
  Landmark,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { fetchSchemes, applyForScheme, clearSchemeErrors } from '../schemesSlice.js';
import landService from '../../land/services/landService.js';

export const SchemesListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items: schemes, isLoading, error, successMessage } = useSelector((state) => state.schemes);
  const [lands, setLands] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [applySchemeModal, setApplySchemeModal] = useState(null);
  const [selectedLandId, setSelectedLandId] = useState('');
  const [applicantAadhaar, setApplicantAadhaar] = useState('');
  const [remarks, setRemarks] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [actionError, setActionError] = useState(null);

  const isGovernmentRole = user?.role === 'GOVERNMENT' || user?.role === 'SUPER_ADMIN';
  const backTo = isGovernmentRole ? '/government/dashboard' : '/farmer/dashboard';
  const portalLabel = isGovernmentRole ? 'Government Portal' : 'Farmer Portal';

  useEffect(() => {
    dispatch(fetchSchemes());
    if (user?.role === 'FARMER') {
      const loadUserLands = async () => {
        try {
          const res = await landService.getMyLands();
          if (res.data) {
            setLands(res.data);
            if (res.data.length > 0) {
              setSelectedLandId(res.data[0]._id || res.data[0].id);
            }
          }
        } catch (e) {
          console.warn('Failed to load farmer lands for scheme:', e);
        }
      };
      loadUserLands();
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (lands && lands.length > 0 && !selectedLandId) {
      setSelectedLandId(lands[0]._id || lands[0].id);
    }
  }, [lands, selectedLandId]);

  const filteredSchemes = (schemes || []).filter(
    (s) =>
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.authority?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApply = async (e) => {
    e.preventDefault();
    setActionError(null);
    if (!applySchemeModal) return;

    const schemeId = applySchemeModal._id || applySchemeModal.id;
    const applicationData = {
      landId: selectedLandId || undefined,
      applicantAadhaar: applicantAadhaar || undefined,
      remarks: remarks || 'Direct DBT application from farmer vault',
    };

    const actionResult = await dispatch(applyForScheme({ schemeId, applicationData }));
    if (applyForScheme.fulfilled.match(actionResult)) {
      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setApplySchemeModal(null);
        setRemarks('');
        dispatch(clearSchemeErrors());
        dispatch(fetchSchemes());
      }, 1800);
    } else {
      setActionError(actionResult.payload || 'Failed to submit scheme application');
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Government Schemes & Agricultural Subsidies"
        subtitle="Direct benefit transfers (DBT), organic farming incentives, and solar drip capital subsidies."
        backTo={backTo}
        breadcrumbs={[
          { label: portalLabel, path: backTo },
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

      {isLoading && schemes.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
          <p className="text-sm font-semibold">Loading government subsidy catalog...</p>
        </div>
      ) : filteredSchemes.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-gray-200">
          <Landmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">No schemes found matching your search</p>
        </Card>
      ) : (
        /* Schemes Grid */
        <div className="space-y-6">
          {filteredSchemes.map((scheme) => {
            const schemeId = scheme._id || scheme.id;
            const appliedCount = scheme.applications?.length || 0;

            return (
              <Card key={schemeId} className="p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-all">
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
                          {(scheme.requiredDocuments || []).map((doc, idx) => (
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
                      <span className="text-xs font-bold text-gray-900 block">{scheme.deadline || 'Ongoing Open DBT'}</span>
                      <span className="text-[11px] text-emerald-700 font-semibold block">{scheme.geography || 'All India / State'}</span>
                      {appliedCount > 0 && (
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {appliedCount} Applications Logged
                        </span>
                      )}
                    </div>

                    {user?.role === 'FARMER' ? (
                      <Button
                        variant="primary"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => {
                          setApplySchemeModal(scheme);
                          setActionError(null);
                        }}
                      >
                        Apply Directly <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => navigate('/government/campaigns')}
                      >
                        Launch Scheme Drive <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      {applySchemeModal && (
        <Modal
          isOpen={Boolean(applySchemeModal)}
          onClose={() => setApplySchemeModal(null)}
          title={`Apply for ${applySchemeModal.title}`}
        >
          <form onSubmit={handleApply} className="space-y-6 py-2">
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
                {actionError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                    {actionError}
                  </div>
                )}

                <p className="text-xs text-gray-600 leading-relaxed">
                  Your registered KYC and Land records will be transmitted directly to{' '}
                  <strong>{applySchemeModal.authority}</strong> portal.
                </p>

                {lands && lands.length > 0 ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Select Eligible Land Parcel
                    </label>
                    <select
                      value={selectedLandId}
                      onChange={(e) => setSelectedLandId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:ring-emerald-500 bg-white"
                    >
                      {lands.map((l) => (
                        <option key={l._id || l.id} value={l._id || l.id}>
                          {l.landName} (Survey #{l.surveyNumber || l.khasraNumber} • {l.area} {l.areaUnit || 'Acres'})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                    No registered land plot found. You can still apply with your verified Aadhaar KYC.
                  </div>
                )}

                <FormInput
                  label="Farmer Aadhaar Number (Optional Verification)"
                  placeholder="e.g. 5432-8765-1234"
                  value={applicantAadhaar}
                  onChange={(e) => setApplicantAadhaar(e.target.value)}
                />

                <FormTextarea
                  label="Application Notes / Purpose"
                  rows={2}
                  placeholder="e.g. Applying for Drip irrigation installation on 4.5 acre teak orchard..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-gray-800">Auto-Attached from Sovereign Vault:</span>
                  <div className="text-gray-600 space-y-0.5">
                    <div>✓ Aadhaar KYC Identity Document.pdf</div>
                    <div>✓ Revenue Record 7-12 / RoR Extract.pdf</div>
                    <div>✓ Bank Passbook DBT Verification Proof</div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3"
                  isLoading={isLoading}
                >
                  Submit Scheme Application
                </Button>
              </>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SchemesListPage;
