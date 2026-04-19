import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * useAndroidBackButton
 * 
 * Intercepts the Android hardware back button to navigate
 * within the app using Next.js router instead of exiting.
 * 
 * Behavior:
 * - If user is on a sub-page → navigate back via router
 * - If user is on root page (home) → show exit confirmation or minimize
 * - Only activates on native Android platform (no-op on web/iOS)
 */
export const useAndroidBackButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const navigationHistory = useRef<string[]>([]);

  // Track navigation history manually since Next.js SPA 
  // doesn't push to WebView's native history stack
  useEffect(() => {
    const history = navigationHistory.current;
    
    // Avoid duplicate consecutive entries
    if (history[history.length - 1] !== pathname) {
      history.push(pathname);
    }

    // Keep history stack manageable (max 50 entries)
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
  }, [pathname]);

  useEffect(() => {
    // Only run on native Android
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
      return;
    }

    const handleBackButton = async () => {
      const history = navigationHistory.current;

      // Root pages where back should minimize the app, not exit
      const rootPages = ['/', '/id', '/en', '/id/admin', '/en/admin'];
      const isRootPage = rootPages.some(
        (root) => pathname === root || pathname.endsWith(root)
      );

      if (isRootPage || history.length <= 1) {
        // On root page: minimize app instead of exiting
        await App.minimizeApp();
      } else {
        // Pop current page from our history
        history.pop();
        // Navigate to previous page
        router.back();
      }
    };

    // Register the listener 
    const listenerPromise = App.addListener('backButton', handleBackButton);

    return () => {
      // Cleanup listener on unmount
      listenerPromise.then((listener) => listener.remove());
    };
  }, [pathname, router]);
};
