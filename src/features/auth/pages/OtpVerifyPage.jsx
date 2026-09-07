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

      // Role-based destination routing
      if (user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN_STAFF) {
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
