import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendLoginOtp, setSelectedRole, setTargetMobile } from '../authSlice.js';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Phone, ArrowRight, Shield } from 'lucide-react';
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

      <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-2 text-xs text-slate-500">
        <div>
          New to BHUMICRED?{' '}
          <Link to="/register" className="font-bold text-emerald-700 hover:underline">
            Register / Create Profile
          </Link>
        </div>
        <div>
          Need to change your role?{' '}
          <Link to="/role-select" className="font-bold text-emerald-700 hover:underline">
            Select Role
          </Link>
        </div>
      </div>
    </div>
  );
};
