import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
  ArrowRight,
  ShoppingBag,
  RefreshCw,
  Printer,
  MapPin,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { Timeline } from '../../../components/ui/Timeline.jsx';
import { marketplaceService } from '../services/marketplaceService.js';

export const OrdersListPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const res = await marketplaceService.getOrders();
        if (res.data) {
          setOrders(res.data);
        }
      } catch (e) {
        console.warn('Failed to load user marketplace orders:', e);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="My Marketplace Orders"
        subtitle="Track farm gate deliveries, view tracking timelines, and re-order supplies."
        backTo="/marketplace"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Marketplace', path: '/marketplace' },
          { label: 'Orders' },
        ]}
        actions={
          <Button
            variant="primary"
            className="bg-emerald-700 hover:bg-emerald-800"
            onClick={() => navigate('/marketplace')}
          >
            Shop More Products
          </Button>
        }
      />

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
          <p className="text-sm font-semibold">Loading your order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-16 text-center border-dashed border-2 border-gray-200">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">No Orders Found</h3>
          <p className="text-xs text-gray-500 mb-6">You haven't placed any orders on the sovereign marketplace yet.</p>
          <Button
            variant="primary"
            className="bg-emerald-700 hover:bg-emerald-800"
            onClick={() => navigate('/marketplace')}
          >
            Explore Marketplace Catalog
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderId = order._id || order.id;
            const status = order.fulfillment?.status || order.status || 'CONFIRMED';
            const totalAmount = order.billing?.totalAmount ?? order.totalAmount ?? 0;
            const estDelivery = order.fulfillment?.estimatedDelivery || order.estimatedDelivery || '3-5 Business Days';
            const items = order.items || [];

            return (
              <Card key={orderId} className="p-6 border border-gray-200 hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-gray-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {order.orderNumber}
                      </span>
                      <StatusBadge status={status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                      <span>Placed on: {new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                      <span>•</span>
                      <span>
                        Est. Delivery: <strong className="text-gray-800">{estDelivery}</strong>
                      </span>
                      {order.deliveryAddress?.landName && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">
                            Plot: {order.deliveryAddress.landName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">Total Paid</span>
                      <span className="text-xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Truck className="w-3.5 h-3.5 text-emerald-600" /> Track Order
                    </Button>
                  </div>
                </div>

                {/* Items in order */}
                <div className="pt-4 space-y-2">
                  {items.map((item, idx) => {
                    const price = item.unitPrice ?? item.price ?? 0;
                    const subtotal = item.subtotal ?? price * (item.quantity || 1);

                    return (
                      <div key={idx} className="flex justify-between items-center text-xs text-gray-700">
                        <span className="font-medium">
                          {item.quantity} × {item.name}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ₹{subtotal.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tracking Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Delivery Tracking: ${selectedOrder.orderNumber}`}
        >
          <div className="space-y-6 py-2">
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Logistics Courier:</span>
                <span className="font-bold text-gray-900">
                  {selectedOrder.fulfillment?.courier || selectedOrder.courier || 'Kisan Express Logistics'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">AWB / Tracking Ref:</span>
                <span className="font-mono font-bold text-emerald-800">
                  {selectedOrder.fulfillment?.trackingNumber || 'KEL-881902'}
                </span>
              </div>
              <div className="flex justify-between items-start pt-1 border-t border-gray-200">
                <span className="text-gray-500">Delivery Destination:</span>
                <span className="font-semibold text-gray-900 text-right max-w-xs">
                  {selectedOrder.deliveryAddress?.landName ? `${selectedOrder.deliveryAddress.landName}, ` : ''}
                  {selectedOrder.deliveryAddress?.addressLine || 'Farm Gate Address'}, {selectedOrder.deliveryAddress?.district || 'Anand'}
                </span>
              </div>
            </div>

            {selectedOrder.timeline && selectedOrder.timeline.length > 0 ? (
              <Timeline
                events={selectedOrder.timeline.map((step) => ({
                  title: step.title,
                  timestamp: step.timestamp ? new Date(step.timestamp).toLocaleString('en-GB') : step.title,
                  completed: step.completed,
                }))}
              />
            ) : (
              <div className="p-4 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-medium">
                Package processed and dispatched for farm-gate transit.
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => window.print()}
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSelectedOrder(null)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrdersListPage;
