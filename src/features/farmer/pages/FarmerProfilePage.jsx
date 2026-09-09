import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { User, MapPin, ShieldCheck, Phone, Mail, Award, CheckCircle2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { setUser } from '../../auth/authSlice.js';
import { storageService } from '../../../services/storageService.js';

export const FarmerProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSave = (e) => {
    e.preventDefault();
    if (user) {
      const updatedUser = {
        ...user,
        name: profile.name,
        fatherName: profile.fatherName,
        email: profile.email,
        address: {
          ...user.address,
          gramPanchayat: profile.village,
          city: profile.taluk,
          district: profile.district,
          state: profile.state,
          pincode: profile.pincode,
        },
      };
      dispatch(setUser(updatedUser));
      storageService.saveRegisteredUser(updatedUser);
    }
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
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
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left ID Card */}
        <Card className="p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md">
            {profile.name[0]}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">{profile.name}</h3>
            <p className="text-xs text-slate-500">{profile.village}, {profile.district}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">KYC Status:</span>
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
              </span>
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
              />
              <FormInput
                label="Father's Name"
                disabled={!isEditing}
                value={profile.fatherName}
                onChange={(e) => setProfile({ ...profile, fatherName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Mobile Number"
                disabled
                value={profile.mobile}
                helperText="Verified via OTP"
              />
              <FormInput
                label="Email Address"
                disabled={!isEditing}
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput
                label="Village"
                disabled={!isEditing}
                value={profile.village}
                onChange={(e) => setProfile({ ...profile, village: e.target.value })}
              />
              <FormInput
                label="Taluk"
                disabled={!isEditing}
                value={profile.taluk}
                onChange={(e) => setProfile({ ...profile, taluk: e.target.value })}
              />
              <FormInput
                label="District"
                disabled={!isEditing}
                value={profile.district}
                onChange={(e) => setProfile({ ...profile, district: e.target.value })}
              />
            </div>

            {isEditing && (
              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="primary" icon={CheckCircle2}>
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
