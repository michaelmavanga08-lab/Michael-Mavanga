/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Fingerprint, ScanEye, Lock, Eye, KeyRound, Globe } from 'lucide-react';
import { translations } from '../locales';
import { AppLanguage, AppTheme } from '../types';
import { motion } from 'motion/react';

interface BiometricLockProps {
  language: AppLanguage;
  onSuccess: () => void;
  theme: AppTheme;
}

export default function BiometricLock({ language, onSuccess, theme }: BiometricLockProps) {
  const t = translations[language];
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [authType, setAuthType] = useState<'none' | 'face' | 'finger' | 'oauth'>('none');
  const [oauthStep, setOauthStep] = useState<number>(0); // 0: select, 1: loading/popup, 2: success
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startScanning = (type: 'face' | 'finger') => {
    setIsScanning(true);
    setAuthType(type);
    setScanProgress(0);
    setErrorMessage(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            onSuccess();
          }, 600);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const startOAuth = (provider: 'google' | 'microsoft') => {
    setAuthType('oauth');
    setOauthStep(1);
    setErrorMessage(null);
    
    // Simulate a secure popup OAuth 2.0 window
    setTimeout(() => {
      setOauthStep(2);
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 p-8 text-center"
        id="biometric-lock-container"
      >
        {/* App Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <KeyRound className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 font-sans">
          {t.appName}
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 font-mono uppercase tracking-widest">
          {t.appSubtitle}
        </p>

        <div className="my-8 py-6 px-4 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-gray-100 dark:border-zinc-800/60">
          <Lock className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400 mb-3" />
          <h2 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
            {t.secureAccess}
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
            {t.unlockPrompt}
          </p>
        </div>

        {isScanning ? (
          <div className="py-8" id="scanning-status">
            <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              {/* Spinning scanning ring */}
              <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-zinc-800"></div>
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              {authType === 'face' ? (
                <ScanEye className="w-10 h-10 text-blue-600 animate-pulse" />
              ) : (
                <Fingerprint className="w-10 h-10 text-blue-600 animate-pulse" />
              )}
            </div>
            
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {authType === 'face' ? 'Scanning Face...' : 'Reading Fingerprint...'} {scanProgress}%
            </p>
            <div className="w-32 bg-gray-100 dark:bg-zinc-800 h-1 rounded-full mx-auto mt-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-100"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          </div>
        ) : authType === 'oauth' && oauthStep === 1 ? (
          <div className="py-8" id="oauth-loading">
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2 animate-bounce mb-3">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <p className="text-sm text-gray-600 dark:text-zinc-300 font-sans">
                Connecting to OAuth 2.0 Server...
              </p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 font-mono mt-1">
                Authenticating contractor token...
              </p>
            </div>
          </div>
        ) : authType === 'oauth' && oauthStep === 2 ? (
          <div className="py-8" id="oauth-success">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {t.authenticated}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3" id="auth-buttons">
            {/* Biometric options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="btn-face-id"
                onClick={() => startScanning('face')}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-zinc-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 rounded-xl border border-gray-200 dark:border-zinc-800 transition-all text-gray-700 dark:text-zinc-200 hover:border-blue-300 dark:hover:border-blue-700 group cursor-pointer"
              >
                <ScanEye className="w-6 h-6 text-gray-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2 transition-colors" />
                <span className="text-xs font-medium">{t.simulateFaceID}</span>
              </button>

              <button
                type="button"
                id="btn-touch-id"
                onClick={() => startScanning('finger')}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-zinc-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 rounded-xl border border-gray-200 dark:border-zinc-800 transition-all text-gray-700 dark:text-zinc-200 hover:border-blue-300 dark:hover:border-blue-700 group cursor-pointer"
              >
                <Fingerprint className="w-6 h-6 text-gray-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2 transition-colors" />
                <span className="text-xs font-medium">{t.simulateTouchID}</span>
              </button>
            </div>

            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-mono">OAuth 2.0 Sign-In</span>
              <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
            </div>

            {/* OAuth 2.0 options */}
            <button
              type="button"
              id="btn-google-oauth"
              onClick={() => startOAuth('google')}
              className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-gray-700 dark:text-zinc-200 font-sans text-xs font-semibold cursor-pointer transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <button
              type="button"
              id="btn-microsoft-oauth"
              onClick={() => startOAuth('microsoft')}
              className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-gray-700 dark:text-zinc-200 font-sans text-xs font-semibold cursor-pointer transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 23 23">
                <path fill="#f35325" d="M0 0h11v11H0z" />
                <path fill="#80bb0a" d="M12 0h11v11H12z" />
                <path fill="#00a1f1" d="M0 12h11v11H0z" />
                <path fill="#ffb900" d="M12 12h11v11H12z" />
              </svg>
              <span>Sign in with Microsoft</span>
            </button>

            {/* Direct access developer bypass */}
            <button
              type="button"
              id="btn-bypass-demo"
              onClick={onSuccess}
              className="w-full mt-4 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium transition-all cursor-pointer"
            >
              {t.bypassAuth}
            </button>
          </div>
        )}

        <div className="mt-8 border-t border-gray-100 dark:border-zinc-800 pt-4 flex items-center justify-center space-x-2 text-[10px] text-gray-400 dark:text-zinc-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AES-256 Client-Side Sandbox Storage</span>
        </div>
      </motion.div>
    </div>
  );
}
