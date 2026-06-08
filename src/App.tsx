import { useEffect, useState } from 'react';
import { Navbar, Footer } from './components/Layout';
import LandingPage from './components/LandingPage';
import DocumentationPage from './components/DocumentationPage';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

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
            // Only route / and /getting-start client-side
            if (pathname === '/' || pathname === '/getting-start') {
              e.preventDefault();
              window.history.pushState({}, '', pathname);
              window.dispatchEvent(new Event('pushstate-change'));
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

  if (path === '/getting-start') {
    return <DocumentationPage />;
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <LandingPage />
      <Footer />
    </div>
  );
}
