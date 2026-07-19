/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Cloud, RefreshCw, CheckCircle2 } from 'lucide-react';
import { translations } from '../locales';
import { AppLanguage } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface OfflineIndicatorProps {
  language: AppLanguage;
  isOffline: boolean;
  onToggleConnection: () => void;
  unSyncedCount: number;
}

export default function OfflineIndicator({
  language,
  isOffline,
  onToggleConnection,
  unSyncedCount,
}: OfflineIndicatorProps) {
  const t = translations[language];
  const [syncing, setSyncing] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  // Trigger animation sequence when network goes online and has unsynced items
  useEffect(() => {
    if (!isOffline && unSyncedCount > 0) {
      setSyncing(true);
      const timer = setTimeout(() => {
        setSyncing(false);
        setShowSyncSuccess(true);
        const successTimer = setTimeout(() => {
          setShowSyncSuccess(false);
        }, 3000);
        return () => clearTimeout(successTimer);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isOffline, unSyncedCount]);

  return (
    <div className="flex items-center space-x-3 text-xs" id="offline-network-control">
      {/* Network toggle switch */}
      <button
        type="button"
        id="btn-toggle-network"
        onClick={onToggleConnection}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border font-semibold font-sans transition-all cursor-pointer ${
          isOffline
            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
            : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
        }`}
        title="Toggle simulation connection"
      >
        {isOffline ? (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            <span>{t.offline}</span>
          </>
        ) : (
          <>
            <Wifi className="w-3.5 h-3.5" />
            <span>{t.online}</span>
          </>
        )}
      </button>

      {/* Sync Status Label */}
      <div className="flex items-center space-x-1.5 text-gray-500 dark:text-zinc-400 font-medium">
        <AnimatePresence mode="wait">
          {syncing ? (
            <motion.div
              key="syncing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-1.5 text-blue-600 dark:text-blue-400"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span className="font-mono text-[11px]">{t.syncing}</span>
            </motion.div>
          ) : showSyncSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="w-3.5 h-3.5 animate-bounce" />
              <span className="font-mono text-[11px] font-semibold">{t.synced}</span>
            </motion.div>
          ) : isOffline ? (
            <motion.div
              key="offline-status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-1 text-red-500 font-mono text-[11px]"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{t.unsynced}</span>
            </motion.div>
          ) : (
            <motion.div
              key="synced-status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-1 text-emerald-500 dark:text-emerald-400 font-mono text-[11px]"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{t.synced}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
