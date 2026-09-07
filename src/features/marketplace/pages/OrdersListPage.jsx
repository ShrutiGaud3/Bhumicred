import React, { useState } from 'react';
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
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { Timeline } from '../../../components/ui/Timeline.jsx';

const MOCK_ORDERS = [
  {
    id: 'ord_101',
    orderNumber: 'ORD-2026-8819',
    createdAt: '2026-09-07T11:45:00Z',
    status: 'PROCESSING',
    totalAmount: 8350,
    items: [
      { name: 'Tissue-Cultured Red Sandalwood Saplings (Pack of 25)', quantity: 2, price: 3750 },
      { name: 'Bio-Dynamic Liquid Organic Compost (5 Liters)', quantity: 1, price: 850 },
    ],
    deliveryAddress: 'Shree Ram Farm, Survey 402/A, Mogri, Anand - 388345',
    courier: 'Kisan Express Logistics (Tracking: KEL-8819-01)',
    estimatedDelivery: '11 Sep 2026',
    timeline: [
      { title: 'Order Placed & Payment Verified', timestamp: '07 Sep 2026, 11:45 AM', completed: true },
      { title: 'Sapling Nursery Packing & Phytosanitary Clearance', timestamp: '07 Sep 2026, 02:30 PM', completed: true },
      { title: 'Dispatched via Temperature Controlled Transit', timestamp: 'In Progress', completed: false, current: true },
      { title: 'Out for Delivery to Farm Gate', timestamp: 'Expected 11 Sep', completed: false },
    ],
  },
  {
    id: 'ord_100',
    orderNumber: 'ORD-2026-7102',
    createdAt: '2026-07-15T14:10:00Z',
    status: 'DELIVERED',
    totalAmount: 6499,
    items: [
      { name: 'Automated Solar Drip Controller with Soil Moisture Sensor', quantity: 1, price: 6499 },
    ],
    deliveryAddress: 'Shree Ram Farm, Survey 402/A, Mogri, Anand - 388345',
    courier: 'BlueDart Agri Express (Tracking: BD-440219)',
    estimatedDelivery: '18 Jul 2026',
    timeline: [
      { title: 'Order Placed', timestamp: '15 Jul 2026', completed: true },
      { title: 'Shipped from Hub', timestamp: '16 Jul 2026', completed: true },
      { title: 'Delivered & Installed at Farm', timestamp: '18 Jul 2026', completed: true },
    ],
  },
];

export const OrdersListPage = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="My Marketplace Orders"
        subtitle="Track farm deliveries, download GST invoices, and re-order supplies."
        backTo="/marketplace"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Marketplace', path: '/marketplace' },
          { label: 'Orders' },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/marketplace')}
          >
            Shop More Products
          </Button>
        }
      />

      <div className="space-y-4">
        {MOCK_ORDERS.map((order) => (
          <Card key={order.id} className="p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {order.orderNumber}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                  <span>Placed on: {new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                  <span>•</span>
                  <span>Est. Delivery: <strong className="text-gray-800">{order.estimatedDelivery}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Total Paid</span>
                  <span className="text-xl font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                >
                  Track Order
                </Button>
              </div>
            </div>

            {/* Items in order */}
            <div className="pt-4 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs text-gray-700">
                  <span className="font-medium">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Tracking Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Track Delivery: ${selectedOrder.orderNumber}`}
        >
          <div className="space-y-6 py-2">
            <div className="p-4 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Logistics Partner:</span>
                <span className="font-bold text-gray-900">{selectedOrder.courier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Destination:</span>
                <span className="font-semibold text-gray-900">{selectedOrder.deliveryAddress}</span>
              </div>
            </div>

            <Timeline
              events={selectedOrder.timeline.map((step) => ({
                title: step.title,
                timestamp: step.timestamp,
                completed: step.completed,
              }))}
            />

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
