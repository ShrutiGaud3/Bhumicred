import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyLoginOtp, sendLoginOtp } from '../authSlice.js';
import { OtpInput } from '../../../components/forms/OtpInput.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { ArrowLeft, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { ROLES } from '../../../constants/roles.js';

export const OtpVerifyPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { targetMobile, selectedRole, devOtp, isLoading, error } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState(devOtp || '');
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!targetMobile) {
      navigate('/login');
    }
  }, [targetMobile, navigate]);

  useEffect(() => {
    if (devOtp) {
      setOtp(devOtp);
    }
  }, [devOtp]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) return;

    const result = await dispatch(
      verifyLoginOtp({
        mobile: targetMobile,
        otp,
        role: selectedRole,
      })
    );

    if (verifyLoginOtp.fulfilled.match(result)) {
      const user = result.payload.user;

      // Role-based destination routing based on real DB role
      if (
        user.role === ROLES.SUPER_ADMIN ||
        user.role === ROLES.OPERATIONS_ADMIN ||
        user.role === ROLES.VERIFICATION_ADMIN ||
        user.role === ROLES.FINANCE_ADMIN ||
        user.role === ROLES.ADMIN_STAFF
      ) {
        navigate('/admin/dashboard');
      } else if (user.role === ROLES.GOVERNMENT) {
        navigate('/government/dashboard');
      } else if (user.role === ROLES.PARTNER) {
        navigate('/partner/dashboard');
      } else {
        navigate('/farmer/dashboard');
      }
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    await dispatch(sendLoginOtp({ mobile: targetMobile, role: selectedRole }));
    setCountdown(30);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => navigate(`/login?role=${selectedRole || 'FARMER'}`)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all group py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-neutral-800/80 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200/80 dark:border-neutral-700"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-emerald-700 dark:text-emerald-400" />
          <span>Change Number</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/role-select')}
          className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          Change Role
        </button>
      </div>

      <div className="text-center">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Enter Verification Code</h2>
        <p className="text-xs text-slate-500 mt-1">
          Sent to <span className="font-bold text-slate-800 font-mono">+91 {targetMobile}</span>
        </p>
      </div>

      {devOtp && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Development Mode OTP:</span>
          </div>
          <span className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-amber-200">
            {devOtp}
          </span>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-2xl text-xs space-y-2 animate-in fade-in duration-200 text-left">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Authentication Notice</span>
            </div>
            <p className="leading-relaxed">{error}</p>
            <div className="pt-1">
              <Link
                to="/role-select"
                className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
              >
                Switch Portal Role →
              </Link>
            </div>
          </div>
        )}

        <OtpInput
          length={6}
          value={otp}
          onChange={setOtp}
          disabled={isLoading}
          error={error}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
          disabled={otp.length !== 6}
        >
          Verify & Enter Portal
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Edit Number
        </button>

        <button
          onClick={handleResendOtp}
          disabled={countdown > 0}
          className={`flex items-center gap-1 font-semibold ${
            countdown > 0
              ? 'text-slate-400 cursor-not-allowed'
              : 'text-emerald-700 hover:text-emerald-800'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
        </button>
      </div>
    </div>
  );
};
