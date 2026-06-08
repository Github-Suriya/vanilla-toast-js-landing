import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Copy, Sparkles, ArrowRight, Github, Package, ShieldCheck } from 'lucide-react';
import { toast } from 'vanilla-toast-js';

const packageInfo = {
  version: '1.0.3',
  downloads: '523',
  downloadWindow: 'last month',
  license: 'MIT',
  repository: 'https://github.com/Github-Suriya/vanilla-toast-js',
  npm: 'https://www.npmjs.com/package/vanilla-toast-js',
  docs: '/getting-start',
};

function StackedHeroToasts() {
  return (
    <div className="relative h-[80px] w-[300px] mx-auto mb-12 flex justify-center">
      <motion.div 
        initial={{ top: 10, scale: 0.9, opacity: 0 }}
        animate={{ top: -16, scale: 0.92, opacity: 0.6 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
        className="absolute w-full h-[48px] bg-white border border-border-subtle rounded-lg z-10 shadow-sm" 
      />
      <motion.div 
        initial={{ top: 10, scale: 0.9, opacity: 0 }}
        animate={{ top: -8, scale: 0.96, opacity: 0.8 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
        className="absolute w-full h-[48px] bg-white border border-border-subtle rounded-lg z-20 shadow-sm" 
      />
      <motion.div 
        initial={{ top: 10, scale: 0.9, opacity: 0 }}
        animate={{ top: 0, scale: 1, opacity: 1 }}
        transition={{ delay: 0, type: "spring", stiffness: 200, damping: 20 }}
        className="absolute w-full h-[48px] bg-white border border-border-subtle rounded-lg z-30 flex items-center px-4 shadow-sm"
      >
        <div className="h-4 w-4 rounded-full bg-surface-container-highest flex-shrink-0 mr-3" />
        <div className="h-2 w-32 bg-surface-container-high rounded-full" />
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const [activeType, setActiveType] = useState('default');
  const [hoverInstall, setHoverInstall] = useState(false);

  useEffect(() => {
    toast.configure({
      position: 'bottom-right',
      closeButton: true,
      progressBar: true,
      richColors: true,
    });
  }, []);

  const toastConfigs: Record<string, { label: string, code: string, action: () => void }> = {
    'default': {
      label: 'Default',
      code: "toast('Event created')",
      action: () => toast('Event created')
    },
    'description': {
      label: 'Description',
      code: "toast('Event created', { description: 'Sunday at 9:00 AM', closeButton: true })",
      action: () => toast('Event created', { description: 'Sunday at 9:00 AM', closeButton: true })
    },
    'success': {
      label: 'Success',
      code: "toast.success('Saved')",
      action: () => toast.success('Saved')
    },
    'info': {
      label: 'Info',
      code: "toast.info('New version available')",
      action: () => toast.info('New version available')
    },
    'warning': {
      label: 'Warning',
      code: "toast.warning('Check your input')",
      action: () => toast.warning('Check your input')
    },
    'error': {
      label: 'Error',
      code: "toast.error('Failed')",
      action: () => toast.error('Failed')
    },
    'action': {
      label: 'Action',
      code: "toast('File deleted', { action: { label: 'Undo', onClick: restoreFile }, closeButton: true })",
      action: () => toast('File deleted', { 
        action: { 
          label: 'Undo', 
          onClick: () => toast.success('File restored') 
        }, 
        closeButton: true 
      })
    },
    'promise': {
      label: 'Promise',
      code: "toast.promise(fetch('/api/save'), { loading: 'Saving...', success: 'Saved!', error: 'Save failed' })",
      action: () => {
        const p = new Promise((resolve) => setTimeout(resolve, 2000));
        toast.promise(p, { loading: 'Saving...', success: 'Saved!', error: 'Save failed' });
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install vanilla-toast-js');
    toast.success('Copied to clipboard');
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto space-y-28">
      
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <StackedHeroToasts />
        <h1 className="font-display-lg text-display-lg text-primary">Vanilla Toast JS</h1>
        <p className="text-on-surface-variant font-body-base text-lg max-w-md mx-auto">
          A lightweight, framework-independent toast notification library for Vanilla JavaScript with TypeScript types, CDN bundles, stacked animations, promise handling, and zero runtime dependencies.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="bg-white border border-border-subtle px-3 py-1.5 rounded-lg text-sm text-on-surface-variant">v{packageInfo.version}</span>
          <span className="bg-white border border-border-subtle px-3 py-1.5 rounded-lg text-sm text-on-surface-variant">{packageInfo.downloads} downloads {packageInfo.downloadWindow}</span>
          <span className="bg-white border border-border-subtle px-3 py-1.5 rounded-lg text-sm text-on-surface-variant">{packageInfo.license}</span>
        </div>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => toast.success('Vanilla Toast is ready', { description: 'No framework required' })}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-medium active:scale-95 transition-all shadow-sm"
          >
            Render a toast
          </button>
          <a href={packageInfo.repository} className="inline-flex items-center gap-2 bg-white border text-primary border-border-subtle px-6 py-2.5 rounded-lg font-medium hover:bg-surface-container-low active:scale-95 transition-all shadow-sm">
            <Github size={18} />
            GitHub
          </a>
        </div>
        <div>
          <a className="text-on-surface-variant underline underline-offset-4 hover:text-primary transition-colors text-sm" href={packageInfo.npm}>
            View package on npm
          </a>
        </div>
      </section>

      {/* Installation */}
      <section className="space-y-6">
        <h2 className="font-headline-md text-headline-md text-primary">Installation</h2>
        <div 
          onClick={handleCopy}
          onMouseEnter={() => setHoverInstall(true)}
          onMouseLeave={() => setHoverInstall(false)}
          className="bg-surface-container-low border border-border-subtle p-4 rounded-xl flex justify-between items-center cursor-pointer hover:border-outline-variant transition-colors"
        >
          <code className="font-code-snippet text-code-snippet text-primary">npm install vanilla-toast-js</code>
          <Copy 
            size={18} 
            className={`text-on-surface-variant transition-opacity duration-200 ${hoverInstall ? 'opacity-100' : 'opacity-0'}`} 
          />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-6">
        <h2 className="font-headline-md text-headline-md text-primary">NPM Usage</h2>
        <p className="text-on-surface-variant text-body-base">Import the toast API and the packaged stylesheet once in your application entry.</p>
        <div className="bg-surface-container-low border border-border-subtle p-6 rounded-xl overflow-x-auto">
          <pre className="font-code-snippet text-code-snippet text-primary whitespace-pre"><code>{`import { toast } from 'vanilla-toast-js'
import 'vanilla-toast-js/style.css'

// Basic notification
toast('Event created')

// Specialized types
toast.success('Saved')
toast.error('Failed')`}</code></pre>
        </div>
      </section>

      {/* CDN Usage */}
      <section className="space-y-6">
        <h2 className="font-headline-md text-headline-md text-primary">CDN Usage</h2>
        <p className="text-on-surface-variant text-body-base">The IIFE bundle exposes <code className="font-code-snippet text-code-snippet">window.vanillaToast</code>, <code className="font-code-snippet text-code-snippet">window.VanillaToast.toast</code>, and the convenience alias <code className="font-code-snippet text-code-snippet">window.toast</code>.</p>
        <div className="bg-surface-container-low border border-border-subtle p-6 rounded-xl overflow-x-auto">
          <pre className="font-code-snippet text-code-snippet text-primary whitespace-pre"><code>{`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vanilla-toast-js/dist/vanilla-toast.css" />
<script src="https://cdn.jsdelivr.net/npm/vanilla-toast-js/dist/vanilla-toast.iife.js"></script>
<script>
  vanillaToast.success('Saved!');
</script>`}</code></pre>
        </div>
      </section>

      {/* Types (Interactive) */}
      <section className="space-y-8">
        <h2 className="font-headline-md text-headline-md text-primary">Types</h2>
        <p className="text-on-surface-variant text-body-base">Choose from several built-in types to communicate specific states with zero configuration.</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(toastConfigs).map((type) => (
            <button
              key={type}
              onClick={() => {
                setActiveType(type);
                toastConfigs[type].action();
              }}
            className={`px-4 py-2 bg-white border border-border-subtle rounded-lg text-sm font-medium transition-all ${
                activeType === type 
                  ? 'bg-surface-container-high border-outline shadow-sm' 
                  : 'hover:bg-surface-container-low'
              }`}
            >
              {toastConfigs[type].label}
            </button>
          ))}
        </div>
        <div className="bg-surface-container-low border border-border-subtle p-6 rounded-xl">
          <code className="font-code-snippet text-code-snippet text-primary">
            {toastConfigs[activeType].code}
          </code>
        </div>
      </section>

      {/* Feature facts */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-bento-gap">
        <div className="md:col-span-2 bg-white border border-border-subtle p-6 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="space-y-2">
            <span className="inline-block bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded">PACKAGE</span>
            <h3 className="font-headline-md text-headline-md mt-4 text-primary">Zero Runtime Dependencies</h3>
            <p className="text-on-surface-variant text-body-base">Ships ESM, UMD, IIFE, CSS, and TypeScript declaration files from the published npm package.</p>
          </div>
          <div className="mt-8 flex gap-2">
            <div className="h-1 w-12 bg-primary rounded-full transition-all"></div>
            <div className="h-1 w-12 bg-surface-container-highest rounded-full transition-all"></div>
            <div className="h-1 w-12 bg-surface-container-highest rounded-full transition-all"></div>
          </div>
        </div>

        <div className="bg-primary text-on-primary p-6 rounded-xl flex flex-col justify-between hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1">
          <Sparkles className="text-on-primary mb-6" size={32} />
          <div className="space-y-2">
            <h3 className="font-headline-md text-headline-md text-white">Stacked Animations</h3>
            <p className="text-on-primary-container text-body-base border-white">Smooth stacks, promise states, swipe dismissal, progress bars, and keyboard-friendly controls.</p>
          </div>
        </div>
      </section>

      {/* API */}
      <section className="space-y-6">
        <h2 className="font-headline-md text-headline-md text-primary">API Surface</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-bento-gap">
          {[
            { icon: Package, title: 'Toast Methods', body: 'default, success, error, warning, info, loading, custom, promise' },
            { icon: ShieldCheck, title: 'Controls', body: 'update, dismiss, dismissAll, configure, keyboard dismiss, close buttons' },
            { icon: Sparkles, title: 'Options', body: 'position, duration, richColors, progressBar, maxVisible, theme, animation' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white border border-border-subtle p-5 rounded-xl">
                <Icon size={22} className="text-primary mb-4" />
                <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-on-surface-variant text-body-base">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Docs CTA */}
      <section className="bg-surface-muted border border-border-subtle p-10 md:p-12 rounded-xl text-center space-y-6">
        <h2 className="font-headline-md text-headline-md text-primary">Read the Full README</h2>
        <p className="text-on-surface-variant text-body-base max-w-lg mx-auto">
          See configuration, themes, CSS variables, browser support, migration notes, and the complete TypeScript API reference.
        </p>
        <a className="inline-flex text-primary items-center gap-2 font-medium hover:gap-4 transition-all duration-300 group" href="/getting-start">
          Open documentation
          <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
        </a>
      </section>

    </main>
  );
}
