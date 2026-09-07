import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  TestTube,
  CheckCircle2,
  Sparkles,
  FileText,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { FileUploader } from '../../../components/forms/FileUploader.jsx';
import { MOCK_SOIL_REQUESTS } from '../../../services/mockData/soilMock.js';

export const ReportsUploadPage = () => {
  const navigate = useNavigate();
  const [selectedRequestId, setSelectedRequestId] = useState(MOCK_SOIL_REQUESTS[1].id);
  const [reportData, setReportData] = useState({
    pH: '7.1',
    organicCarbon: '0.78%',
    nitrogen: '260 kg/ha',
    phosphorus: '22 kg/ha',
    potassium: '295 kg/ha',
    zinc: '1.05 ppm',
    iron: '5.1 ppm',
    recommendation: 'Soil is in optimal condition for commercial teak growth. Apply 15kg/acre bio-potash in monsoon.',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Soil Health Report Certified!</h2>
        <p className="text-gray-600 text-sm">
          Report data published to farmer registry and linked to Parcel.
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
          <FormSelect
            label="Select Pending Soil Testing Request"
            value={selectedRequestId}
            onChange={(e) => setSelectedRequestId(e.target.value)}
            options={MOCK_SOIL_REQUESTS.map((s) => ({
              value: s.id,
              label: `${s.requestNumber} • ${s.landName} (${s.packageType})`,
            }))}
          />

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
                placeholder="e.g. 0.45 dS/m"
                defaultValue="0.45 dS/m"
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
            <Button type="submit" variant="primary">
              Publish Certified Report
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
