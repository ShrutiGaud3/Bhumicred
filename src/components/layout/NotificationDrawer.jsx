import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  ShieldAlert,
  Sprout,
  Clock,
  CheckCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { StatusBadge } from '../ui/StatusBadge.jsx';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    role: 'FARMER',
    title: 'Soil Health Card Ready',
    message: 'NABL Certified laboratory has uploaded your 12-parameter soil health report for Khasra 412/1.',
    category: 'Soil',
    time: '10 mins ago',
    read: false,
    priority: 'HIGH',
    link: '/farmer/soil/report/soil_001',
    icon: Sprout,
    iconColor: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60'
  },
  {
    id: 'notif_2',
    role: 'FARMER',
    title: 'Claim Settlement Disbursed',
    message: 'Insurance claim payout of ₹48,000 has been credited to your BHUMICRED Smart Wallet.',
    category: 'Finance',
    time: '2 hours ago',
    read: false,
    priority: 'HIGH',
    link: '/farmer/wallet',
    icon: DollarSign,
    iconColor: 'text-amber-600 bg-amber-100 dark:bg-amber-950/60'
  },
  {
    id: 'notif_3',
    role: 'FARMER',
    title: 'Land Verification In Progress',
    message: 'Revenue Officer assigned to verify your cadastral Naksha for Parcel #LND-9082.',
    category: 'Land',
    time: 'Yesterday',
    read: true,
    priority: 'NORMAL',
    link: '/farmer/application-status/APP-7821',
    icon: FileText,
    iconColor: 'text-blue-600 bg-blue-100 dark:bg-blue-950/60'
  },
  {
    id: 'notif_4',
    role: 'GOVERNMENT',
    title: 'New Community Land Demarcation',
    message: 'Gaon Sabha plot #44/2 registered in Kheda block awaiting nodal allocation audit.',
    category: 'Land',
    time: '25 mins ago',
    read: false,
    priority: 'HIGH',
    link: '/government/assets',
    icon: FileText,
    iconColor: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/60'
  },
  {
    id: 'notif_5',
    role: 'PARTNER',
    title: 'Urgent Drone Survey Assigned',
    message: 'Tree census survey in Anand Cluster assigned. Scheduled deadline: 48 hours.',
    category: 'Tasks',
    time: '1 hour ago',
    read: false,
    priority: 'HIGH',
    link: '/partner/tasks',
    icon: AlertTriangle,
    iconColor: 'text-amber-600 bg-amber-100 dark:bg-amber-950/60'
  },
  {
    id: 'notif_6',
    role: 'SUPER_ADMIN',
    title: 'High-Value Claim Approval Required',
    message: 'Storm damage claim of ₹1,45,000 pending final underwriter sign-off.',
    category: 'Approvals',
    time: '15 mins ago',
    read: false,
    priority: 'HIGH',
    link: '/admin/approvals',
    icon: ShieldAlert,
    iconColor: 'text-rose-600 bg-rose-100 dark:bg-rose-950/60'
  }
];

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role || 'FARMER';

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'UNREAD', 'PRIORITY'

  if (!isOpen) return null;

  // Filter notifications for current user's role or system
  const roleNotifications = notifications.filter(
    (n) => n.role === userRole || userRole === 'SUPER_ADMIN'
  );

  const displayedNotifications = roleNotifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'PRIORITY') return n.priority === 'HIGH';
    return true;
  });

  const unreadCount = roleNotifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.role === userRole || userRole === 'SUPER_ADMIN' ? { ...n, read: true } : n))
    );
  };

  const handleItemClick = (notif) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    onClose();
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-in Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col border-l border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                    {unreadCount} New
                  </span>
                )}
              </h2>
              <p className="text-xs text-neutral-500">Live platform alerts & updates</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Quick Action */}
        <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'UNREAD', label: `Unread (${unreadCount})` },
              { id: 'PRIORITY', label: 'High Priority' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === tab.id
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {displayedNotifications.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <Bell className="w-12 h-12 mx-auto stroke-1 text-neutral-300 dark:text-neutral-700 mb-2" />
              <p className="text-sm font-medium">No notifications in this view</p>
              <p className="text-xs text-neutral-500 mt-1">You are all caught up!</p>
            </div>
          ) : (
            displayedNotifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                    notif.read
                      ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 opacity-80'
                      : 'bg-primary-50/40 dark:bg-primary-950/20 border-primary-200 dark:border-primary-800/60 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${notif.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wider">
                            {notif.category}
                          </span>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-primary-600"></span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notif.time}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                        <span className="text-[11px] font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1 group">
                          View details
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>

                        {notif.priority === 'HIGH' && (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                            URGENT
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-between text-xs text-neutral-500">
          <span>Active Role: <strong className="text-neutral-800 dark:text-neutral-200">{userRole}</strong></span>
          <button
            onClick={onClose}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </>
  );
};
