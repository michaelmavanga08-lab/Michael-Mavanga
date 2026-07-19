/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Trash, X } from 'lucide-react';
import { translations } from '../locales';
import { AppNotification, AppLanguage } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationToastProps {
  notifications: AppNotification[];
  language: AppLanguage;
  onClear: () => void;
  onDismiss: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function NotificationToast({
  notifications,
  language,
  onClear,
  onDismiss,
  isOpen,
  onToggle,
}: NotificationToastProps) {
  const t = translations[language];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" id="notification-tray-wrapper">
      {/* Bell Icon Trigger */}
      <button
        type="button"
        id="btn-toggle-notifications"
        onClick={onToggle}
        className="relative p-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
        title={t.notifications}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications History Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl p-4 z-40 space-y-3"
            id="notification-history-dropdown"
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/60 pb-2">
              <h4 className="text-xs font-bold text-gray-900 dark:text-zinc-50 font-sans flex items-center">
                <Bell className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                {t.notifications}
              </h4>
              {notifications.length > 0 && (
                <button
                  type="button"
                  id="btn-clear-all-notifs"
                  onClick={onClear}
                  className="text-[10px] text-gray-400 hover:text-red-500 font-medium font-mono"
                >
                  {t.markAllRead}
                </button>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800/40 pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs font-sans">
                  {t.noNotifications}
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="py-2.5 flex items-start justify-between group">
                    <div className="flex space-x-2.5 max-w-[85%]">
                      <div className="mt-0.5 flex-shrink-0">
                        {notif.type === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : notif.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-gray-900 dark:text-zinc-100 leading-tight font-sans">
                          {notif.title}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-zinc-400 leading-normal font-sans">
                          {notif.message}
                        </p>
                        <p className="text-[8px] text-gray-400 font-mono">
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      id={`btn-dismiss-${notif.id}`}
                      onClick={() => onDismiss(notif.id)}
                      className="text-gray-300 hover:text-gray-500 dark:hover:text-zinc-300 p-0.5 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
