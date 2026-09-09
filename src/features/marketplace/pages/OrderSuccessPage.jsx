import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  ArrowRight,
  Download,
  Calendar,
  MapPin,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { marketplaceService } from '../services/marketplaceService.js';

export const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('orderId') || 'ORD-2026-8819';
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (orderId) {
        try {
          const res = await marketplaceService.getOrderById(orderId);
          if (res.data) {
            setOrder(res.data);
          }
        } catch (e) {
          console.warn('Could not fetch order details for success screen:', e);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [orderId]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
        <PackageCheck className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-black text-gray-900">Order Placed Successfully!</h2>
        <p className="text-gray-600 text-sm">
          Thank you for ordering with BHUMICRED Sovereign Marketplace. Your order reference is{' '}
          <strong className="font-mono text-emerald-700 font-bold">{order?.orderNumber || orderId}</strong>.
        </p>
      </div>

      {/* Order Info Card */}
      <Card className="text-left p-6 space-y-4 bg-slate-50 border-slate-200 text-sm">
        <div className="flex justify-between pb-3 border-b border-gray-200">
          <span className="text-gray-500">Order Reference</span>
          <span className="font-mono font-bold text-gray-900">{order?.orderNumber || orderId}</span>
        </div>
        <div className="flex justify-between pb-3 border-b border-gray-200">
          <span className="text-gray-500">Estimated Farm Delivery</span>
          <span className="font-bold text-emerald-700 flex items-center gap-1.5">
            <Truck className="w-4 h-4" /> {order?.fulfillment?.estimatedDelivery || '3-5 Business Days'}
          </span>
        </div>
        <div className="flex justify-between pb-3 border-b border-gray-200">
          <span className="text-gray-500">Delivery Destination</span>
          <span className="font-semibold text-gray-900 text-right">
            {order?.deliveryAddress?.landName ? `${order.deliveryAddress.landName} • ` : ''}
            {order?.deliveryAddress?.addressLine || 'Farm Gate Address'}, {order?.deliveryAddress?.district || 'Anand'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Payment Mode</span>
          <span className="font-bold text-emerald-600 uppercase">
            {order?.payment?.method || 'WALLET'} • {order?.payment?.status || 'PAID'}
          </span>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Button
          variant="primary"
          onClick={() => navigate('/marketplace/orders')}
          className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800"
        >
          Track My Orders <ArrowRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/marketplace')}
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
