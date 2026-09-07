import React, { useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FormInput } from '../components/forms/FormInput.jsx';
import { FormTextarea } from '../components/forms/FormTextarea.jsx';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Get in Touch
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">Grievance & Support Desk</h1>
        <p className="text-xs text-slate-600">Connect with our support team for platform, verification, or scheme queries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Email Support</h4>
                <p className="text-xs text-slate-500 mt-0.5">support@bhumicred.in</p>
                <p className="text-xs text-slate-500">grievance@bhumicred.gov.in</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Farmer Toll-Free Helpline</h4>
                <p className="text-xs text-slate-500 mt-0.5">1800-BHUMI-CRED (Mon-Sat 9AM-6PM)</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">National Headquarters</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  BHUMICRED Agritech Central, Cyber City, Sector 44, New Delhi - 110001
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-8">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Dispatched</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you. Your inquiry has been registered in the BHUMICRED support desk. Ticket reference #BC-SUP-{Math.floor(10000 + Math.random() * 90000)} has been created.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline" size="sm">
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Full Name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                  <FormInput
                    label="Mobile Number"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10-digit mobile"
                  />
                </div>
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
                <FormTextarea
                  label="Message / Query Details"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry..."
                />
                <Button type="submit" variant="primary" icon={Send} className="w-full">
                  Submit Support Request
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
