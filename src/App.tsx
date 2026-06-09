import { useEffect, useState } from 'react';
import { Navbar, Footer } from './components/Layout';
import LandingPage from './components/LandingPage';
import DocumentationPage from './components/DocumentationPage';
import VisitsPage from './components/VisitsPage';
import { toast } from 'vanilla-toast-js';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    const stored = localStorage.getItem('vanilla-toast-docs-theme') as 'light' | 'dark' | 'system' | null;
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  });

  const setTheme = (nextTheme: 'light' | 'dark' | 'system') => {
    setThemeState(nextTheme);
    localStorage.setItem('vanilla-toast-docs-theme', nextTheme);
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate-change', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate-change', handleLocationChange);
    };
  }, []);

  // Intercept normal links and do client-side routing
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href) {
        try {
          const url = new URL(anchor.href);
          if (url.origin === window.location.origin) {
            const pathname = url.pathname;
            // Only intercept and route client-side if navigating to a DIFFERENT path
            if (pathname !== window.location.pathname) {
              if (pathname === '/' || pathname === '/getting-start' || pathname === '/visits') {
                e.preventDefault();
                window.history.pushState({}, '', pathname);
                window.dispatchEvent(new Event('pushstate-change'));
              }
            }
          }
        } catch (err) {
          // ignore invalid URLs
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  // Global theme management & toast configuration
  useEffect(() => {
    const applyTheme = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.dataset.theme = theme;
    };

    applyTheme();

    // Configure toast to match the current theme dynamically
    toast.configure({
      theme,
      position: 'bottom-right',
      closeButton: true,
      progressBar: true,
      richColors: true,
      swipeToDismiss: true,
      keyboardDismiss: true,
    });

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [theme]);

  // Log visit once per session
  useEffect(() => {
    const visitLogged = sessionStorage.getItem('vanilla_toast_visit_logged');
    if (visitLogged) return;

    const recordVisit = async () => {
      let visitData = {
        ip: '127.0.0.1',
        country: 'Local',
        city: 'Local',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.ok ? await response.json() : null;
          if (data) {
            visitData.ip = data.ip || visitData.ip;
            visitData.country = data.country_name || visitData.country;
            visitData.city = data.city || visitData.city;
          }
        }
      } catch (err) {
        // Fallback: let the server handle it
      }

      // Pre-save to localStorage as a client-side static mode fallback
      try {
        const localVisitsJson = localStorage.getItem('vanilla_toast_local_visits');
        let localVisits = localVisitsJson ? JSON.parse(localVisitsJson) : [];
        // Prevent duplicate local logs in the exact same session minute
        const lastVisit = localVisits[0];
        const isDuplicate = lastVisit && 
          lastVisit.ip === visitData.ip && 
          new Date(lastVisit.timestamp).getMinutes() === new Date(visitData.timestamp).getMinutes();
          
        if (!isDuplicate) {
          localVisits.unshift(visitData);
          if (localVisits.length > 50) localVisits = localVisits.slice(0, 50);
          localStorage.setItem('vanilla_toast_local_visits', JSON.stringify(localVisits));
        }
      } catch (e) {
        // Ignore storage errors
      }

      try {
        await fetch('/api/visit.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(visitData),
        });
        sessionStorage.setItem('vanilla_toast_visit_logged', 'true');
      } catch (err) {
        console.error('Error logging visit to server:', err);
      }
    };

    recordVisit();
  }, []);

  if (path === '/visits') {
    return <VisitsPage theme={theme} setTheme={setTheme} />;
  }

  if (path === '/getting-start') {
    return <DocumentationPage theme={theme} setTheme={setTheme} />;
  }

  return (
    <div className="relative min-h-screen">
      <Navbar theme={theme} setTheme={setTheme} />
      <LandingPage />
      <Footer />
    </div>
  );
}
