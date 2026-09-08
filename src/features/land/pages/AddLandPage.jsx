import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MapPin,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Trees,
  Droplets,
  Layers,
  Sparkles,
  Users,
  UserCheck,
  Plus,
  Trash2,
  Building,
  User,
  BadgeCheck,
  Camera,
  Compass,
  Crosshair,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Navigation,
  CreditCard,
  FileSpreadsheet,
  FileCheck,
  Scan,
  ExternalLink,
  Download,
  Printer,
  QrCode,
  Receipt,
  Wallet,
  Landmark,
  CheckCheck
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { Stepper } from '../../../components/ui/Stepper.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { FileUploader } from '../../../components/forms/FileUploader.jsx';
import { InteractiveGisMap } from '../../../components/ui/InteractiveGisMap.jsx';
import { TaxInvoiceQrCode } from '../../../components/ui/TaxInvoiceQrCode.jsx';
import { storageService } from '../../../services/storageService.js';
import { useToast } from '../../../components/ui/ToastContext.jsx';

const STEPS = [
  { title: 'Land Details', description: 'Survey & ownership' },
  { title: 'Agronomy & GIS', description: 'Crops, map & photos' },
  { title: 'Khasra & KYC', description: 'Pawti, Aadhaar, PAN & Photo' },
  { title: 'Insurance Choice', description: 'Tree protection' },
  { title: 'Review & Submit', description: 'Confirm application' },
];

const TREE_INSURANCE_PLANS = [
  {
    id: 'plan_agroforestry',
    title: 'Comprehensive Agroforestry & Teak Cover',
    category: 'Commercial Agroforestry',
    ratePerTree: 75,
    sumInsuredMultiplier: 32000,
    popular: true,
    subsidyPercent: 40,
    perils: ['Storm, Cyclone & Windthrow', 'Wildfire & Surface Fire', 'Fungal Blight & Stem Borers', 'Drought Index (Parametric)'],
    description: 'Full-cycle commercial timber & boundary plantation protection with maximum 40% government subsidy.',
  },
  {
    id: 'plan_single',
    title: 'Individual High-Value Tree Guard',
    category: 'Single / Cluster Trees',
    ratePerTree: 95,
    sumInsuredMultiplier: 25000,
    popular: false,
    subsidyPercent: 30,
    perils: ['Direct Lightning Strike', 'Storm & High Wind Damage', 'Wild Animal Encroachment', 'Winter Frost / Freeze'],
    description: 'Ideal for small orchards, mango / sandalwood clusters, and boundary trees.',
  },
  {
    id: 'plan_carbon_timber',
    title: 'Carbon Asset & High-Density Timber Shield',
    category: 'Institutional / Carbon Plots',
    ratePerTree: 110,
    sumInsuredMultiplier: 45000,
    popular: false,
    subsidyPercent: 25,
    perils: ['All Natural Perils (Fire/Storm/Flood)', 'Carbon Credit Shortfall Guarantee', 'Pest Outbreak Early Remediation', 'Drone LiDAR Re-planting'],
    description: 'High sum insured protection integrated with carbon credit yield guarantee.',
  },
];

export const AddLandPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  // Khasra / Pawti & KYC Documents State
  const [khasraDoc, setKhasraDoc] = useState({
    name: 'Khasra_Pawti_Survey_402A.pdf',
    size: 2450000,
    uploadedAt: 'Today',
  });
  const [aadhaarDoc, setAadhaarDoc] = useState({
    name: 'Aadhaar_Card_Front_Back.pdf',
    size: 1820000,
    uploadedAt: 'Today',
  });
  const [panDoc, setPanDoc] = useState({
    name: 'PAN_Card_Individual.pdf',
    size: 1140000,
    uploadedAt: 'Today',
  });
  const [farmerPhoto, setFarmerPhoto] = useState({
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    mode: 'LIVE_CAPTURED',
    timestamp: 'Live captured • Today 11:45 AM',
    name: 'Farmer_Passport_Photo.jpg',
  });

  // Form State
  const [rawMapAcreage, setRawMapAcreage] = useState('12.40');

  const convertAreaUnits = (valueInAcres, targetUnit) => {
    const num = parseFloat(valueInAcres) || 0;
    if (num === 0) return '';
    switch (targetUnit) {
      case 'Hectares':
        return (num * 0.404686).toFixed(2);
      case 'Bigha':
        return (num * 1.613).toFixed(2);
      case 'Guntha':
        return (num * 40).toFixed(1);
      case 'Acres':
      default:
        return num.toFixed(2);
    }
  };

  const [formData, setFormData] = useState({
    landName: '',
    surveyNumber: '',
    khasraNumber: '',
    landType: 'Agricultural (Irrigated)',
    ownershipType: 'Individual Owner',
    area: '12.40',
    areaUnit: 'Acres',
    address: '',
    district: 'Anand',
    state: 'Gujarat',
    pincode: '388345',
    soilType: 'Alluvial Loam',
    irrigationSource: 'Borewell & Drip Irrigation',
    primaryCrops: 'Cotton, Groundnut, Castor',
    treeCount: '45',
    treeSpecies: 'Mango, Teakwood, Neem',
    polygonCoords: [
      [72.9281, 22.5645],
      [72.9312, 22.5648],
      [72.9308, 22.5612],
      [72.9278, 22.561],
      [72.9281, 22.5645],
    ],
    documents: [],
    optInsurance: true,
    insurancePlan: 'Comprehensive Teak & Sandalwood Cover',
  });

  // Payment & Tax Invoice States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING'
  const [invoiceData, setInvoiceData] = useState(null);

  // Price & Fee Calculations based on ₹149 per Acre
  const acreageForCalc = parseFloat(rawMapAcreage) || parseFloat(formData?.area) || 12.40;
  const soilTestingAmount = Number((acreageForCalc * 49).toFixed(2));
  const inspectionAmount = Number((acreageForCalc * 50).toFixed(2));
  const carbonCreditAmount = Number((acreageForCalc * 35).toFixed(2));
  const fileChargesAmount = Number((acreageForCalc * 15).toFixed(2));
  const subtotalAmount = Number((acreageForCalc * 149).toFixed(2));
  const gstAmount = Number((subtotalAmount * 0.18).toFixed(2));
  const cgstAmount = Number((gstAmount / 2).toFixed(2));
  const sgstAmount = Number((gstAmount / 2).toFixed(2));
  const grandTotalAmount = Number((subtotalAmount + gstAmount).toFixed(2));

  // Joint Family Co-owners State (for Ancestral Joint Family)
  const [jointOwners, setJointOwners] = useState([
    {
      id: 'jo_1',
      name: 'Dahybhai Patel',
      relation: 'Father',
      aadhaar: 'XXXX-XXXX-4912',
      sharePercent: '50',
      mobile: '98250 11223',
      consent: true,
    },
    {
      id: 'jo_2',
      name: 'Pravinbhai Patel',
      relation: 'Brother',
      aadhaar: 'XXXX-XXXX-8821',
      sharePercent: '50',
      mobile: '98251 33445',
      consent: true,
    },
  ]);

  // Other Person / Third-party Owner State
  const [otherOwnerDetails, setOtherOwnerDetails] = useState({
    ownerFullName: '',
    ownerFatherName: '',
    ownerMobile: '',
    ownerAadhaar: '',
    ownerAddress: '',
    relationToApplicant: 'Power of Attorney Holder',
    poaDocumentNumber: 'POA/2026/ANAND/9821',
    agreementDate: '2026-03-15',
    farmerCultivatorName: user?.name || 'Ramesh Patel',
    farmerCultivatorMobile: user?.mobile || '9876543210',
    tenancyDurationYears: '5',
    agreementType: 'Registered Power of Attorney (PoA)',
    farmerAuthorizationAccepted: true,
  });

  // Mandatory (4-5) and Additional Geotagged Field Photos State
  const [fieldPhotos, setFieldPhotos] = useState([
    {
      id: 'photo_north',
      title: 'North Boundary Vertex (N-Corner)',
      direction: 'North Boundary',
      isMandatory: true,
      captured: true,
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
      lat: 22.5648,
      lng: 72.9312,
      timestamp: 'Today, 11:30 AM',
    },
    {
      id: 'photo_east',
      title: 'East Boundary Vertex (E-Corner)',
      direction: 'East Boundary',
      isMandatory: true,
      captured: true,
      imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80',
      lat: 22.5638,
      lng: 72.9325,
      timestamp: 'Today, 11:32 AM',
    },
    {
      id: 'photo_south',
      title: 'South Boundary Vertex (S-Corner)',
      direction: 'South Boundary',
      isMandatory: true,
      captured: true,
      imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&q=80',
      lat: 22.5610,
      lng: 72.9278,
      timestamp: 'Today, 11:34 AM',
    },
    {
      id: 'photo_west',
      title: 'West Boundary Vertex (W-Corner)',
      direction: 'West Boundary',
      isMandatory: true,
      captured: true,
      imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
      lat: 22.5622,
      lng: 72.9265,
      timestamp: 'Today, 11:35 AM',
    },
    {
      id: 'photo_center',
      title: 'Center Plot Standing Crop & Trees',
      direction: 'Center Plot',
      isMandatory: true,
      captured: true,
      imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80',
      lat: 22.5630,
      lng: 72.9290,
      timestamp: 'Today, 11:36 AM',
    },
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'areaUnit') {
      const converted = convertAreaUnits(rawMapAcreage, value);
      setFormData((prev) => ({
        ...prev,
        areaUnit: value,
        area: converted,
      }));
    } else if (name === 'area') {
      if (formData.areaUnit === 'Acres') {
        setRawMapAcreage(value);
      }
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleOtherOwnerChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOtherOwnerDetails((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Add Joint Co-owner Handler
  const handleAddJointOwner = () => {
    setJointOwners((prev) => [
      ...prev,
      {
        id: `jo_${Date.now()}`,
        name: '',
        relation: 'Brother',
        aadhaar: '',
        sharePercent: '',
        mobile: '',
        consent: true,
      },
    ]);
  };

  // Remove Joint Co-owner Handler
  const handleRemoveJointOwner = (id) => {
    if (jointOwners.length <= 1) {
      toast.warning('At least one co-owner is required for Joint Family title');
      return;
    }
    setJointOwners((prev) => prev.filter((owner) => owner.id !== id));
  };

  // Update Joint Co-owner field
  const handleUpdateJointOwner = (id, field, val) => {
    setJointOwners((prev) =>
      prev.map((owner) => (owner.id === id ? { ...owner, [field]: val } : owner))
    );
  };

  // Geotagged Photos Handlers
  const handleAddAdditionalPhoto = () => {
    const photoNumber = fieldPhotos.length + 1;
    setFieldPhotos((prev) => [
      ...prev,
      {
        id: `photo_add_${Date.now()}`,
        title: `Additional Plot Photo #${photoNumber} (Irrigation/Soil/Canal)`,
        direction: `Inspection Angle ${photoNumber}`,
        isMandatory: false,
        captured: false,
        imageUrl: '',
        lat: Number((22.5630 + (Math.random() * 0.003 - 0.0015)).toFixed(4)),
        lng: Number((72.9290 + (Math.random() * 0.003 - 0.0015)).toFixed(4)),
        timestamp: 'Pending capture',
      },
    ]);
    toast.info(`Added slot for Photo #${photoNumber}. Click Live Capture or Upload.`);
  };

  const handleRemovePhoto = (id) => {
    setFieldPhotos((prev) => prev.filter((p) => p.id !== id));
    toast.info('Photo slot removed');
  };

  const handleCaptureLivePhoto = (id) => {
    const demoUrls = [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80',
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&q=80',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80',
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&q=80',
    ];
    const pickedUrl = demoUrls[Math.floor(Math.random() * demoUrls.length)];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setFieldPhotos((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              captured: true,
              imageUrl: pickedUrl,
              lat: Number((22.5630 + (Math.random() * 0.004 - 0.002)).toFixed(4)),
              lng: Number((72.9290 + (Math.random() * 0.004 - 0.002)).toFixed(4)),
              timestamp: `Live captured at ${nowTime}`,
            }
          : p
      )
    );
    toast.success('Live Geotagged Field photo captured with GPS coordinates!');
  };

  const handleUploadPhotoFile = (id, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setFieldPhotos((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                captured: true,
                imageUrl: url,
                lat: Number((22.5630 + (Math.random() * 0.003 - 0.0015)).toFixed(4)),
                lng: Number((72.9290 + (Math.random() * 0.003 - 0.0015)).toFixed(4)),
                timestamp: `Attached ${file.name} at ${nowTime}`,
              }
            : p
        )
      );
      toast.success(`Photo attached for ${file.name}`);
    }
  };

  const handleSimulateAllPhotos = () => {
    setFieldPhotos([
      {
        id: 'photo_north',
        title: 'North Boundary Vertex (N-Corner)',
        direction: 'North Boundary',
        isMandatory: true,
        captured: true,
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
        lat: 22.5648,
        lng: 72.9312,
        timestamp: 'Live captured • 11:30 AM',
      },
      {
        id: 'photo_east',
        title: 'East Boundary Vertex (E-Corner)',
        direction: 'East Boundary',
        isMandatory: true,
        captured: true,
        imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80',
        lat: 22.5638,
        lng: 72.9325,
        timestamp: 'Live captured • 11:32 AM',
      },
      {
        id: 'photo_south',
        title: 'South Boundary Vertex (S-Corner)',
        direction: 'South Boundary',
        isMandatory: true,
        captured: true,
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&q=80',
        lat: 22.5610,
        lng: 72.9278,
        timestamp: 'Live captured • 11:34 AM',
      },
      {
        id: 'photo_west',
        title: 'West Boundary Vertex (W-Corner)',
        direction: 'West Boundary',
        isMandatory: true,
        captured: true,
        imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
        lat: 22.5622,
        lng: 72.9265,
        timestamp: 'Live captured • 11:35 AM',
      },
      {
        id: 'photo_center',
        title: 'Center Plot Standing Crop & Trees',
        direction: 'Center Plot',
        isMandatory: true,
        captured: true,
        imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80',
        lat: 22.5630,
        lng: 72.9290,
        timestamp: 'Live captured • 11:36 AM',
      },
    ]);
    toast.success('All 5 mandatory geotagged boundary photos populated!');
  };

  // Farmer KYC Photo Handlers (Live Capture & Upload)
  const handleCaptureFarmerPhoto = () => {
    const demoPortraits = [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
    ];
    const picked = demoPortraits[Math.floor(Math.random() * demoPortraits.length)];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFarmerPhoto({
      url: picked,
      mode: 'LIVE_CAPTURED',
      timestamp: `Live captured • Today ${nowTime}`,
      name: 'Farmer_Live_Passport_Portrait.jpg',
    });
    toast.success('Live Farmer Passport Photo captured with biometric timestamp!');
  };

  const handleUploadFarmerPhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setFarmerPhoto({
        url: url,
        mode: 'UPLOADED',
        timestamp: `Attached ${file.name} • ${nowTime}`,
        name: file.name,
      });
      toast.success(`Farmer photo attached (${file.name})`);
    }
  };

  const handleRemoveFarmerPhoto = () => {
    setFarmerPhoto(null);
    toast.info('Farmer photo removed');
  };

  const handleSimulateAllKycDocs = () => {
    setKhasraDoc({
      name: `Khasra_Pawti_Survey_${formData.surveyNumber || '402A'}.pdf`,
      size: 2450000,
      uploadedAt: 'Today',
    });
    setAadhaarDoc({
      name: 'Aadhaar_Card_Front_Back.pdf',
      size: 1820000,
      uploadedAt: 'Today',
    });
    setPanDoc({
      name: 'PAN_Card_Individual.pdf',
      size: 1140000,
      uploadedAt: 'Today',
    });
    setFarmerPhoto({
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
      mode: 'LIVE_CAPTURED',
      timestamp: 'Live captured • Today 11:45 AM',
      name: 'Farmer_Passport_Photo.jpg',
    });
    toast.success('All KYC documents (Khasra/Pawti, Aadhaar, PAN & Live Photo) populated!');
  };

  const capturedPhotosCount = fieldPhotos.filter((p) => p.captured).length;

  const handleExecutePayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      const generatedInvoice = {
        invoiceNumber: `BC-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        transactionId: `TXN-BHUMI-${Date.now().toString().slice(-8)}`,
        invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        invoiceTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        farmerName:
          formData.ownershipType === 'Other Person' && otherOwnerDetails.ownerFullName
            ? otherOwnerDetails.ownerFullName
            : (user?.name || 'Ramesh Dahybhai Patel'),
        fatherName:
          formData.ownershipType === 'Other Person' && otherOwnerDetails.ownerFatherName
            ? otherOwnerDetails.ownerFatherName
            : 'Dahybhai Patel',
        mobile: user?.mobile || otherOwnerDetails.ownerMobile || '9876543210',
        email: user?.email || 'farmer.ramesh@bhumicred.gov.in',
        address: formData.address || 'Survey 402/A, Village Mogri, Anand District, Gujarat - 388345',
        surveyNumber: formData.surveyNumber || '402/A',
        khasraNumber: formData.khasraNumber || '118/2',
        parcelName: formData.landName || 'Registered Agricultural Parcel A',
        acres: acreageForCalc,
        soilTesting: soilTestingAmount,
        inspection: inspectionAmount,
        carbonCredit: carbonCreditAmount,
        fileCharges: fileChargesAmount,
        subtotal: subtotalAmount,
        cgst: cgstAmount,
        sgst: sgstAmount,
        gstTotal: gstAmount,
        grandTotal: grandTotalAmount,
        paymentMethod:
          paymentMethod === 'UPI'
            ? 'BHIM UPI Instant (Verified)'
            : paymentMethod === 'CARD'
            ? 'RuPay / Debit Card'
            : 'Net Banking (SBI Agri Portal)',
        status: 'PAID & VERIFIED',
      };

      setInvoiceData(generatedInvoice);

      // Persist to storage service & sync cross-role approval
      storageService.saveLand({
        landName: formData.landName || 'New Agricultural Plot',
        surveyNumber: formData.surveyNumber || '108/A',
        khasraNumber: formData.khasraNumber || '412/9',
        areaAcres: acreageForCalc,
        landType: formData.landType,
        ownershipType: formData.ownershipType,
        jointOwners: formData.ownershipType === 'Ancestral Joint' ? jointOwners : undefined,
        otherOwnerDetails: formData.ownershipType === 'Other Person' ? otherOwnerDetails : undefined,
        fieldPhotos: fieldPhotos.filter((p) => p.captured),
        khasraDoc: khasraDoc,
        aadhaarDoc: aadhaarDoc,
        panDoc: panDoc,
        farmerPhoto: farmerPhoto,
        soilType: formData.soilType,
        irrigationSource: formData.irrigationSource,
        address: formData.address || 'Anand, Gujarat',
        treeCount: Number(formData.treeCount) || 45,
        status: 'PENDING_VERIFICATION',
        invoice: generatedInvoice,
      });

      setPaymentProcessing(false);
      setShowPaymentModal(false);
      setSubmitted(true);
      toast.success(`Payment of ₹${grandTotalAmount.toLocaleString('en-IN')} successful! Tax Invoice generated.`);
    }, 1400);
  };

  const handlePrintInvoice = () => {
    const originalTitle = document.title;
    if (invoiceData?.invoiceNumber) {
      document.title = `BHUMICRED_Tax_Invoice_${invoiceData.invoiceNumber}`;
    }
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleNext = () => {
    // If leaving Step 1 (Agronomy, GIS Map & Field Photos), validate min 4 photos
    if (activeStep === 1) {
      if (capturedPhotosCount < 4) {
        toast.error(`Please capture at least 4 mandatory boundary photos before proceeding. (Current: ${capturedPhotosCount}/4)`);
        return;
      }
    }

    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      // On final review step, trigger Payment Gateway Checkout
      setShowPaymentModal(true);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  if (submitted && invoiceData) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
        {/* Top Success & Action Header (Hidden in Print) */}
        <div className="print:hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-inner">
              <CheckCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h2 className="text-xl font-bold text-white">Payment Successful & Land Registered!</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  Receipt Generated
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Your application for <strong>{invoiceData.parcelName}</strong> has been submitted. Tax Invoice #{invoiceData.invoiceNumber} is ready.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center">
            <button
              type="button"
              onClick={handlePrintInvoice}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Tax Invoice (PDF)
            </button>
            <button
              type="button"
              onClick={handlePrintInvoice}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL DIGITAL TAX INVOICE & RECEIPT */}
        <div
          id="tax-invoice-printable"
          className="bg-white rounded-2xl border-2 border-slate-900 shadow-2xl p-5 sm:p-7 text-slate-900 space-y-4 print:p-0 print:border-none print:shadow-none print:space-y-3"
        >
          {/* Invoice Header with Official GST E-Invoice QR */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 border-b-2 border-slate-900 pb-3.5 print:pb-2.5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-800 text-white font-black text-xs tracking-wider">
                  BHUMICRED
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                  Sovereign Agro-GIS & Carbon Credit Registry
                </span>
              </div>
              <p className="text-[10px] text-slate-600">
                Department of Agriculture, Farmers Welfare & Land Administration • Govt. of Gujarat / India
              </p>
              <p className="text-[9px] font-mono text-slate-500">
                GSTIN: <strong>24AABCB9821A1Z8</strong> • CIN: <strong>U01100GJ2026PTC098214</strong> • SAC: <strong>998313</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 sm:text-right self-stretch sm:self-auto bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-lg border sm:border-none border-slate-200">
              <TaxInvoiceQrCode
                value={`https://einvoice.gst.gov.in/verify/${invoiceData.invoiceNumber}?gstin=24AABCB9821A1Z8&amt=${invoiceData.grandTotal}`}
                size={44}
                badgeText="GST E-INVOICE"
                badgeColor="bg-emerald-900 text-white"
                label="IRN Tax QR"
                subLabel="Govt GSTN Portal"
                className="hidden sm:flex"
              />
              <div className="text-[11px] space-y-0.5">
                <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-800 text-white text-[10px] font-black uppercase tracking-wider">
                  Official Digital Tax Invoice
                </span>
                <p className="pt-1"><span className="text-slate-500">Invoice No:</span> <strong className="font-mono text-slate-950">{invoiceData.invoiceNumber}</strong></p>
                <p><span className="text-slate-500">Date & Time:</span> <strong className="text-slate-900">{invoiceData.invoiceDate} • {invoiceData.invoiceTime}</strong></p>
                <p><span className="text-slate-500">Transaction ID:</span> <strong className="font-mono text-emerald-800">{invoiceData.transactionId}</strong></p>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ PAID & VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Section: Complete Farmer Particulars & Land Particulars with Cadastral GIS QR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-300 text-[11px]">
            {/* Farmer / Billed To Info */}
            <div className="space-y-0.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-900 border-b border-slate-200 pb-0.5 block">
                Billed To / Applicant Farmer Particulars
              </span>
              <div className="pt-0.5 space-y-0.5 text-slate-700 leading-tight">
                <p><span className="text-slate-500 w-24 inline-block">Farmer Name:</span> <strong className="text-slate-950">{invoiceData.farmerName}</strong></p>
                <p><span className="text-slate-500 w-24 inline-block">Father/Husband:</span> <strong className="text-slate-800">{invoiceData.fatherName}</strong></p>
                <p><span className="text-slate-500 w-24 inline-block">Mobile:</span> <span className="font-mono text-slate-800">{invoiceData.mobile}</span></p>
                <p><span className="text-slate-500 w-24 inline-block">Email:</span> <span className="text-slate-800">{invoiceData.email}</span></p>
                <p><span className="text-slate-500 w-24 inline-block">Address:</span> <span className="text-slate-800">{invoiceData.address}</span></p>
              </div>
            </div>

            {/* Registered Land Parcel Particulars with Cadastral QR */}
            <div className="space-y-0.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-900">
                  Registered Land Parcel & Verification Scope
                </span>
              </div>
              <div className="pt-0.5 flex items-start justify-between gap-2">
                <div className="space-y-0.5 text-slate-700 leading-tight flex-1 min-w-0">
                  <p><span className="text-slate-500 w-24 inline-block">Parcel Name:</span> <strong className="text-slate-950">{invoiceData.parcelName}</strong></p>
                  <p><span className="text-slate-500 w-24 inline-block">Survey/Khasra:</span> <strong className="font-mono text-emerald-800">Survey {invoiceData.surveyNumber} • Khasra {invoiceData.khasraNumber}</strong></p>
                  <p><span className="text-slate-500 w-24 inline-block">Total Land Area:</span> <strong className="text-slate-900 font-mono">{invoiceData.acres} Acres</strong></p>
                  <p><span className="text-slate-500 w-24 inline-block">Rate Standard:</span> <span className="font-semibold text-emerald-800">₹149 / Acre (Statutory Fee)</span></p>
                  <p><span className="text-slate-500 w-24 inline-block">Payment Mode:</span> <span className="text-slate-800">{invoiceData.paymentMethod}</span></p>
                </div>
                <TaxInvoiceQrCode
                  value={`https://bhumicred.gov.in/gis/cadastral?survey=${invoiceData.surveyNumber}&khasra=${invoiceData.khasraNumber}&acres=${invoiceData.acres}&lat=22.5630&lng=72.9290`}
                  size={42}
                  badgeText="GIS CADASTRE"
                  badgeColor="bg-teal-800 text-white"
                  label="Parcel Map QR"
                  subLabel={`Survey ${invoiceData.surveyNumber}`}
                  showLabel={false}
                />
              </div>
            </div>
          </div>

          {/* Itemized Charges Breakdown Table (Calculation set at ₹149 per acre) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border border-slate-300 rounded-lg overflow-hidden">
              <thead className="bg-slate-900 text-white uppercase text-[9px] tracking-wider">
                <tr>
                  <th className="py-2 px-2.5 w-7 text-center border-r border-slate-700">#</th>
                  <th className="py-2 px-3 border-r border-slate-700">Service / Fee Description</th>
                  <th className="py-2 px-2.5 text-center border-r border-slate-700">Rate/Acre</th>
                  <th className="py-2 px-2.5 text-center border-r border-slate-700">Area</th>
                  <th className="py-2 px-3 text-right">Taxable Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2 px-2.5 text-center font-bold text-slate-500 border-r border-slate-200">1</td>
                  <td className="py-2 px-3 border-r border-slate-200">
                    <strong className="block text-slate-950">Soil Testing & Nutrient Laboratory Analysis</strong>
                    <span className="text-[9px] text-slate-500">N-P-K, pH, Organic Carbon & Micro-Nutrient Mapping</span>
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-semibold border-r border-slate-200">₹49.00</td>
                  <td className="py-2 px-2.5 text-center font-mono border-r border-slate-200">{invoiceData.acres} ac</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">₹{invoiceData.soilTesting.toFixed(2)}</td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-2 px-2.5 text-center font-bold text-slate-500 border-r border-slate-200">2</td>
                  <td className="py-2 px-3 border-r border-slate-200">
                    <strong className="block text-slate-950">GIS Cadastral Polygon & Drone Field Inspection</strong>
                    <span className="text-[9px] text-slate-500">Satellite boundary verification & geotagged vertex inspection</span>
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-semibold border-r border-slate-200">₹50.00</td>
                  <td className="py-2 px-2.5 text-center font-mono border-r border-slate-200">{invoiceData.acres} ac</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">₹{invoiceData.inspection.toFixed(2)}</td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-2 px-2.5 text-center font-bold text-slate-500 border-r border-slate-200">3</td>
                  <td className="py-2 px-3 border-r border-slate-200">
                    <strong className="block text-slate-950">Carbon Credit Generator & Registry Tokenization</strong>
                    <span className="text-[9px] text-slate-500">Agroforestry carbon sequestration baseline estimation</span>
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-semibold border-r border-slate-200">₹35.00</td>
                  <td className="py-2 px-2.5 text-center font-mono border-r border-slate-200">{invoiceData.acres} ac</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">₹{invoiceData.carbonCredit.toFixed(2)}</td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-2 px-2.5 text-center font-bold text-slate-500 border-r border-slate-200">4</td>
                  <td className="py-2 px-3 border-r border-slate-200">
                    <strong className="block text-slate-950">Application Processing, Title Deed & File Documentation</strong>
                    <span className="text-[9px] text-slate-500">E-filing desk assessment, 7/12 & Pawti legal audit</span>
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-semibold border-r border-slate-200">₹15.00</td>
                  <td className="py-2 px-2.5 text-center font-mono border-r border-slate-200">{invoiceData.acres} ac</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">₹{invoiceData.fileCharges.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Invoice Totals, GST Summary Box & UPI Treasury Settlement QR */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-t border-slate-300 pt-2.5">
            <div className="space-y-1.5 max-w-sm text-[10px] text-slate-600">
              <TaxInvoiceQrCode
                value={`upi://pay?pa=bhumicred@sbi&pn=BHUMICRED_REGISTRY&am=${invoiceData.grandTotal}&tr=${invoiceData.transactionId}&cu=INR`}
                size={48}
                badgeText="UPI / RBI TREASURY"
                badgeColor="bg-blue-900 text-white"
                label="Treasury Settlement QR"
                subLabel={`Ref: ${invoiceData.transactionId} • Verified`}
              />
              <p className="text-[9px] text-slate-500 italic">
                * Rates calculated strictly at standard ₹149.00 per Acre + 18% GST (CGST 9% + SGST 9%).
              </p>
            </div>

            <div className="w-full sm:w-64 bg-slate-50 rounded-lg p-2.5 border border-slate-300 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal (Base @ ₹149/ac):</span>
                <strong className="font-mono">₹{invoiceData.subtotal.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-slate-600 text-[10px]">
                <span>Central GST (CGST @ 9%):</span>
                <span className="font-mono">₹{invoiceData.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[10px]">
                <span>State GST (SGST @ 9%):</span>
                <span className="font-mono">₹{invoiceData.sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700 border-t border-slate-200 pt-0.5 font-semibold text-[10px]">
                <span>Total GST (18%):</span>
                <span className="font-mono">₹{invoiceData.gstTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-black text-emerald-900 bg-emerald-100 p-1.5 rounded border border-emerald-300 mt-0.5">
                <span>Grand Total Paid:</span>
                <span className="font-mono text-sm">₹{invoiceData.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Digital Signature, Seal & Registrar Certificate QR */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-2 border-t border-slate-300 pt-2.5 text-[10px] text-slate-500">
            <div>
              <p className="font-bold text-slate-800">BHUMICRED Sovereign Agricultural Registry</p>
              <p className="text-[9px]">Authorized Digital Registrar • State Revenue Liaison Bureau</p>
            </div>
            <div className="flex items-center gap-2.5 text-right">
              <TaxInvoiceQrCode
                value={`https://bhumicred.gov.in/cert/security?cert=BC-TAX-AUTH-2026-9810&inv=${invoiceData.invoiceNumber}&seal=0x9f8e`}
                size={38}
                badgeText="DIGITAL SEAL"
                badgeColor="bg-emerald-800 text-white"
                label="Security Seal QR"
                subLabel="CERT-ID: BC-TAX-AUTH-2026-9810"
                showLabel={false}
              />
              <div>
                <div className="font-serif italic font-bold text-slate-800 text-xs">Digitally Signed & Certified</div>
                <p className="text-[9px] font-mono text-emerald-700">CERT-ID: BC-TAX-AUTH-2026-9810</p>
              </div>
            </div>
          </div>
        </div>

        {/* Post-Registration Action Buttons (Hidden in Print) */}
        <div className="print:hidden flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Button
            variant="primary"
            onClick={() => navigate('/farmer/lands')}
            className="flex items-center justify-center gap-2"
          >
            Go to My Lands Dashboard <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/farmer/application-status/BC-LND-2026-9810')}
          >
            Track Desk & Field Verification Status
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Register New Land Parcel"
        subtitle="Submit revenue survey details, draw satellite GIS boundaries, and catalog tree assets."
        backTo="/farmer/lands"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'My Lands', path: '/farmer/lands' },
          { label: 'Register Land' },
        ]}
      />

      {/* Wizard Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <Stepper steps={STEPS} currentStep={activeStep} />
      </div>

      {/* Step Content */}
      <Card className="p-6 md:p-8">
        {activeStep === 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Land Identity & Ownership Title</h3>
                <p className="text-xs text-gray-500">Enter official revenue records details matching your 7/12 extract or deed.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Farm / Parcel Title Name"
                name="landName"
                placeholder="e.g. Shree Ram Farm (North Plot)"
                value={formData.landName}
                onChange={handleChange}
                required
              />
              <FormSelect
                label="Land Classification"
                name="landType"
                value={formData.landType}
                onChange={handleChange}
                options={[
                  { value: 'Agricultural (Irrigated)', label: 'Agricultural (Irrigated)' },
                  { value: 'Agricultural (Semi-Arid)', label: 'Agricultural (Semi-Arid)' },
                  { value: 'Agroforestry / Plantation', label: 'Agroforestry / Plantation' },
                  { value: 'Barren / Wasteland Recovery', label: 'Barren / Wasteland Recovery' },
                ]}
              />
              <FormInput
                label="Revenue Survey Number"
                name="surveyNumber"
                placeholder="e.g. 402/A"
                value={formData.surveyNumber}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Khasra / Khata Number"
                name="khasraNumber"
                placeholder="e.g. 118/2"
                value={formData.khasraNumber}
                onChange={handleChange}
                required
              />
              <FormSelect
                label="Ownership Title"
                name="ownershipType"
                value={formData.ownershipType}
                onChange={handleChange}
                options={[
                  { value: 'Individual Owner', label: 'Individual Owner (Sole Title)' },
                  { value: 'Ancestral Joint', label: 'Ancestral Joint Family / Co-owners' },
                  { value: 'Other Person', label: 'Other Person / Representative (Third-party Land)' },
                  { value: 'Long-term Leaseholder', label: 'Long-term Leaseholder (> 5 yrs)' },
                  { value: 'FPO / Community Plot', label: 'FPO / Community Plot' },
                ]}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700">Area Size *</label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      🔗 Linked to GIS Map
                    </span>
                  </div>
                  <FormInput
                    name="area"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 12.40"
                    value={formData.area}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-[11px] text-emerald-800/80 font-medium mt-1">
                    Live GIS Calculation: <strong>{formData.area || '12.40'} {formData.areaUnit}</strong> ({rawMapAcreage} Acres)
                  </p>
                </div>
                <FormSelect
                  label="Unit"
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleChange}
                  options={[
                    { value: 'Acres', label: 'Acres (ac)' },
                    { value: 'Hectares', label: 'Hectares (ha)' },
                    { value: 'Bigha', label: 'Bigha (Gujarat / North)' },
                    { value: 'Guntha', label: 'Guntha' },
                  ]}
                />
              </div>
            </div>

            {/* CONDITIONAL SECTION 1: Ancestral Joint Family Co-owners Details */}
            {formData.ownershipType === 'Ancestral Joint' && (
              <div className="p-5 sm:p-6 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-700" />
                      Joint Family Co-owners Particulars (as per 7/12 / Revenue Record)
                    </h4>
                    <p className="text-xs text-emerald-800/80 mt-0.5">
                      Specify all registered family co-sharers and their respective ownership proportion.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddJointOwner}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Family Co-owner
                  </button>
                </div>

                <div className="space-y-3">
                  {jointOwners.map((owner, idx) => (
                    <div
                      key={owner.id}
                      className="p-4 bg-white rounded-xl border border-emerald-200/80 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-emerald-600" />
                          Co-owner #{idx + 1}
                        </span>
                        {jointOwners.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveJointOwner(owner.id)}
                            className="text-rose-600 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg text-xs flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <FormInput
                          label="Co-owner Full Name"
                          required
                          placeholder="e.g. Pravinbhai Dahybhai Patel"
                          value={owner.name}
                          onChange={(e) => handleUpdateJointOwner(owner.id, 'name', e.target.value)}
                        />

                        <FormSelect
                          label="Relationship with Applicant"
                          required
                          value={owner.relation}
                          onChange={(e) => handleUpdateJointOwner(owner.id, 'relation', e.target.value)}
                          options={[
                            { value: 'Father', label: 'Father' },
                            { value: 'Mother', label: 'Mother' },
                            { value: 'Brother', label: 'Brother' },
                            { value: 'Sister', label: 'Sister' },
                            { value: 'Spouse', label: 'Spouse' },
                            { value: 'Son', label: 'Son' },
                            { value: 'Daughter', label: 'Daughter' },
                            { value: 'Uncle', label: 'Uncle' },
                            { value: 'Co-sharer', label: 'Co-sharer / Joint Title Holder' },
                          ]}
                        />

                        <FormInput
                          label="Ownership Share (%) / Acres"
                          required
                          placeholder="e.g. 50% or 2.4 Acres"
                          value={owner.sharePercent}
                          onChange={(e) => handleUpdateJointOwner(owner.id, 'sharePercent', e.target.value)}
                        />

                        <FormInput
                          label="Aadhaar / National ID"
                          placeholder="e.g. XXXX-XXXX-1234"
                          value={owner.aadhaar}
                          onChange={(e) => handleUpdateJointOwner(owner.id, 'aadhaar', e.target.value)}
                        />

                        <FormInput
                          label="Mobile Number"
                          type="tel"
                          placeholder="e.g. 98250 00000"
                          value={owner.mobile}
                          onChange={(e) => handleUpdateJointOwner(owner.id, 'mobile', e.target.value)}
                        />

                        <div className="flex items-center pt-6">
                          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                            <input
                              type="checkbox"
                              checked={owner.consent}
                              onChange={(e) => handleUpdateJointOwner(owner.id, 'consent', e.target.checked)}
                              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>Family Consent & NOC Granted</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONDITIONAL SECTION 2: Other Person / Third-party Land Particulars */}
            {formData.ownershipType === 'Other Person' && (
              <div className="p-5 sm:p-6 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-amber-200 pb-2">
                  <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-700" />
                    Third-Party Land Owner & Cultivating Farmer Authorization
                  </h4>
                  <p className="text-xs text-amber-800/80 mt-0.5">
                    Enter the legal owner's credentials along with the applicant farmer's representative / cultivation particulars.
                  </p>
                </div>

                {/* Card A: Actual Legal Land Owner Particulars */}
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-amber-200/90 shadow-sm space-y-3">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Card A: Actual Legal Land Owner Details (as per Registry Title)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    <FormInput
                      label="Actual Owner Full Name"
                      name="ownerFullName"
                      required
                      placeholder="e.g. Jayeshbhai Manilal Shah"
                      value={otherOwnerDetails.ownerFullName}
                      onChange={handleOtherOwnerChange}
                    />

                    <FormInput
                      label="Owner's Father / Husband Name"
                      name="ownerFatherName"
                      required
                      placeholder="e.g. Manilal Shah"
                      value={otherOwnerDetails.ownerFatherName}
                      onChange={handleOtherOwnerChange}
                    />

                    <FormInput
                      label="Owner's Contact Mobile"
                      name="ownerMobile"
                      type="tel"
                      required
                      placeholder="e.g. 98111 22334"
                      value={otherOwnerDetails.ownerMobile}
                      onChange={handleOtherOwnerChange}
                    />

                    <FormInput
                      label="Owner's Aadhaar / PAN"
                      name="ownerAadhaar"
                      placeholder="e.g. XXXX-XXXX-9901"
                      value={otherOwnerDetails.ownerAadhaar}
                      onChange={handleOtherOwnerChange}
                    />

                    <FormSelect
                      label="Relationship to Applicant"
                      name="relationToApplicant"
                      required
                      value={otherOwnerDetails.relationToApplicant}
                      onChange={handleOtherOwnerChange}
                      options={[
                        { value: 'Power of Attorney Holder', label: 'Registered Power of Attorney (PoA)' },
                        { value: 'Family Relative / NRI Owner', label: 'Family Relative (NRI / Absentee Owner)' },
                        { value: 'Landlord / Lessor', label: 'Landlord / Agricultural Lessor' },
                        { value: 'Contract Farming Client', label: 'Contract Farming Grantor' },
                      ]}
                    />

                    <FormInput
                      label="PoA / Lease Agreement Ref No."
                      name="poaDocumentNumber"
                      placeholder="e.g. POA/2026/ANAND/9821"
                      value={otherOwnerDetails.poaDocumentNumber}
                      onChange={handleOtherOwnerChange}
                    />
                  </div>

                  <FormInput
                    label="Owner's Residential Address / Village"
                    name="ownerAddress"
                    placeholder="e.g. Navli Village, Anand District / Ahmedabad"
                    value={otherOwnerDetails.ownerAddress}
                    onChange={handleOtherOwnerChange}
                  />
                </div>

                {/* Card B: Cultivating Farmer / Representative Particulars */}
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-emerald-200 shadow-sm space-y-3">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    Card B: Cultivating Farmer / Applicant Representative Particulars
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    <FormInput
                      label="Cultivating Farmer / Applicant Name"
                      name="farmerCultivatorName"
                      required
                      value={otherOwnerDetails.farmerCultivatorName}
                      onChange={handleOtherOwnerChange}
                    />

                    <FormInput
                      label="Farmer Contact Mobile"
                      name="farmerCultivatorMobile"
                      type="tel"
                      required
                      value={otherOwnerDetails.farmerCultivatorMobile}
                      onChange={handleOtherOwnerChange}
                    />

                    <FormSelect
                      label="Cultivation Agreement Duration"
                      name="tenancyDurationYears"
                      value={otherOwnerDetails.tenancyDurationYears}
                      onChange={handleOtherOwnerChange}
                      options={[
                        { value: '1', label: '1 Year' },
                        { value: '3', label: '3 Years' },
                        { value: '5', label: '5 Years' },
                        { value: '10', label: '10 Years (Long Term)' },
                        { value: 'Permanent PoA', label: 'Permanent Power of Attorney' },
                      ]}
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 leading-relaxed">
                      <input
                        type="checkbox"
                        name="farmerAuthorizationAccepted"
                        checked={otherOwnerDetails.farmerAuthorizationAccepted}
                        onChange={handleOtherOwnerChange}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0"
                      />
                      <span>
                        I hereby declare that I am the authorized representative / cultivator of this land under valid authorization / Power of Attorney, and the original owner has consented to this registration on BHUMICRED.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <FormTextarea
              label="Full Postal Address & Landmark"
              name="address"
              rows={2}
              placeholder="e.g. Survey 402/A, Village Mogri, Anand District, Gujarat - 388345"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        )}

        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Agronomy Profile & GIS Boundary</h3>
                <p className="text-xs text-gray-500">
                  Select your soil attributes, crops, draw your satellite boundary polygon, and capture required live field photos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label="Soil Classification"
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                options={[
                  { value: 'Alluvial Loam', label: 'Alluvial Loam (High Silt)' },
                  { value: 'Black Cotton Loam', label: 'Black Cotton Soil (Regur)' },
                  { value: 'Red & Yellow Sandy', label: 'Red & Yellow Sandy Loam' },
                  { value: 'Laterite Soil', label: 'Laterite Soil' },
                  { value: 'Clay Loam', label: 'Heavy Clay Loam' },
                ]}
              />
              <FormSelect
                label="Primary Irrigation Facility"
                name="irrigationSource"
                value={formData.irrigationSource}
                onChange={handleChange}
                options={[
                  { value: 'Borewell & Drip Irrigation', label: 'Borewell & Precision Drip' },
                  { value: 'Canal & Sprinkler', label: 'Government Canal & Sprinkler' },
                  { value: 'Rainfed / Solar Pump', label: 'Rainfed with Solar Storage' },
                  { value: 'Open Well / River Lift', label: 'Open Well / River Lift' },
                ]}
              />
              <FormInput
                label="Primary Standing Crops / Seasonal Rotation"
                name="primaryCrops"
                placeholder="e.g. Cotton, Groundnut, Wheat"
                value={formData.primaryCrops}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Standing Tree Count"
                  name="treeCount"
                  type="number"
                  placeholder="e.g. 65"
                  value={formData.treeCount}
                  onChange={handleChange}
                />
                <FormInput
                  label="Tree Species"
                  name="treeSpecies"
                  placeholder="e.g. Teak, Sandalwood"
                  value={formData.treeSpecies}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* GIS Satellite Mapping Widget */}
            <div className="pt-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-800">
                    Interactive GIS Polygon Boundary Demarcation (Satellite & Cadastral Layer)
                  </label>
                  <p className="text-xs text-gray-500">
                    Click anywhere on the satellite canvas below to plot or refine boundary vertices. Area size will automatically sync.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold shadow-xs shrink-0">
                  <span>Synced Area:</span>
                  <span className="text-emerald-700 font-mono font-black">{formData.area || '12.40'} {formData.areaUnit}</span>
                  <span className="text-slate-400 font-normal">({rawMapAcreage} ac)</span>
                </div>
              </div>

              <InteractiveGisMap
                landName={formData.landName || 'Registered Plot'}
                initialPolygons={[{ id: 'new_poly', name: formData.landName || 'Registered Plot', coordinates: formData.polygonCoords }]}
                allowDrawing={true}
                onPolygonChange={(coords, calcAcreage) => {
                  if (calcAcreage) {
                    setRawMapAcreage(calcAcreage);
                    const convertedArea = convertAreaUnits(calcAcreage, formData.areaUnit);
                    setFormData((prev) => ({
                      ...prev,
                      polygonCoords: coords,
                      area: convertedArea,
                    }));
                  } else {
                    setFormData((prev) => ({ ...prev, polygonCoords: coords }));
                  }
                }}
                onAreaChange={(calcAcreage) => {
                  setRawMapAcreage(calcAcreage);
                  const convertedArea = convertAreaUnits(calcAcreage, formData.areaUnit);
                  setFormData((prev) => ({
                    ...prev,
                    area: convertedArea,
                  }));
                }}
              />
            </div>

            {/* LIVE GEOTAGGED FIELD PHOTOS SECTION (4-5 Mandatory + Unlimited Additional) */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-4 sm:p-5 rounded-2xl text-white shadow-md">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Camera className="w-5 h-5 text-amber-300" />
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      Live Geotagged Field & Boundary Photos
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Min. 4-5 Mandatory
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    Capture live on-site boundary vertices (North, South, East, West corners) and center standing crop photos with verified GPS timestamps.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    type="button"
                    onClick={handleSimulateAllPhotos}
                    className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/30 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Auto-Fill 5 Demo Photos
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAdditionalPhoto}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add More Photos ({fieldPhotos.length})
                  </button>
                </div>
              </div>

              {/* Progress & Validation Indicator */}
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Capture Progress:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${
                    capturedPhotosCount >= 4 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {capturedPhotosCount} / {fieldPhotos.length} Captured (Min 4 Required)
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  {capturedPhotosCount >= 4 ? '✓ Ready to continue' : '⚠️ Need at least 4 photos'}
                </span>
              </div>

              {/* Field Photos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fieldPhotos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className={`rounded-2xl border transition-all overflow-hidden bg-white shadow-sm flex flex-col justify-between ${
                      photo.captured
                        ? 'border-emerald-300 ring-1 ring-emerald-200'
                        : 'border-amber-300/80 border-dashed bg-amber-50/30'
                    }`}
                  >
                    {/* Header Bar */}
                    <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                      <div className="flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="font-bold text-xs text-slate-900 truncate max-w-[180px]">
                          #{idx + 1} {photo.direction}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {photo.isMandatory ? (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            Mandatory
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Remove photo slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Image Canvas / Preview Area */}
                    <div className="relative h-44 bg-slate-900 flex items-center justify-center overflow-hidden group">
                      {photo.captured && photo.imageUrl ? (
                        <>
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Live Geotag Stamp Overlay */}
                          <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-[10px] font-mono text-white flex flex-col gap-0.5">
                            <div className="flex items-center justify-between">
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <Crosshair className="w-3 h-3" />
                                {photo.lat}° N, {photo.lng}° E
                              </span>
                              <span className="text-amber-300 font-semibold">{photo.direction}</span>
                            </div>
                            <span className="text-slate-300 text-[9px]">{photo.timestamp}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 space-y-2">
                          <Camera className="w-8 h-8 text-amber-400/70 mx-auto animate-pulse" />
                          <p className="text-xs font-semibold text-slate-300">{photo.title}</p>
                          <p className="text-[10px] text-slate-400">No photo captured yet</p>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleCaptureLivePhoto(photo.id)}
                        className="flex-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        {photo.captured ? 'Retake Photo' : 'Live Capture'}
                      </button>

                      <label className="cursor-pointer px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1">
                        <Upload className="w-3 h-3 text-slate-500" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleUploadPhotoFile(photo.id, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Upload Khasra / Pawti & Farmer KYC Documents</h3>
                  <p className="text-xs text-gray-500">
                    Attach Land Khasra / Rin Pustika (Pawti) along with Aadhaar, PAN Card, and Live/Uploaded Farmer Passport Photo.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulateAllKycDocs}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Auto-Fill Demo KYC & Pawti
              </button>
            </div>

            {/* 4 Cards Grid for Khasra, Aadhaar, PAN & Farmer Photo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: Mandatory Khasra / Rin Pustika (Pawti) */}
              <div className="p-5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-sm text-gray-900">Khasra / Land Pawti (खसरा / पावती)</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Mandatory
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Official Revenue Khasra / B-1 / Kisan Rin Pustika showing survey number and ownership title.
                  </p>
                </div>

                {khasraDoc ? (
                  <div className="p-3 bg-white border border-emerald-300 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-gray-900 truncate">{khasraDoc.name}</p>
                        <span className="text-[10px] text-emerald-700 font-semibold">✓ Attached & Ready</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setKhasraDoc(null)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <FileUploader
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSizeMB={10}
                    helperText="PDF, PNG, JPG (Khasra / B-1 / Land Pawti up to 10MB)"
                    onFileSelect={(file) => setKhasraDoc(file)}
                  />
                )}
              </div>

              {/* Card 2: Aadhaar Card Document */}
              <div className="p-5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-sm text-gray-900">Aadhaar Card (आधार कार्ड)</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Identity Proof
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Front & Back copy of 12-digit Aadhaar Card for UIDAI biometric identity verification.
                  </p>
                </div>

                {aadhaarDoc ? (
                  <div className="p-3 bg-white border border-emerald-300 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-gray-900 truncate">{aadhaarDoc.name}</p>
                        <span className="text-[10px] text-emerald-700 font-semibold">✓ Attached & Verified</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAadhaarDoc(null)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <FileUploader
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSizeMB={5}
                    helperText="PDF, PNG, JPG (Aadhaar Front & Back up to 5MB)"
                    onFileSelect={(file) => setAadhaarDoc(file)}
                  />
                )}
              </div>

              {/* Card 3: PAN Card Document */}
              <div className="p-5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-sm text-gray-900">PAN Card (पैन कार्ड)</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Financial KYC
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Permanent Account Number (PAN) Card for tree plantation payout settlements & subsidies.
                  </p>
                </div>

                {panDoc ? (
                  <div className="p-3 bg-white border border-emerald-300 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-gray-900 truncate">{panDoc.name}</p>
                        <span className="text-[10px] text-emerald-700 font-semibold">✓ Attached & Ready</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPanDoc(null)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <FileUploader
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSizeMB={5}
                    helperText="PDF, PNG, JPG (PAN Card up to 5MB)"
                    onFileSelect={(file) => setPanDoc(file)}
                  />
                )}
              </div>

              {/* Card 4: Farmer / Landholder Photo (Live Capture or Upload) */}
              <div className="p-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl space-y-3 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-amber-300" />
                      <h4 className="font-bold text-sm text-white">Farmer / Landholder Photo (फोटो)</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Live / Upload
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Live capture or upload passport photo of applicant farmer for biometric verification.
                  </p>
                </div>

                {farmerPhoto ? (
                  <div className="p-3 bg-white/10 backdrop-blur-md border border-emerald-400/40 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-emerald-400 shadow-md shrink-0 bg-slate-800">
                        <img
                          src={farmerPhoto.url}
                          alt="Farmer Portrait"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-0.5">
                          <span className="text-[8px] font-mono text-emerald-300 font-bold">VERIFIED</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">Farmer Passport Photo</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                            {farmerPhoto.mode === 'LIVE_CAPTURED' ? 'Live Captured ✓' : 'Uploaded ✓'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 font-mono mt-0.5">{farmerPhoto.timestamp}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleCaptureFarmerPhoto}
                        className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-2xs"
                        title="Retake live photo"
                      >
                        Retake
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveFarmerPhoto}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleCaptureFarmerPhoto}
                      className="px-3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all shadow-md active:scale-98"
                    >
                      <Camera className="w-5 h-5 text-amber-300 animate-pulse" />
                      <span>Live Camera Capture</span>
                      <span className="text-[9px] text-emerald-200 font-normal">Real-time Biometric Photo</span>
                    </button>

                    <label className="cursor-pointer px-3 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all">
                      <Upload className="w-5 h-5 text-slate-300" />
                      <span>Upload from Device</span>
                      <span className="text-[9px] text-slate-300 font-normal">JPG, PNG Passport Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={handleUploadFarmerPhoto}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Conditional NOC / PoA Upload for Joint Family or Third Party */}
            {(formData.ownershipType === 'Ancestral Joint' || formData.ownershipType === 'Other Person') && (
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl">
                <h4 className="font-semibold text-sm text-amber-950 mb-1">
                  {formData.ownershipType === 'Ancestral Joint'
                    ? 'Family Co-owners Consent & NOC Document'
                    : 'Power of Attorney / Owner Authorization Agreement'}
                </h4>
                <p className="text-xs text-amber-800/80 mb-3">
                  Upload signed consent letter, affidavit, or registered Power of Attorney.
                </p>
                <FileUploader
                  accept=".pdf,.jpg,.png"
                  maxSizeMB={5}
                  onFileSelect={() => toast.success('Authorization document attached!')}
                />
              </div>
            )}
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Trees className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tree Plantation Insurance Choice</h3>
                  <p className="text-xs text-gray-500">
                    Select a sovereign-backed tree insurance plan for your standing {formData.treeCount || 45} trees or explore the full catalog.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/farmer/insurance/catalog')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  Full Insurance Portal
                </button>
              </div>
            </div>

            {/* Opt-in Toggle Banner */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="optInsurance"
                  checked={formData.optInsurance}
                  onChange={handleChange}
                  className="mt-1 h-5 w-5 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      Opt-in for Sovereign Tree Plantation Insurance Cover
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                      Up to 40% State Subsidy
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Protect {formData.treeCount || 45} cataloged {formData.treeSpecies || 'standing trees'} against cyclone, fire, pest blight, and climatic perils.
                  </p>
                </div>
              </label>

              {formData.optInsurance && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold shrink-0 text-center">
                  Active Quote for {formData.treeCount || 45} Trees
                </div>
              )}
            </div>

            {/* Tree Insurance Plans Selection Cards Grid */}
            {formData.optInsurance ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Available Tree Insurance Plans (Click to Select & Proceed):
                  </h4>
                  <span className="text-xs text-emerald-700 font-semibold">
                    Current: <strong>{formData.insurancePlan}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {TREE_INSURANCE_PLANS.map((plan) => {
                    const isSelected = formData.insurancePlan === plan.title || (plan.popular && !formData.insurancePlan);
                    const treeCount = Number(formData.treeCount) || 45;
                    const calculatedSumInsured = (treeCount * plan.sumInsuredMultiplier).toLocaleString('en-IN');
                    const grossPrem = treeCount * plan.ratePerTree * 4.5;
                    const netPrem = Math.round(grossPrem * (1 - plan.subsidyPercent / 100)).toLocaleString('en-IN');

                    return (
                      <div
                        key={plan.id}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            insurancePlan: plan.title,
                            optInsurance: true,
                          }));
                          toast.success(`Selected "${plan.title}"! Click proceed or review below.`);
                        }}
                        className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col justify-between relative bg-white ${
                          isSelected
                            ? 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-lg bg-emerald-50/20'
                            : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
                            Most Popular • 40% Subsidy
                          </span>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                                {plan.category}
                              </span>
                              <h5 className="font-bold text-base text-gray-900 mt-1.5 leading-snug">
                                {plan.title}
                              </h5>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                              isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 leading-relaxed">
                            {plan.description}
                          </p>

                          {/* Premium & Sum Insured Box */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Est. Sum Insured:</span>
                              <strong className="text-emerald-800 font-bold">₹{calculatedSumInsured}</strong>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Net Premium ({treeCount} Trees):</span>
                              <strong className="text-gray-900 font-bold">₹{netPrem} / yr</strong>
                            </div>
                            <div className="flex justify-between text-[11px] text-emerald-700 font-semibold border-t border-slate-200 pt-1">
                              <span>Govt Subsidy:</span>
                              <span>{plan.subsidyPercent}% Direct Rebate</span>
                            </div>
                          </div>

                          {/* Perils list */}
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-gray-700 block">Covered Perils:</span>
                            <ul className="text-[11px] text-gray-600 space-y-0.5">
                              {plan.perils.map((peril, pIdx) => (
                                <li key={pIdx} className="flex items-center gap-1.5">
                                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>{peril}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Direct Select & Proceed Button */}
                        <div className="pt-4 mt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData((prev) => ({
                                ...prev,
                                insurancePlan: plan.title,
                                optInsurance: true,
                              }));
                              toast.success(`Selected "${plan.title}"! Moving to final review.`);
                              setActiveStep(4);
                            }}
                            className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                                : 'bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800'
                            }`}
                          >
                            <span>{isSelected ? '✓ Plan Selected — Proceed to Review' : 'Select This Plan & Proceed'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                <p className="text-sm font-semibold text-gray-700">
                  Tree plantation insurance is currently opted out for this parcel.
                </p>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  You can opt-in at any time to claim up to 40% government subsidy on high-density timber and sandalwood cover, or proceed directly to submission.
                </p>
              </div>
            )}
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Review Application Summary</h3>
                <p className="text-xs text-gray-500">Verify your information before final submission for verification.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-gray-900 pb-2 border-b border-slate-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Land Identification & Title
                </h4>
                <div className="flex justify-between">
                  <span className="text-gray-500">Parcel Name:</span>
                  <span className="font-semibold text-gray-900">{formData.landName || 'Shree Ram Farm'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Survey / Khasra:</span>
                  <span className="font-semibold text-gray-900">{formData.surveyNumber || '402/A'} / {formData.khasraNumber || '118/2'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ownership Title:</span>
                  <span className="font-bold text-emerald-800">{formData.ownershipType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Classification:</span>
                  <span className="font-semibold text-gray-900">{formData.landType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Area:</span>
                  <span className="font-semibold text-gray-900">{formData.area || '4.8'} {formData.areaUnit}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-gray-900 pb-2 border-b border-slate-200 flex items-center gap-2">
                  <Trees className="w-4 h-4 text-emerald-600" /> Agronomy & Assets
                </h4>
                <div className="flex justify-between">
                  <span className="text-gray-500">Soil Type:</span>
                  <span className="font-semibold text-gray-900">{formData.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Irrigation:</span>
                  <span className="font-semibold text-gray-900">{formData.irrigationSource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tree Count:</span>
                  <span className="font-semibold text-gray-900">{formData.treeCount || 45} Trees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Insurance Opt-In:</span>
                  <span className="font-semibold text-emerald-600">{formData.optInsurance ? 'Yes (Included)' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Step 5 Conditional Summary for Joint Family */}
            {formData.ownershipType === 'Ancestral Joint' && (
              <div className="bg-emerald-50/70 p-5 rounded-xl border border-emerald-200 space-y-3 text-xs">
                <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                  <Users className="w-4 h-4 text-emerald-700" />
                  Ancestral Joint Family Co-owners ({jointOwners.length} Registered)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {jointOwners.map((jo, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-emerald-200/80 space-y-1">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{jo.name || `Co-owner ${idx + 1}`}</span>
                        <span className="text-emerald-700 font-semibold">{jo.relation}</span>
                      </div>
                      <div className="text-slate-600 flex justify-between">
                        <span>Share: <strong>{jo.sharePercent}%</strong></span>
                        <span>Mob: {jo.mobile || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5 Conditional Summary for Other Person */}
            {formData.ownershipType === 'Other Person' && (
              <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200 space-y-3 text-xs">
                <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
                  <UserCheck className="w-4 h-4 text-amber-700" />
                  Third-Party Owner & Cultivator Authorization Summary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-white rounded-lg border border-amber-200 space-y-1.5">
                    <span className="font-bold text-amber-900 block border-b pb-1">Actual Legal Land Owner</span>
                    <div className="flex justify-between"><span className="text-slate-500">Name:</span> <strong className="text-slate-900">{otherOwnerDetails.ownerFullName || 'Jayeshbhai Shah'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">Father/Husband:</span> <span>{otherOwnerDetails.ownerFatherName || 'Manilal Shah'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Mobile:</span> <span className="font-mono">{otherOwnerDetails.ownerMobile || '9811122334'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Authorization:</span> <span>{otherOwnerDetails.relationToApplicant}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">PoA/Ref No:</span> <span className="font-mono text-emerald-800">{otherOwnerDetails.poaDocumentNumber}</span></div>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-emerald-200 space-y-1.5">
                    <span className="font-bold text-emerald-900 block border-b pb-1">Cultivating Farmer / Applicant</span>
                    <div className="flex justify-between"><span className="text-slate-500">Farmer:</span> <strong className="text-slate-900">{otherOwnerDetails.farmerCultivatorName || user?.name || 'Ramesh Patel'}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">Mobile:</span> <span className="font-mono">{otherOwnerDetails.farmerCultivatorMobile || user?.mobile}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Cultivation Period:</span> <span>{otherOwnerDetails.tenancyDurationYears} Years</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Agreement Type:</span> <span>{otherOwnerDetails.agreementType}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Status:</span> <span className="text-emerald-700 font-bold">Authorized with NOC</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 KYC & Khasra Document Summary */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Khasra / Pawti & Farmer KYC Documents
                </h4>
                <span className="text-emerald-700 font-semibold">✓ Verified for Revenue Assessment</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                {/* Khasra Card */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">
                    Land Title
                  </span>
                  <p className="font-bold text-slate-900 truncate">Khasra / Pawti</p>
                  <p className="text-slate-500 truncate text-[11px]">{khasraDoc?.name || 'Khasra_Pawti_402A.pdf'}</p>
                </div>

                {/* Aadhaar Card */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">
                    ID Proof
                  </span>
                  <p className="font-bold text-slate-900 truncate">Aadhaar Card</p>
                  <p className="text-slate-500 truncate text-[11px]">{aadhaarDoc?.name || 'Aadhaar_Document.pdf'}</p>
                </div>

                {/* PAN Card */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded uppercase">
                    Tax / Payout
                  </span>
                  <p className="font-bold text-slate-900 truncate">PAN Card</p>
                  <p className="text-slate-500 truncate text-[11px]">{panDoc?.name || 'PAN_Card.pdf'}</p>
                </div>

                {/* Farmer Photo */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2.5">
                  <img
                    src={farmerPhoto?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'}
                    alt="Farmer Passport Photo"
                    className="w-10 h-10 rounded-lg object-cover border border-emerald-300 shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate text-[11px]">Farmer Photo</p>
                    <span className="text-[10px] font-bold text-emerald-700">✓ Biometric Stamp</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 Field Photos Thumbnails Grid */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  Verified Geotagged Field Photos ({capturedPhotosCount} Attached)
                </h4>
                <span className="text-emerald-700 font-semibold">✓ GPS Tagged & Timestamped</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
                {fieldPhotos.filter((p) => p.captured).map((p, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-24 object-cover" />
                    <div className="p-1.5 text-[10px] bg-slate-50">
                      <p className="font-bold text-slate-900 truncate">{p.direction}</p>
                      <p className="text-slate-500 text-[9px] font-mono">{p.lat}° N, {p.lng}° E</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4 Fee Assessment & Registration Charges (Set at ₹149/acre) */}
            <div className="bg-emerald-950 text-white p-5 sm:p-6 rounded-2xl shadow-xl space-y-4 border border-emerald-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                    <Receipt className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      Registration Fee & Statutory Service Assessment
                    </h4>
                    <p className="text-xs text-emerald-300">
                      Standardized Sovereign Rate: <strong className="text-amber-300">₹149 / Acre</strong> for {acreageForCalc} Registered Acres
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-300 uppercase tracking-widest block font-mono">Total Payable</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">₹{grandTotalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-slate-400 block text-[11px]">1. Soil Testing & Lab:</span>
                  <strong className="text-white font-mono text-sm">₹{soilTestingAmount.toFixed(2)}</strong>
                  <span className="text-[10px] text-emerald-400 block">₹49.00 / ac × {acreageForCalc} ac</span>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-slate-400 block text-[11px]">2. GIS & Drone Inspection:</span>
                  <strong className="text-white font-mono text-sm">₹{inspectionAmount.toFixed(2)}</strong>
                  <span className="text-[10px] text-emerald-400 block">₹50.00 / ac × {acreageForCalc} ac</span>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-slate-400 block text-[11px]">3. Carbon Credit Generator:</span>
                  <strong className="text-white font-mono text-sm">₹{carbonCreditAmount.toFixed(2)}</strong>
                  <span className="text-[10px] text-emerald-400 block">₹35.00 / ac × {acreageForCalc} ac</span>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-slate-400 block text-[11px]">4. File & Deed Processing:</span>
                  <strong className="text-white font-mono text-sm">₹{fileChargesAmount.toFixed(2)}</strong>
                  <span className="text-[10px] text-emerald-400 block">₹15.00 / ac × {acreageForCalc} ac</span>
                </div>
              </div>

              {/* Subtotal & GST Summary Line */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-900/80 text-xs text-slate-300">
                <span>Base Subtotal: <strong className="text-white font-mono">₹{subtotalAmount.toFixed(2)}</strong></span>
                <span>CGST (9%): <strong className="text-white font-mono">₹{cgstAmount.toFixed(2)}</strong></span>
                <span>SGST (9%): <strong className="text-white font-mono">₹{sgstAmount.toFixed(2)}</strong></span>
                <span className="text-amber-300 font-bold">Total GST (18%): ₹{gstAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-800">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                By proceeding to payment, you certify that the uploaded Khasra/Pawti documents and geotagged field photos are authentic. Application will be officially submitted and GST Tax Invoice generated immediately upon payment settlement.
              </span>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={activeStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            {activeStep === STEPS.length - 1 ? (
              <>
                <Wallet className="w-4 h-4" /> Proceed to Payment & Submit (₹{grandTotalAmount.toFixed(2)})
              </>
            ) : (
              <>
                Continue <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* SECURE PAYMENT GATEWAY MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 space-y-0">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Sovereign Agri Payment Gateway</h3>
                  <p className="text-[11px] text-slate-300">256-Bit Encrypted • Direct Verification Settlement</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                disabled={paymentProcessing}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Fee Summary Banner */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Registration & Inspection Fee:</span>
                <span className="text-xs font-bold text-slate-900">{acreageForCalc} Acres @ ₹149/ac + 18% GST</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Total Amount</span>
                <span className="text-xl font-black text-emerald-800 font-mono">₹{grandTotalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'CARD'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>Card / RuPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'NETBANKING'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Landmark className="w-5 h-5 text-emerald-600" />
                  <span>Net Banking</span>
                </button>
              </div>

              {/* UPI Tab Content */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                  <div className="w-32 h-32 bg-white rounded-xl border-2 border-emerald-600 mx-auto p-2 flex items-center justify-center shadow-md">
                    <QrCode className="w-24 h-24 text-slate-900" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Scan QR Code with any UPI App</span>
                    <span className="text-[11px] text-slate-500">GPay, PhonePe, Paytm, BHIM UPI • VPA: <strong>bhumicred@sbi</strong></span>
                  </div>
                </div>
              )}

              {/* Card Tab Content */}
              {paymentMethod === 'CARD' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Card Number</label>
                    <input
                      type="text"
                      disabled
                      value="4532 •••• •••• 8912"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Valid Thru</label>
                      <input
                        type="text"
                        disabled
                        value="12/29"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">CVV</label>
                      <input
                        type="password"
                        disabled
                        value="•••"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking Tab Content */}
              {paymentMethod === 'NETBANKING' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Select Primary Agricultural Bank:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button type="button" className="p-2 rounded-lg border border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold text-left">
                      ✓ State Bank of India (SBI)
                    </button>
                    <button type="button" className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 text-left">
                      Bank of Baroda
                    </button>
                    <button type="button" className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 text-left">
                      HDFC Bank
                    </button>
                    <button type="button" className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 text-left">
                      ICICI Bank
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-5 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                disabled={paymentProcessing}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={paymentProcessing}
                className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {paymentProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Processing Sovereign Payment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Pay ₹{grandTotalAmount.toFixed(2)} & Complete Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
