import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, CheckCircle2, ShieldCheck, MapPin, Phone, User, ArrowRight, Sparkles, Building } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { setUserStatus, setUser, fetchCurrentUser } from '../../features/auth/authSlice.js';
import { storageService } from '../../services/storageService.js';
import { useToast } from '../ui/ToastContext.jsx';
import { ROLES, ROLE_LABELS } from '../../constants/roles.js';

export const PendingApproval = ({
  roleTitle = 'Farmer Onboarding Profile',
  submittedAt,
  applicationId,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);

  React.useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const isAlreadyApproved = user?.status === 'APPROVED' || user?.status === 'ACTIVE';

  // Automatically navigate to dashboard if already approved
  React.useEffect(() => {
    if (isAlreadyApproved) {
      const timer = setTimeout(() => {
        if (user?.role === ROLES.GOVERNMENT) {
          navigate('/government/dashboard');
        } else if (user?.role === ROLES.PARTNER) {
          navigate('/partner/dashboard');
        } else {
          navigate('/farmer/dashboard');
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isAlreadyApproved, user?.role, navigate]);

  const handleRefreshStatus = async () => {
    try {
      const resultAction = await dispatch(fetchCurrentUser());
      if (fetchCurrentUser.fulfilled.match(resultAction)) {
        const u = resultAction.payload?.user || resultAction.payload;
        if (u?.status === 'APPROVED' || u?.status === 'ACTIVE') {
          toast.success('Your profile has been Approved & Activated! Opening dashboard...');
          navigate('/farmer/dashboard');
          return;
        }
      }
      toast.info('Application is still pending review by the Administration.');
    } catch {
      window.location.reload();
    }
  };

  const handleSimulateAdminApproval = () => {
    // 1. Update current user status to APPROVED
    dispatch(setUserStatus('APPROVED'));

    // 2. Find and update any matching approval item in storageService
    const approvals = storageService.getApprovals();
    const matchingApp = approvals.find(
      (a) => a.applicantPhone === user?.mobile || a.targetId === user?.id || a.applicationId === user?.applicationId
    );
    if (matchingApp) {
      storageService.updateApprovalStatus(matchingApp.id, 'APPROVED', 'Verified by Super Admin Controller');
    }

    toast.success('Application Approved! Profile is now active.');
    
    // Redirect to relevant dashboard
    if (user?.role === ROLES.GOVERNMENT) {
      navigate('/government/dashboard');
    } else if (user?.role === ROLES.PARTNER) {
      navigate('/partner/dashboard');
    } else {
      navigate('/farmer/dashboard');
    }
  };

  const handleGoToAdminQueue = () => {
    // Switch to Super Admin demo persona and navigate to approvals queue
    dispatch(setUser({
      id: 'usr_admin_01',
      name: 'Vikram Singh',
      mobile: '+91 99000 11223',
      role: ROLES.SUPER_ADMIN,
      kycStatus: 'APPROVED',
      status: 'APPROVED',
      isLoggedIn: true,
    }));
    toast.info('Switched to Super Admin mode to review Approvals Queue');
    navigate('/admin/approvals');
  };

  return (
    <div className="max-w-2xl mx-auto my-6 p-6 sm:p-8 bg-white rounded-3xl border border-amber-200/80 shadow-2xl text-center animate-in fade-in duration-200">
      {/* Icon Status */}
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
        isAlreadyApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse'
      }`}>
        {isAlreadyApproved ? <CheckCircle2 className="w-9 h-9" /> : <Clock className="w-9 h-9" />}
      </div>

      <span className={`inline-block px-3.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider mb-2 border ${
        isAlreadyApproved 
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
          : 'bg-amber-50 text-amber-800 border-amber-200'
      }`}>
        {isAlreadyApproved ? 'Profile Verified & Active' : 'Application Under Review'}
      </span>

      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
        {isAlreadyApproved ? 'Application Approved!' : `${roleTitle} Submitted`}
      </h2>

      <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-lg mx-auto leading-relaxed">
        {isAlreadyApproved 
          ? 'Your BHUMICRED account has been verified and approved by the Administration. You now have full sovereign access to the portal dashboard.'
          : 'Your registration particulars have been securely recorded and dispatched to the BHUMICRED Administrative Verification Desk.'}
      </p>

      {/* Profile Particulars Card */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 mb-6 border border-slate-200/80 text-left space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="font-semibold text-slate-600">Application Reference ID:</span>
          <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            {applicationId || user?.applicationId || 'BC-APP-883921'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-slate-200">
          <div>
            <span className="text-slate-500 block text-[11px]">Applicant Name:</span>
            <span className="font-bold text-slate-900">{user?.name || 'Citizen Applicant'}</span>
          </div>
          {user?.fatherName && (
            <div>
              <span className="text-slate-500 block text-[11px]">Father's / Husband's Name:</span>
              <span className="font-semibold text-slate-900">{user.fatherName}</span>
            </div>
          )}
          <div>
            <span className="text-slate-500 block text-[11px]">Registered Mobile:</span>
            <span className="font-mono font-semibold text-slate-900">{user?.mobile || 'Verified Mobile'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Portal Role:</span>
            <span className="font-bold text-emerald-800">{ROLE_LABELS[user?.role] || user?.role || 'Farmer'}</span>
          </div>
        </div>

        {/* Address Hierarchy if available */}
        {user?.address && (
          <div className="pb-2 border-b border-slate-200 space-y-1">
            <span className="text-slate-500 block text-[11px]">Sovereign Geographic Hierarchy:</span>
            <p className="font-medium text-slate-800 bg-white p-2 rounded-xl border border-slate-200">
              {user.address.gramPanchayat}, {user.address.city}, Dist: {user.address.district}, {user.address.state} — {user.address.pincode}, {user.address.country}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 pt-1">
          <span>Reviewing Authority: <strong>BHUMICRED National Nodal Desk</strong></span>
          <span>Submitted: <strong>{submittedAt || user?.submittedAt || 'Today'}</strong></span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {isAlreadyApproved ? (
          <Button
            onClick={() => navigate('/farmer/dashboard')}
            variant="primary"
            size="lg"
            className="w-full bg-emerald-700 hover:bg-emerald-800"
            icon={ArrowRight}
          >
            Access Full Farmer Dashboard
          </Button>
        ) : (
          <>
            {/* Interactive Demo Simulation Tools */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Admin Approval Simulation (Frontend Demo)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                In production, an Administrator reviews this application in the Admin Portal. For this demonstration, you can simulate instant approval or switch to Super Admin mode:
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Button
                  onClick={handleSimulateAdminApproval}
                  variant="primary"
                  size="sm"
                  className="bg-emerald-700 hover:bg-emerald-800 w-full sm:w-auto"
                  icon={CheckCircle2}
                >
                  Simulate Admin Approval & Open Dashboard
                </Button>
                <Button
                  onClick={handleGoToAdminQueue}
                  variant="outline"
                  size="sm"
                  className="border-emerald-300 text-emerald-800 hover:bg-emerald-100 w-full sm:w-auto"
                  icon={ShieldCheck}
                >
                  Open Admin Approvals Queue
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button onClick={handleRefreshStatus} variant="outline" size="sm">
                Refresh Status
              </Button>
              <Button onClick={() => navigate('/login')} variant="outline" size="sm">
                Back to Sign In
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
