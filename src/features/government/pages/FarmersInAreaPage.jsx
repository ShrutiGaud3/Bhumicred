import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Send,
  MessageSquare,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';

const MOCK_AREA_FARMERS = [
  {
    id: 'frm_01',
    name: 'Ramesh Patel',
    mobile: '+91 91234 56780',
    village: 'Mogri',
    taluk: 'Anand',
    totalHoldings: 3,
    totalAreaAcres: 16.5,
    treeCount: 320,
    crops: ['Cotton', 'Teak', 'Groundnut'],
    kycStatus: 'APPROVED',
    registeredDate: '15 Mar 2026',
  },
  {
    id: 'frm_02',
    name: 'Jitendra Vaghela',
    mobile: '+91 98251 44091',
    village: 'Jitodia',
    taluk: 'Anand',
    totalHoldings: 2,
    totalAreaAcres: 9.2,
    treeCount: 140,
    crops: ['Mustard', 'Bajra', 'Mango'],
    kycStatus: 'APPROVED',
    registeredDate: '02 Apr 2026',
  },
  {
    id: 'frm_03',
    name: 'Manharbhai Solanki',
    mobile: '+91 94280 88219',
    village: 'Gana',
    taluk: 'Anand',
    totalHoldings: 1,
    totalAreaAcres: 4.5,
    treeCount: 65,
    crops: ['Castor', 'Fodder Maize'],
    kycStatus: 'PENDING_VERIFICATION',
    registeredDate: '28 Jul 2026',
  },
  {
    id: 'frm_04',
    name: 'Kailashben Prajapati',
    mobile: '+91 97245 10924',
    village: 'Kheda Rural',
    taluk: 'Kheda',
    totalHoldings: 2,
    totalAreaAcres: 7.8,
    treeCount: 210,
    crops: ['Sandalwood', 'Cotton', 'Wheat'],
    kycStatus: 'APPROVED',
    registeredDate: '10 May 2026',
  },
];

export const FarmersInAreaPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [talukaFilter, setTalukaFilter] = useState('ALL');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastChannel, setBroadcastChannel] = useState('SMS_WHATSAPP');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const filteredFarmers = MOCK_AREA_FARMERS.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.mobile.includes(searchQuery);
    const matchesTaluka = talukaFilter === 'ALL' || f.taluk === talukaFilter;
    return matchesSearch && matchesTaluka;
  });

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setShowBroadcastModal(false);
      setBroadcastMessage('');
    }, 2000);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Jurisdiction Farmers Directory"
        subtitle="Directory of registered landowners, tree growers, and beneficiary farmers in Anand & Kheda districts."
        backTo="/government/dashboard"
        breadcrumbs={[
          { label: 'Government Portal', path: '/government/dashboard' },
          { label: 'Farmers in Area' },
        ]}
        actions={
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setShowBroadcastModal(true)}
          >
            <Send className="w-4 h-4" /> Broadcast Advisory / Alert
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="sm:col-span-2">
          <SearchInput
            placeholder="Search by farmer name, village, mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <FormSelect
          value={talukaFilter}
          onChange={(e) => setTalukaFilter(e.target.value)}
          options={[
            { label: 'All Talukas (Anand & Kheda)', value: 'ALL' },
            { label: 'Anand Taluka', value: 'Anand' },
            { label: 'Kheda Taluka', value: 'Kheda' },
          ]}
        />
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFarmers.map((farmer) => (
          <Card key={farmer.id} className="p-6 border border-gray-200 hover:shadow-lg transition-all space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  {farmer.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-base text-gray-900 leading-snug">{farmer.name}</h4>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{farmer.mobile}</p>
                </div>
              </div>
              <StatusBadge status={farmer.kycStatus} />
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Location</span>
                <span className="font-bold text-gray-800">{farmer.village}, {farmer.taluk}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Total Acreage</span>
                <span className="font-bold text-gray-800">{farmer.totalAreaAcres} Acres</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Standing Trees</span>
                <span className="font-bold text-emerald-700">{farmer.treeCount} Trees</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600">
              <span className="font-bold text-gray-800 block">Cultivated Crops & Timber:</span>
              <div className="flex flex-wrap gap-1">
                {farmer.crops.map((crop, idx) => (
                  <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-md font-medium">
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Enrolled: {farmer.registeredDate}</span>
              <span className="text-emerald-700 font-bold hover:underline cursor-pointer">
                View Land Records →
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Broadcast SMS/WhatsApp Modal */}
      <Modal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        title="Broadcast Regional Advisory Announcement"
      >
        <form onSubmit={handleSendBroadcast} className="space-y-6 py-2">
          {broadcastSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Broadcast Dispatched!</h4>
              <p className="text-sm text-gray-500 mt-1">
                Delivered to {filteredFarmers.length} registered farmers in selected jurisdiction.
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <strong>Target Audience:</strong> {filteredFarmers.length} farmers in Anand & Kheda jurisdiction.
              </div>

              <FormSelect
                label="Broadcast Channel"
                value={broadcastChannel}
                onChange={(e) => setBroadcastChannel(e.target.value)}
                options={[
                  { label: 'SMS & WhatsApp (High Priority)', value: 'SMS_WHATSAPP' },
                  { label: 'In-App Portal Notification only', value: 'IN_APP' },
                  { label: 'Voice Call OBD Broadcast', value: 'VOICE_CALL' },
                ]}
              />

              <FormTextarea
                label="Advisory Message Content"
                rows={4}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="e.g. Free Soil Health testing camps scheduled at Mogri Gram Panchayat from 15 Sep. Bring 7/12 extract..."
                required
              />

              <Button type="submit" variant="primary" className="w-full py-3 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Advisory to {filteredFarmers.length} Farmers
              </Button>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};
