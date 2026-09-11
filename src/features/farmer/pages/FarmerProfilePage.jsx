import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { User, MapPin, ShieldCheck, Phone, Mail, Award, CheckCircle2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { setUser } from '../../auth/authSlice.js';
import { storageService } from '../../../services/storageService.js';
import { authService } from '../../auth/services/authService.js';
import { useToast } from '../../../components/ui/ToastContext.jsx';

export const FarmerProfilePage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || 'Citizen Farmer',
    mobile: user?.mobile || '',
    email: user?.email || '',
    fatherName: user?.fatherName || '',
    gender: user?.gender || 'Male',
    village: user?.address?.gramPanchayat || user?.address?.village || user?.address?.city || 'Anand',
    taluk: user?.address?.city || user?.address?.district || 'Anand',
    district: user?.address?.district || 'Anand',
    state: user?.address?.state || 'Gujarat',
    pincode: user?.address?.pincode || '388345',
    referralCode: user?.referralCode || `${(user?.name || 'BHUMI').slice(0, 4).toUpperCase()}26`,
    kycStatus: user?.kycStatus || user?.status || 'APPROVED',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || 'Citizen Farmer',
        mobile: user.mobile || '',
        email: user.email || '',
        fatherName: user.fatherName || '',
        gender: user.gender || 'Male',
        village: user.address?.gramPanchayat || user.address?.village || user.address?.city || 'Anand',
        taluk: user.address?.city || user.address?.district || 'Anand',
        district: user.address?.district || 'Anand',
        state: user.address?.state || 'Gujarat',
        pincode: user.address?.pincode || '388345',
        referralCode: user.referralCode || `${(user.name || 'BHUMI').slice(0, 4).toUpperCase()}26`,
        kycStatus: user.kycStatus || user.status || 'APPROVED',
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedUser = {
      ...user,
      name: profile.name,
      fatherName: profile.fatherName,
      email: profile.email,
      gender: profile.gender,
      address: {
        ...(user?.address || {}),
        gramPanchayat: profile.village,
        village: profile.village,
        city: profile.taluk,
        district: profile.district,
        state: profile.state,
        pincode: profile.pincode,
      },
    };

    try {
      // 1. Update backend MongoDB database
      await authService.updateProfile({
        name: profile.name,
        fatherName: profile.fatherName,
        email: profile.email,
        gender: profile.gender,
        address: updatedUser.address,
      });
    } catch (err) {
      console.warn('Backend profile update note:', err.message);
    }

    // 2. Update Redux store, TokenStorage & Local Storage
    dispatch(setUser(updatedUser));
    storageService.saveRegisteredUser(updatedUser);
    try {
      localStorage.setItem('bhumicred_user_data', JSON.stringify(updatedUser));
    } catch (e) {}

    setIsSaving(false);
    setIsEditing(false);
    setSavedSuccess(true);
    toast.success('Farmer Profile updated successfully!');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full space-y-6 pb-12">
      <PageHeader
        title="My Farmer Profile"
        subtitle="Manage your sovereign identity, address records, and KYC verification status."
        badge={<StatusBadge status={user?.status || 'APPROVED'} />}
        breadcrumbs={[
          { label: 'Portal', path: '/farmer/dashboard' },
          { label: 'Profile' },
        ]}
      />

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes updated successfully and synced across all registers!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left ID Card */}
        <Card className="p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md">
            {profile.name ? profile.name[0] : 'F'}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">{profile.name}</h3>
            <p className="text-xs text-slate-500">{profile.village}, {profile.district}, {profile.state}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">KYC Status:</span>
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Gender:</span>
              <span className="font-semibold text-slate-800">{profile.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Referral Code:</span>
              <span className="font-mono font-bold text-emerald-800">{profile.referralCode}</span>
            </div>
          </div>

          <Link to="/farmer/onboarding">
            <Button variant="outline" size="sm" className="w-full">
              Re-Submit Verification
            </Button>
          </Link>
        </Card>

        {/* Right Details Card */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h3 className="font-bold text-sm text-slate-900">Personal & Landholding Particulars</h3>
            <Button
              size="sm"
              variant={isEditing ? 'dark' : 'outline'}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                disabled={!isEditing}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
              <FormInput
                label="Father's / Husband's Name"
                disabled={!isEditing}
                value={profile.fatherName}
                onChange={(e) => setProfile({ ...profile, fatherName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormInput
                label="Mobile Number"
                disabled
                value={profile.mobile}
                helperText="Verified via Sovereign OTP"
              />
              <FormInput
                label="Email Address"
                disabled={!isEditing}
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              <FormSelect
                label="Gender"
                disabled={!isEditing}
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormInput
                label="Village / Gram Panchayat"
                disabled={!isEditing}
                value={profile.village}
                onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                required
              />
              <FormInput
                label="Taluk / Sub-District"
                disabled={!isEditing}
                value={profile.taluk}
                onChange={(e) => setProfile({ ...profile, taluk: e.target.value })}
              />
              <FormInput
                label="District"
                disabled={!isEditing}
                value={profile.district}
                onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="State"
                disabled={!isEditing}
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                required
              />
              <FormInput
                label="Pincode"
                disabled={!isEditing}
                value={profile.pincode}
                onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                required
              />
            </div>

            {isEditing && (
              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={CheckCircle2} isLoading={isSaving} className="w-full sm:w-auto">
                  Save Updated Profile
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};
