import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Trees,
  TestTube,
  ShieldCheck,
  FileText,
  Calendar,
  Layers,
  ArrowRight,
  Download,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MapPlaceholder } from '../../../components/ui/MapPlaceholder.jsx';
import { MOCK_LANDS } from '../../../services/mockData/landsMock.js';
import { MOCK_POLICIES } from '../../../services/mockData/insuranceMock.js';
import { MOCK_SOIL_REQUESTS } from '../../../services/mockData/soilMock.js';
import { LandDeedModal } from '../components/LandDeedModal.jsx';

export const LandDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeedModal, setShowDeedModal] = useState(false);

  const land = MOCK_LANDS.find((l) => l.id === id) || MOCK_LANDS[0];
  const linkedPolicy = MOCK_POLICIES.find((p) => p.landId === land.id);
  const linkedSoil = MOCK_SOIL_REQUESTS.find((s) => s.landId === land.id);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title={land.landName}
        subtitle={`Survey No: ${land.surveyNumber} • Khasra: ${land.khasraNumber} • ${land.address}`}
        backTo="/farmer/lands"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'My Lands', path: '/farmer/lands' },
          { label: land.landName },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={land.status} />
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowDeedModal(true)}
            >
              <Download className="w-4 h-4" /> Official Cadastral Deed
            </Button>
          </div>
        }
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4 text-emerald-600" /> Total Area
          </div>
          <p className="text-2xl font-bold text-gray-900">{land.area} <span className="text-sm font-medium text-gray-500">{land.areaUnit}</span></p>
          <span className="text-xs text-gray-500 mt-1 block">{land.ownershipType}</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <Trees className="w-4 h-4 text-emerald-600" /> Tree Assets
          </div>
          <p className="text-2xl font-bold text-gray-900">{land.treeCount} <span className="text-sm font-medium text-gray-500">Trees</span></p>
          <span className="text-xs text-emerald-600 font-medium mt-1 block">
            {land.treesInsured ? '✓ Insured & Tracked' : 'Uninsured'}
          </span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <TestTube className="w-4 h-4 text-emerald-600" /> Soil Status
          </div>
          <p className="text-lg font-bold text-gray-900">
            {land.soilReportStatus === 'REPORT_READY' ? 'Optimal (7.2 pH)' : 'Test Needed'}
          </p>
          <span className="text-xs text-gray-500 mt-1 block">{land.soilType}</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Active Policy
          </div>
          <p className="text-lg font-bold text-emerald-700">
            {linkedPolicy ? `₹${(linkedPolicy.sumInsured / 100000).toFixed(1)}L Cover` : 'No Policy'}
          </p>
          <span className="text-xs text-gray-500 mt-1 block">
            {linkedPolicy ? linkedPolicy.policyNumber : 'Eligible for 40% rebate'}
          </span>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'overview', label: 'GIS & Boundaries' },
          { id: 'agronomy', label: 'Agronomy & Crops' },
          { id: 'insurance', label: 'Insurance & Claims' },
          { id: 'soil', label: 'Soil Health Card' },
          { id: 'documents', label: 'Documents & Title' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">GIS Satellite Land Boundary</h3>
                  <p className="text-xs text-gray-500">Verified cadastral vertex polygon overlay</p>
                </div>
                <Badge variant="success">Polygon Verified</Badge>
              </div>

              <MapPlaceholder
                mode="POLYGON"
                polygonCoords={land.coordinates || []}
                height="400px"
              />

              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> GPS Perimeter Locked
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Geo-tag Accuracy: ±0.8m
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Last Drone Survey: 18 Aug 2026
                </span>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Land Specifications</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Classification</span>
                  <span className="font-semibold text-gray-900">{land.landType}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Survey Number</span>
                  <span className="font-semibold text-gray-900">{land.surveyNumber}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Khasra / Khata</span>
                  <span className="font-semibold text-gray-900">{land.khasraNumber}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Irrigation Source</span>
                  <span className="font-semibold text-gray-900">{land.irrigationSource}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Registration Date</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(land.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Revenue Office</span>
                  <span className="font-semibold text-gray-900">Anand Taluka Seva Sadan</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-0">
              <Sparkles className="w-6 h-6 text-emerald-400 mb-2" />
              <h4 className="text-base font-bold mb-1">Carbon & Tree Monetization</h4>
              <p className="text-xs text-emerald-200 mb-4">
                This parcel qualifies for carbon credit revenue pooling under the Mogri Agroforestry Project.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                onClick={() => navigate('/farmer/carbon')}
              >
                View Carbon Opportunities
              </Button>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'agronomy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Trees className="w-5 h-5 text-emerald-600" /> Standing Crops & Trees
            </h3>
            <div className="flex flex-wrap gap-2">
              {land.primaryCrops.map((crop, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-sm font-semibold border border-emerald-200"
                >
                  {crop}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Tree Biomass:</span>
                <span className="font-semibold text-gray-900">14.2 Metric Tonnes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Annual Carbon Absorption:</span>
                <span className="font-semibold text-emerald-600">~2.8 tCO2e / yr</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TestTube className="w-5 h-5 text-emerald-600" /> Soil Profile Summary
            </h3>
            <p className="text-sm text-gray-600">
              Classified as <strong className="text-gray-900">{land.soilType}</strong>. Soil moisture and nitrogen
              levels are monitored through regional IoT probes.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate('/farmer/soil/book')}
            >
              Book New Soil Lab Test <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      )}

      {activeTab === 'insurance' && (
        <Card className="p-6">
          {linkedPolicy ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <Badge variant="success" className="mb-2">Active Policy Cover</Badge>
                  <h3 className="text-xl font-bold text-gray-900">{linkedPolicy.planName}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">Policy No: {linkedPolicy.policyNumber}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/farmer/insurance/raise-claim?policyId=${linkedPolicy.id}`)}
                  >
                    Raise Damage Claim
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/farmer/insurance/${linkedPolicy.id}`)}
                  >
                    View Policy Certificate
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Sum Insured</span>
                  <span className="text-lg font-bold text-gray-900">₹{linkedPolicy.sumInsured.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Annual Premium</span>
                  <span className="text-lg font-bold text-gray-900">₹{linkedPolicy.annualPremium.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Insured Trees</span>
                  <span className="text-lg font-bold text-gray-900">{linkedPolicy.insuredTreeCount} Trees</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Valid Until</span>
                  <span className="text-lg font-bold text-gray-900">
                    {new Date(linkedPolicy.endDate).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-gray-900">No Active Insurance Policy</h4>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Protect your {land.treeCount} trees against storm, fire, cyclone and pest outbreaks.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/farmer/insurance/catalog')}
              >
                Explore Tree Insurance Plans
              </Button>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'soil' && (
        <Card className="p-6">
          {linkedSoil && linkedSoil.reportData ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <Badge variant="success" className="mb-2">Certified Lab Analysis</Badge>
                  <h3 className="text-lg font-bold text-gray-900">{linkedSoil.packageType}</h3>
                  <p className="text-xs text-gray-500">Tested by {linkedSoil.assignedLab}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/farmer/soil/report/${linkedSoil.id}`)}
                >
                  View Full Soil Health Report
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-semibold block">pH Value</span>
                  <span className="text-2xl font-bold text-emerald-900">{linkedSoil.reportData.pH.value}</span>
                  <span className="text-xs text-emerald-700 block mt-1">{linkedSoil.reportData.pH.rating}</span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-semibold block">Organic Carbon</span>
                  <span className="text-2xl font-bold text-emerald-900">{linkedSoil.reportData.organicCarbon.value}</span>
                  <span className="text-xs text-emerald-700 block mt-1">{linkedSoil.reportData.organicCarbon.rating}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-xs text-gray-500 font-semibold block">Nitrogen (N)</span>
                  <span className="text-2xl font-bold text-gray-900">{linkedSoil.reportData.nitrogen.value}</span>
                  <span className="text-xs text-gray-500 block mt-1">{linkedSoil.reportData.nitrogen.rating}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-xs text-gray-500 font-semibold block">Phosphorus (P)</span>
                  <span className="text-2xl font-bold text-gray-900">{linkedSoil.reportData.phosphorus.value}</span>
                  <span className="text-xs text-gray-500 block mt-1">{linkedSoil.reportData.phosphorus.rating}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <TestTube className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-gray-900">No Soil Test Completed Yet</h4>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Order an authorized field collection and lab testing kit for precision fertilizer dosage.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/farmer/soil/book')}
              >
                Book Soil Test (₹450 onwards)
              </Button>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Verified Land Documents</h3>
          <div className="divide-y divide-gray-100">
            {[
              { name: 'Survey 402/A Revenue Record 7-12 Extract.pdf', size: '3.2 MB', date: '15 Mar 2026', status: 'VERIFIED' },
              { name: 'Cadastral Naksha Boundary Map.pdf', size: '1.8 MB', date: '16 Mar 2026', status: 'VERIFIED' },
              { name: 'Field Inspection Drone Geotag Log.pdf', size: '4.5 MB', date: '22 Mar 2026', status: 'VERIFIED' },
            ].map((doc, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h5 className="font-semibold text-sm text-gray-900">{doc.name}</h5>
                    <span className="text-xs text-gray-500">{doc.size} • Uploaded {doc.date}</span>
                  </div>
                </div>
                <Badge variant="success">Verified</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Cadastral Land Deed Printable Modal */}
      <LandDeedModal
        isOpen={showDeedModal}
        onClose={() => setShowDeedModal(false)}
        landData={{
          id: land.id,
          khasraNumber: land.khasraNumber,
          khataNumber: land.khataNumber || '88/A',
          ownerName: 'Ramesh Patel',
          village: land.village || 'Navli',
          taluka: land.taluka || 'Anand',
          district: land.district || 'Anand, Gujarat',
          totalAreaAcres: land.areaAcres || 12.4,
          soilType: land.soilType || 'Alluvial Loam',
          irrigationStatus: land.irrigationSource || 'Tube Well & Drip System',
          verificationDate: '24 Jan 2026',
          revenueSealNo: `REV-GUJ-2026-${land.khasraNumber?.replace(/[^0-9]/g, '') || '88190'}`,
          coordinates: [
            { lat: 22.5645, lng: 72.9288 },
            { lat: 22.5658, lng: 72.9312 },
            { lat: 22.5632, lng: 72.9325 },
            { lat: 22.5621, lng: 72.9295 }
          ]
        }}
      />
    </div>
  );
};
