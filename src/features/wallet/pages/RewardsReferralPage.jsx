import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Users,
  Copy,
  Check,
  Sparkles,
  Share2,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { applyCoupon } from '../../marketplace/marketplaceSlice.js';

export const RewardsReferralPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { wallet } = useSelector((state) => state.wallet);

  const [copied, setCopied] = useState(false);
  const [invitePhone, setInvitePhone] = useState('');
  const [invitedSuccess, setInvitedSuccess] = useState(false);

  const cleanName = (user?.name || user?.fullName || 'FARMER').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  const referralCode = `BHUMI-${cleanName}-402`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!invitePhone) return;
    setInvitedSuccess(true);
    setInvitePhone('');
    setTimeout(() => setInvitedSuccess(false), 3000);
  };

  const handleRedeemPoints = () => {
    dispatch(applyCoupon(referralCode));
    navigate('/marketplace');
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Rewards & Farmer Referral Hub"
        subtitle="Invite fellow farmers, earn reward points, and redeem for free soil tests and marketplace discounts."
        backTo="/farmer/wallet"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Wallet', path: '/farmer/wallet' },
          { label: 'Rewards & Referrals' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Referral Card */}
        <Card className="p-6 md:p-8 md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Your Unique Referral Code</h3>
              <p className="text-xs text-gray-500">
                Earn ₹500 directly in your wallet for every farmer who registers land.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
            <span className="font-mono text-xl font-black text-emerald-800 tracking-wider">
              {referralCode}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 shrink-0"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </Button>
          </div>

          {/* SMS / WhatsApp Invite */}
          <form onSubmit={handleSendInvite} className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-gray-700 uppercase">
              Send SMS Invite to Farmer's Mobile
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <FormInput
                  placeholder="Enter 10-digit mobile number"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  className="text-sm"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full sm:w-auto shrink-0 justify-center">
                Send Invite
              </Button>
            </div>
            {invitedSuccess && (
              <p className="text-xs text-emerald-700 font-semibold">
                ✓ Invitation SMS with download link dispatched successfully!
              </p>
            )}
          </form>
        </Card>

        {/* Reward Points */}
        <Card className="p-6 md:p-8 bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-0 flex flex-col justify-between">
          <div className="space-y-3">
            <Sparkles className="w-8 h-8 text-emerald-400" />
            <h4 className="text-sm font-semibold text-emerald-200 uppercase">Reward Points Balance</h4>
            <p className="text-4xl font-black">{(wallet?.rewardPoints || 3200).toLocaleString()} <span className="text-sm font-medium text-emerald-300">Pts</span></p>
            <p className="text-xs text-emerald-200">
              Worth <strong>₹{Math.round((wallet?.rewardPoints || 3200) / 10)}</strong> discount at checkout or 1 Free Standard Soil Test.
            </p>
          </div>

          <Button
            variant="secondary"
            className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold mt-6"
            onClick={handleRedeemPoints}
          >
            Redeem at Marketplace
          </Button>
        </Card>
      </div>
    </div>
  );
};
