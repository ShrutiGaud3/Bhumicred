import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendLoginOtp, setSelectedRole, setTargetMobile } from '../authSlice.js';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Phone, ArrowRight, Sparkles, Shield, UserCheck } from 'lucide-react';
import { ROLES, ROLE_LABELS } from '../../../constants/roles.js';
import { DEMO_PREFILLS } from '../../../constants/appConstants.js';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const roleFromQuery = searchParams.get('role');
  const { selectedRole, isLoading, error } = useSelector((state) => state.auth);

  const [mobile, setMobile] = useState('');
  const [formError, setFormError] = useState('');

  const activeRole = roleFromQuery || selectedRole || ROLES.FARMER;

  useEffect(() => {
    if (roleFromQuery) {
      dispatch(setSelectedRole(roleFromQuery));
    }
  }, [roleFromQuery, dispatch]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setFormError('');

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }

    dispatch(setTargetMobile(cleanMobile));
    const result = await dispatch(sendLoginOtp({ mobile: cleanMobile, role: activeRole }));

    if (sendLoginOtp.fulfilled.match(result)) {
      navigate('/otp-verify');
    }
  };

  const handleQuickDemo = (demo) => {
    setMobile(demo.mobile);
    dispatch(setSelectedRole(demo.role));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2 border border-emerald-100">
          {ROLE_LABELS[activeRole] || activeRole}
        </span>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Mobile Verification</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your 10-digit registered mobile number to receive a secure one-time passcode
        </p>
      </div>

      <form onSubmit={handleSendOtp} className="space-y-4">
        <FormInput
          label="Mobile Number"
          name="mobile"
          type="tel"
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value);
            setFormError('');
          }}
          placeholder="e.g. 9876543210"
          icon={Phone}
          required
          error={formError || error}
          helperText="We will send a 6-digit OTP to verify your identity"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
          icon={ArrowRight}
        >
          Send One-Time Password
        </Button>
      </form>

      {/* Quick Demo Selector for seamless testing */}
      <div className="pt-4 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-1 text-emerald-700">
            <Sparkles className="w-3.5 h-3.5" />
            Quick Demo Profiles
          </span>
          <span>Click to fill</span>
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {DEMO_PREFILLS.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickDemo(demo)}
              className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/70 hover:border-emerald-300 text-xs flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700" />
                <span className="font-semibold text-slate-700 group-hover:text-slate-900">{demo.label}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400 group-hover:text-emerald-800">{demo.mobile}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-slate-500">
        Need to change your role?{' '}
        <Link to="/role-select" className="font-bold text-emerald-700 hover:underline">
          Select Role
        </Link>
      </div>
    </div>
  );
};
