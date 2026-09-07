import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  CheckCircle2,
  Trash2,
  Star,
  DollarSign,
  Package,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MOCK_PRODUCTS } from '../../../services/mockData/marketplaceMock.js';

export const AdminMarketplacePage = () => {
  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Marketplace & Vendor Catalog Management"
        subtitle="Catalog approvals, vendor commissions, inventory tracking, and quality assurance standards."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Marketplace Master' },
        ]}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Approved Marketplace Products ({MOCK_PRODUCTS.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PRODUCTS.map((prod) => (
            <Card key={prod.id} className="p-6 border border-gray-200 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="success">Active Catalog</Badge>
                  <span className="text-xs text-gray-400 font-mono">ID: {prod.id}</span>
                </div>
                <h4 className="font-bold text-base text-gray-900 line-clamp-1">{prod.name}</h4>
                <p className="text-xs text-emerald-700 font-medium">{prod.seller}</p>

                <div className="my-4 p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Farmer Price:</span>
                    <span className="font-bold text-gray-900">₹{prod.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Platform Commission (5%):</span>
                    <span className="font-semibold text-emerald-700">₹{Math.round(prod.price * 0.05)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                <span className="text-gray-500">Status: In Stock</span>
                <Button variant="outline" size="sm" onClick={() => alert(`Editing product ${prod.id}...`)}>
                  Edit Listing
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
