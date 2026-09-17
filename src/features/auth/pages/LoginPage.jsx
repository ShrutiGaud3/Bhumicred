import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendLoginOtp, setSelectedRole, setTargetMobile } from '../authSlice.js';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Phone, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { ROLES, ROLE_LABELS } from '../../../constants/roles.js';

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

  return (
    <div className="space-y-6">
      {/* Top Header Bar with Back to Role Selection Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => navigate('/role-select')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all group py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-neutral-800/80 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200/80 dark:border-neutral-700"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-emerald-700 dark:text-emerald-400" />
          <span>Change Role</span>
        </button>

        <span className="inline-flex items-center px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-extrabold rounded-full uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
          {ROLE_LABELS[activeRole] || activeRole}
        </span>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Mobile Verification</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your 10-digit registered mobile number to receive a secure one-time passcode for{' '}
          <strong className="text-emerald-700 dark:text-emerald-400">{ROLE_LABELS[activeRole] || activeRole}</strong>
        </p>
      </div>

      <form onSubmit={handleSendOtp} className="space-y-4">
        {(formError || error) && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-2xl text-xs space-y-2 animate-in fade-in duration-200 text-left">
            <div className="font-bold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Portal Access Notice</span>
            </div>
            <p className="leading-relaxed">{formError || error}</p>
            <div className="pt-1 flex items-center gap-3">
              <Link
                to="/role-select"
                className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
              >
                Switch Portal Role →
              </Link>
              <Link
                to={`/register?role=${activeRole}`}
                className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold hover:underline"
              >
                Register as {ROLE_LABELS[activeRole] || activeRole} →
              </Link>
            </div>
          </div>
        )}

        <FormInput
          label="Mobile Number"
          name="mobile"
          type="tel"
          value={mobile}
          prefix="+91"
          maxLength={10}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
            setMobile(val);
            setFormError('');
          }}
          placeholder="98765 43210"
          icon={Phone}
          required
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

      <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 flex flex-col items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div>
          New to BHUMICRED?{' '}
          <Link to={`/register?role=${activeRole}`} className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
            Register / Create Profile
          </Link>
        </div>
      </div>
    </div>
  );
};
