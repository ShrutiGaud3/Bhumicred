import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  ExternalLink,
  ShoppingBag,
  Award,
  LifeBuoy,
  RefreshCw,
  Info,
  ArrowRight,
} from 'lucide-react';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../features/notifications/notificationSlice.js';
import { Button } from '../ui/Button.jsx';

const getCategoryMeta = (category) => {
  const cat = (category || 'SYSTEM').toUpperCase();
  switch (cat) {
    case 'SOIL':
      return {
        icon: Sprout,
        color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
        label: 'Soil Health',
      };
    case 'WALLET':
    case 'FINANCE':
      return {
        icon: DollarSign,
        color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
        label: 'Finance & Wallet',
      };
    case 'LAND':
      return {
        icon: FileText,
        color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
        label: 'Land & GIS',
      };
    case 'INSURANCE':
      return {
        icon: ShieldAlert,
        color: 'text-rose-600 bg-rose-100 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
        label: 'Tree Insurance',
      };
    case 'MARKETPLACE':
      return {
        icon: ShoppingBag,
        color: 'text-purple-600 bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
        label: 'Marketplace',
      };
    case 'SCHEME':
      return {
        icon: Award,
        color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700',
        label: 'Scheme',
      };
    case 'SUPPORT':
      return {
        icon: LifeBuoy,
        color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800',
        label: 'Support Desk',
      };
    case 'TASK':
      return {
        icon: AlertTriangle,
        color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
        label: 'Partner Task',
      };
    default:
      return {
        icon: Bell,
        color: 'text-slate-600 bg-slate-100 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700',
        label: 'System Alert',
      };
  }
};

const formatTimeAgo = (dateInput) => {
  if (!dateInput) return 'Just now';
  const now = new Date();
  const date = new Date(dateInput);
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items: notifications, unreadCount, loading } = useSelector(
    (state) => state.notifications
  );
  const userRole = user?.role || 'FARMER';

  const [filter, setFilter] = useState('ALL'); // 'ALL', 'UNREAD', 'PRIORITY'
  const [selectedNotif, setSelectedNotif] = useState(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications(filter));
    }
  }, [isOpen, filter, dispatch]);

  if (!isOpen) return null;

  const displayedNotifications = (notifications || []).filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'PRIORITY') return n.priority === 'HIGH' || n.priority === 'URGENT';
    return true;
  });

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleOpenDetail = (notif, e) => {
    if (e) e.stopPropagation();
    const id = notif._id || notif.id;
    if (!notif.read) {
      dispatch(markNotificationAsRead(id));
    }
    setSelectedNotif(notif);
  };

  const handleNavigateToLink = (link) => {
    setSelectedNotif(null);
    onClose();
    if (link) {
      navigate(link);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 transition-opacity animate-in fade-in"
        onClick={() => {
          setSelectedNotif(null);
          onClose();
        }}
      />

      {/* Slide-in Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col border-l border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
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
              <p className="text-xs text-neutral-500">Live platform alerts & sovereign notifications</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => dispatch(fetchNotifications(filter))}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
              title="Refresh Notifications"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
              className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1"
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
              const meta = getCategoryMeta(notif.category);
              const Icon = meta.icon;
              const isUnread = !notif.read;
              const timeDisplay = formatTimeAgo(notif.createdAt);

              return (
                <div
                  key={notif._id || notif.id}
                  onClick={(e) => handleOpenDetail(notif, e)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                    isUnread
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 shadow-sm'
                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 opacity-85'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 border ${meta.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            {meta.label}
                          </span>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeDisplay}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white mt-1">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                        <button
                          type="button"
                          onClick={(e) => handleOpenDetail(notif, e)}
                          className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group hover:underline"
                        >
                          View details
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        {(notif.priority === 'HIGH' || notif.priority === 'URGENT') && (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 px-2 py-0.5 rounded-full">
                            {notif.priority}
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
          <span>
            Active Role: <strong className="text-neutral-800 dark:text-neutral-200">{userRole}</strong>
          </span>
          <button
            onClick={onClose}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-semibold"
          >
            Close Drawer
          </button>
        </div>
      </div>

      {/* Interactive Notification Detail Popup Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const meta = getCategoryMeta(selectedNotif.category);
                  const Icon = meta.icon;
                  return (
                    <div className={`p-3 rounded-2xl border ${meta.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  );
                })()}
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    {getCategoryMeta(selectedNotif.category).label}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white leading-snug">
                    {selectedNotif.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedNotif(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Meta Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {selectedNotif.createdAt
                  ? new Date(selectedNotif.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'Just now'}
              </span>

              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Role: {selectedNotif.targetRole || 'ALL'}
              </span>

              {selectedNotif.priority && (
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedNotif.priority === 'HIGH' || selectedNotif.priority === 'URGENT'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}
                >
                  Priority: {selectedNotif.priority}
                </span>
              )}
            </div>

            {/* Message Body */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/80 dark:border-neutral-700/80 text-sm text-slate-700 dark:text-neutral-200 leading-relaxed space-y-2">
              <p>{selectedNotif.message}</p>

              {selectedNotif.metadata && Object.keys(selectedNotif.metadata).length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-neutral-700 text-xs text-slate-600 dark:text-neutral-400 space-y-1 font-mono">
                  {selectedNotif.metadata.ticketId && (
                    <p className="flex justify-between">
                      <span className="text-slate-500 font-sans">Ticket Reference:</span>
                      <strong className="text-emerald-700 dark:text-emerald-400">{selectedNotif.metadata.ticketId}</strong>
                    </p>
                  )}
                  {selectedNotif.metadata.landId && (
                    <p className="flex justify-between">
                      <span className="text-slate-500 font-sans">Land Parcel ID:</span>
                      <strong className="text-blue-600">{selectedNotif.metadata.landId}</strong>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedNotif(null)}
              >
                Close
              </Button>

              {selectedNotif.link && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => handleNavigateToLink(selectedNotif.link)}
                >
                  Open Page / Service
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationDrawer;
