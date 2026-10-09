'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WifiOff, Wifi, Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAProvider() {
  const [isOffline, setIsOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installDismissed, setInstallDismissed] = useState(false);

  useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[ExploreBharat PWA] Service Worker registered with scope:', registration.scope);
          })
          .catch((err) => {
            console.warn('[ExploreBharat PWA] Service Worker registration failed:', err);
          });
      });
    }

    // 2. Connectivity Listeners
    setIsOffline(!navigator.onLine);

    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // 3. PWA Install Prompt Listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <>
      {/* Offline Alert Toast */}
      {isOffline && (
        <aside
          role="status"
          aria-live="polite"
          aria-label="Offline Mode Notification"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-stone-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-amber-600/40 flex items-start gap-3 animate-fade-in"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <WifiOff className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-semibold text-amber-200">Offline Mode Active</p>
            <p className="text-stone-300 mt-0.5 leading-relaxed">
              No internet detected. Your confirmed booking QR passes and saved itineraries remain available offline.
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Link
                href="/wallet"
                className="text-amber-400 font-bold hover:underline"
              >
                Open Wallet Passes &rarr;
              </Link>
              <Link
                href="/offline"
                className="text-stone-400 hover:text-white"
              >
                Emergency Helplines
              </Link>
            </div>
          </div>
        </aside>
      )}

      {/* Online Restored Notification */}
      {showRestored && (
        <aside
          role="status"
          aria-live="polite"
          aria-label="Online Connection Restored Notification"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50 bg-stone-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-fade-in"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Wifi className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-semibold text-emerald-300">Connection Restored</p>
            <p className="text-stone-300">Back online and ready to sync.</p>
          </div>
          <button
            onClick={() => setShowRestored(false)}
            aria-label="Dismiss connection restored notification"
            className="text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* PWA Install Banner */}
      {installPrompt && !installDismissed && !isOffline && (
        <aside
          role="region"
          aria-label="Install ExploreBharat Web Application"
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-50 bg-gradient-to-r from-stone-900 to-amber-950 text-white p-4 rounded-2xl shadow-2xl border border-amber-500/30 flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-serif font-black text-sm">
            EB
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-amber-100">Install ExploreBharat App</p>
            <p className="text-stone-300 mt-0.5">
              Install on your phone or PC for instant offline access to tickets and offline travel guides.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
              <button
                onClick={() => setInstallDismissed(true)}
                className="px-2.5 py-1.5 text-stone-400 hover:text-white text-xs"
              >
                Not Now
              </button>
            </div>
          </div>
          <button
            onClick={() => setInstallDismissed(true)}
            aria-label="Dismiss install app banner"
            className="text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}
    </>
  );
}
