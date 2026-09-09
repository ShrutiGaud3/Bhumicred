import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Upload,
  TestTube,
  CheckCircle2,
  Sparkles,
  FileText,
  Layers,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { FileUploader } from '../../../components/forms/FileUploader.jsx';
import { useToast } from '../../../components/ui/ToastContext.jsx';
import { soilService } from '../../soil/services/soilService.js';

export const ReportsUploadPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlRequestId = searchParams.get('requestId');
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(urlRequestId || '');
  const [reportData, setReportData] = useState({
    pH: '7.1',
    ec: '0.45 dS/m',
    organicCarbon: '0.78%',
    nitrogen: '260 kg/ha',
    phosphorus: '22 kg/ha',
    potassium: '295 kg/ha',
    zinc: '1.05 ppm',
    iron: '5.1 ppm',
    recommendation: 'Soil is in optimal condition for commercial teak growth. Apply 15kg/acre bio-potash in monsoon.',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const res = await soilService.getSoilRequests();
        if (res.data && res.data.length > 0) {
          setRequests(res.data);
          const match = res.data.find((r) => (r._id || r.id) === urlRequestId);
          setSelectedRequestId(match ? (match._id || match.id) : (res.data[0]._id || res.data[0].id));
        }
      } catch (e) {
        console.warn('Failed to load live soil requests:', e);
      }
    };
    loadRequests();
  }, [urlRequestId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequestId) {
      toast.error('Please select a pending soil testing request.');
      return;
    }

    setIsSubmitting(true);
    try {
      await soilService.updateSoilReport(selectedRequestId, {
        status: 'REPORT_READY',
        ...reportData,
      });
      setSubmitted(true);
      toast.success('Soil Health Card certified & published to farmer registry!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish lab report');
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Soil Health Report Certified!</h2>
        <p className="text-gray-600 text-sm">
          12-Parameter diagnostic report data published to farmer registry, digital seal stamped, and Soil Health Card released.
        </p>
        <div className="flex gap-4 justify-center pt-2">
          <Button variant="primary" onClick={() => navigate('/partner/lab')}>
            Back to Lab Queue
          </Button>
          <Button variant="outline" onClick={() => navigate('/partner/invoices')}>
            View Service Invoices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Upload Certified Soil Lab Analysis"
        subtitle="Input 12-nutrient parameters, fertilizer dosage advice, and attach NABL accredited test certificate."
        backTo="/partner/lab"
        breadcrumbs={[
          { label: 'Partner Portal', path: '/partner/dashboard' },
          { label: 'Lab Reports', path: '/partner/lab' },
          { label: 'Upload Report' },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <Card className="p-6 md:p-8 space-y-6">
          {requests.length > 0 ? (
            <FormSelect
              label="Select Pending Soil Testing Request"
              value={selectedRequestId}
              onChange={(e) => setSelectedRequestId(e.target.value)}
              options={requests.map((s) => ({
                value: s._id || s.id,
                label: `${s.requestNumber} • ${s.landName} (${s.packageType}) [Status: ${s.status}]`,
              }))}
            />
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              No pending sample requests found in queue.
            </div>
          )}

          {/* 12-Nutrient Input Grid */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Nutrient Parameters & Index Matrix
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <FormInput
                label="pH Value"
                value={reportData.pH}
                onChange={(e) => setReportData({ ...reportData, pH: e.target.value })}
                required
              />
              <FormInput
                label="Organic Carbon (%)"
                value={reportData.organicCarbon}
                onChange={(e) => setReportData({ ...reportData, organicCarbon: e.target.value })}
                required
              />
              <FormInput
                label="Nitrogen (N)"
                value={reportData.nitrogen}
                onChange={(e) => setReportData({ ...reportData, nitrogen: e.target.value })}
                required
              />
              <FormInput
                label="Phosphorus (P)"
                value={reportData.phosphorus}
                onChange={(e) => setReportData({ ...reportData, phosphorus: e.target.value })}
                required
              />
              <FormInput
                label="Potassium (K)"
                value={reportData.potassium}
                onChange={(e) => setReportData({ ...reportData, potassium: e.target.value })}
                required
              />
              <FormInput
                label="Zinc (Zn)"
                value={reportData.zinc}
                onChange={(e) => setReportData({ ...reportData, zinc: e.target.value })}
                required
              />
              <FormInput
                label="Iron (Fe)"
                value={reportData.iron}
                onChange={(e) => setReportData({ ...reportData, iron: e.target.value })}
                required
              />
              <FormInput
                label="Electrical Cond. (EC)"
                value={reportData.ec}
                onChange={(e) => setReportData({ ...reportData, ec: e.target.value })}
                required
              />
            </div>
          </div>

          <FormTextarea
            label="Personalized Agronomy & Fertilizer Advice"
            rows={3}
            value={reportData.recommendation}
            onChange={(e) => setReportData({ ...reportData, recommendation: e.target.value })}
            required
          />

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 uppercase">
              Attach Signed NABL Lab Certificate (PDF)
            </label>
            <FileUploader
              label="Upload signed lab test report certificate"
              accept=".pdf"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={requests.length === 0}>
              Publish Certified Report
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default ReportsUploadPage;
