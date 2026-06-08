import { useEffect, useMemo, useState } from 'react';
import { toast, type ToastTheme } from 'vanilla-toast-js';
import {
  BookOpen,
  CheckCircle2,
  Clipboard,
  ExternalLink,
  Github,
  Menu,
  Moon,
  Package,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';

type ThemeMode = ToastTheme;

const links = {
  npm: 'https://www.npmjs.com/package/vanilla-toast-js',
  github: 'https://github.com/Github-Suriya/vanilla-toast-js',
  issues: 'https://github.com/Github-Suriya/vanilla-toast-js/issues',
};

const navGroups = [
  {
    title: 'Basics',
    items: [
      { label: 'Getting Started', href: '#getting-started' },
      { label: 'Installation', href: '#installation' },
      { label: 'Usage', href: '#usage' },
      { label: 'CDN', href: '#cdn' },
    ],
  },
  {
    title: 'API',
    items: [
      { label: 'toast()', href: '#toast' },
      { label: 'Types', href: '#types' },
      { label: 'Promise', href: '#promise' },
      { label: 'Configuration', href: '#configuration' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { label: 'Styling', href: '#styling' },
      { label: 'Reference', href: '#reference' },
    ],
  },
];

const pageLinks = [
  { label: 'Installation', href: '#installation' },
  { label: 'NPM Usage', href: '#usage' },
  { label: 'CDN Usage', href: '#cdn' },
  { label: 'Render a toast', href: '#toast' },
  { label: 'Configuration', href: '#configuration' },
  { label: 'API Reference', href: '#reference' },
];

const codeSamples = {
  install: 'npm install vanilla-toast-js',
  usage: `import { toast } from 'vanilla-toast-js';
import 'vanilla-toast-js/style.css';

toast.success('Saved!');`,
  cdn: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vanilla-toast-js/dist/vanilla-toast.css" />
<script src="https://cdn.jsdelivr.net/npm/vanilla-toast-js/dist/vanilla-toast.iife.js"></script>
<script>
  vanillaToast.success('Saved!');
</script>`,
  styling: `:root {
  --vt-bg: #ffffff;
  --vt-color: #171717;
  --vt-border: #e8e8e8;
  --vt-radius: 8px;
  --vt-shadow: 0 10px 32px rgba(0, 0, 0, 0.12);
}`,
  reference: `toast(message: string, options?: ToastOptions): ToastId;
toast.success(message: string, options?: ToastOptions): ToastId;
toast.error(message: string, options?: ToastOptions): ToastId;
toast.warning(message: string, options?: ToastOptions): ToastId;
toast.info(message: string, options?: ToastOptions): ToastId;
toast.loading(message: string, options?: ToastOptions): ToastId;
toast.custom(element: HTMLElement, options?: ToastOptions): ToastId;
toast.update(id: ToastId, options: ToastUpdateOptions): void;
toast.dismiss(id?: ToastId): void;
toast.dismissAll(): void;
toast.promise<T>(promise: Promise<T> | (() => Promise<T>), messages: ToastPromiseMessages<T>, options?: ToastOptions): Promise<T>;
toast.configure(options: Partial<ToasterOptions>): void;`,
};

const toastDemoCodeSamples = {
  'Default': `import { toast } from 'vanilla-toast-js';

toast('Event created', {
  description: 'Sunday at 9:00 AM',
  closeButton: true,
});`,
  'Success': `import { toast } from 'vanilla-toast-js';

toast.success('Saved', {
  description: 'Your changes are live.',
  richColors: true,
});`,
  'Warning': `import { toast } from 'vanilla-toast-js';

toast.warning('Check your input', {
  richColors: true,
});`,
  'Error': `import { toast } from 'vanilla-toast-js';

toast.error('Save failed', {
  description: 'Please try again.',
  richColors: true,
});`,
  'Loading': `import { toast } from 'vanilla-toast-js';

const id = toast.loading('Uploading...', {
  closeButton: true,
  duration: Infinity,
});

// Later update the toast state:
window.setTimeout(() => {
  toast.update(id, {
    title: 'Upload complete',
    type: 'success',
    duration: 3000,
    richColors: true,
  });
}, 1400);`,
  'Promise': `import { toast } from 'vanilla-toast-js';

toast.promise(
  new Promise((resolve) => window.setTimeout(resolve, 1400)),
  {
    loading: 'Saving...',
    success: 'Saved!',
    error: 'Save failed',
  }
);`,
};

async function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  }
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  const copyCode = async () => {
    await copyToClipboard(code);
    toast.success('Copied to clipboard', {
      description: label,
      closeButton: true,
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border-subtle bg-code-panel">
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2">
        <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary cursor-pointer"
          aria-label={`Copy ${label}`}
        >
          <Clipboard size={15} />
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-code-snippet text-code-snippet text-primary"><code>{code}</code></pre>
    </div>
  );
}

function ThemeSelector({ theme, setTheme }: { theme: ThemeMode; setTheme: (theme: ThemeMode) => void }) {
  const options: Array<{ value: ThemeMode; label: string; icon: typeof Sun }> = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Sparkles },
  ];

  return (
    <div className="rounded-lg border border-border-subtle bg-surface-container-low p-1">
      <div className="grid grid-cols-3 gap-1">
        {options.map((option) => {
          const Icon = option.icon;
          const active = theme === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors cursor-pointer ${
                active
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <Icon size={14} />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Sidebar({ 
  mobileOpen, 
  closeMobile,
  activeSection 
}: { 
  mobileOpen: boolean; 
  closeMobile: () => void;
  activeSection: string;
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-border-subtle bg-surface px-6 py-5 transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <a href="/" className="group flex items-center gap-3" onClick={closeMobile}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-surface-container-low">
            <Package size={18} />
          </span>
          <span>
            <span className="block text-sm font-semibold text-primary">Vanilla Toast JS</span>
            <span className="text-xs text-on-surface-variant">by Github-Suriya</span>
          </span>
        </a>
        <button
          type="button"
          onClick={closeMobile}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-low lg:hidden cursor-pointer"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="mt-10 space-y-8">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-3 font-label-sm text-label-sm uppercase text-muted">{group.title}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const id = item.href.replace('#', '');
                const isActive = id === activeSection;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className={`block rounded-md px-2 py-1.5 text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-surface-container-high text-primary font-semibold'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <a
        href={links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 flex items-center justify-between rounded-lg border border-border-subtle bg-surface-container-low p-3 text-sm text-primary transition-colors hover:bg-surface-container-high"
      >
        <span className="flex items-center gap-2">
          <Github size={16} />
          GitHub
        </span>
        <ExternalLink size={14} />
      </a>
    </aside>
  );
}

export default function DocumentationPage({ 
  theme, 
  setTheme 
}: { 
  theme: ThemeMode; 
  setTheme: (theme: ThemeMode) => void; 
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState('Default');
  const [activeSection, setActiveSection] = useState('getting-started');

  // IntersectionObserver for scroll-spy highlighting
  useEffect(() => {
    const sectionIds = [
      'getting-started',
      'installation',
      'usage',
      'cdn',
      'toast',
      'types',
      'promise',
      'configuration',
      'styling',
      'reference',
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -75% 0px', // triggers when the section enters the viewport's middle-top
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const demoButtons = useMemo(
    () => [
      {
        label: 'Default',
        onClick: () => {
          setActiveDemo('Default');
          toast('Event created', { description: 'Sunday at 9:00 AM', closeButton: true });
        },
      },
      {
        label: 'Success',
        onClick: () => {
          setActiveDemo('Success');
          toast.success('Saved', { description: 'Your changes are live.', richColors: true });
        },
      },
      {
        label: 'Warning',
        onClick: () => {
          setActiveDemo('Warning');
          toast.warning('Check your input', { richColors: true });
        },
      },
      {
        label: 'Error',
        onClick: () => {
          setActiveDemo('Error');
          toast.error('Save failed', { description: 'Please try again.', richColors: true });
        },
      },
      {
        label: 'Loading',
        onClick: () => {
          setActiveDemo('Loading');
          const id = toast.loading('Uploading...', { closeButton: true, duration: Infinity });

          window.setTimeout(() => {
            toast.update(id, {
              title: 'Upload complete',
              type: 'success',
              duration: 3000,
              richColors: true,
            });
          }, 1400);
        },
      },
      {
        label: 'Promise',
        onClick: () => {
          setActiveDemo('Promise');
          toast.promise(new Promise((resolve) => window.setTimeout(resolve, 1400)), {
            loading: 'Saving...',
            success: 'Saved!',
            error: 'Save failed',
          });
        },
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <div className="lg:grid lg:grid-cols-[288px_minmax(0,1fr)]">
        <Sidebar mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} activeSection={activeSection} />

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 lg:px-10">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-subtle text-primary lg:hidden cursor-pointer"
                aria-label="Open navigation"
              >
                <Menu size={18} />
              </button>

              <div className="hidden items-center gap-2 text-sm text-on-surface-variant lg:flex">
                <BookOpen size={16} />
                Documentation
              </div>

              <div className="ml-auto flex items-center gap-3">
                <a className="hidden text-sm text-on-surface-variant transition-colors hover:text-primary sm:inline" href="/">
                  Home
                </a>
                <a className="hidden text-sm text-on-surface-variant transition-colors hover:text-primary sm:inline" href={links.npm} target="_blank" rel="noopener noreferrer">
                  npm
                </a>
                <a className="hidden text-sm text-on-surface-variant transition-colors hover:text-primary sm:inline" href={links.issues} target="_blank" rel="noopener noreferrer">
                  issues
                </a>
                <ThemeSelector theme={theme} setTheme={setTheme} />
              </div>
            </div>
          </header>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_180px] lg:px-10">
            <main className="min-w-0">
              <section id="getting-started" className="scroll-mt-24">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-container-low px-3 py-1 text-xs font-medium text-on-surface-variant">
                  <CheckCircle2 size={14} />
                  v1.0.3 - zero runtime dependencies - MIT
                </p>
                <h1 className="text-4xl font-semibold leading-tight tracking-normal text-primary md:text-5xl">Getting Started</h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-on-surface-variant">
                  Vanilla Toast JS is a lightweight, framework-independent toast notification library for Vanilla JavaScript. It ships TypeScript types, CDN-ready bundles, stacked animations, promise handling, swipe dismissal, accessible controls, and theme support.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => toast.success('Vanilla Toast is rendering from the npm package.', { description: 'This is not the old mock toaster.' })}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-transform active:scale-95 cursor-pointer"
                  >
                    Render Toast
                  </button>
                  <a
                    href={links.npm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-surface-container-low"
                  >
                    View npm package
                    <ExternalLink size={15} />
                  </a>
                </div>
              </section>

              <section id="installation" className="docs-section">
                <h2>Installation</h2>
                <p>Install the package from your command line.</p>
                <CodeBlock label="Terminal" code={codeSamples.install} />
              </section>

              <section id="usage" className="docs-section">
                <h2>NPM Usage</h2>
                <p>Import the toast API and the package stylesheet once in your application entry.</p>
                <CodeBlock label="main.ts" code={codeSamples.usage} />
              </section>

              <section id="cdn" className="docs-section">
                <h2>CDN Usage</h2>
                <p>The browser bundle exposes window.vanillaToast, window.VanillaToast.toast, and the convenience alias window.toast.</p>
                <CodeBlock label="index.html" code={codeSamples.cdn} />
              </section>

              <section id="toast" className="docs-section">
                <h2>Render a toast</h2>
                <p>Call toast from anywhere in your client-side code. Try the live examples below; they use the installed npm package directly.</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {demoButtons.map((button) => (
                    <button
                      key={button.label}
                      type="button"
                      onClick={button.onClick}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        activeDemo === button.label
                          ? 'bg-surface-container-high border-outline shadow-sm text-primary'
                          : 'border-border-subtle bg-surface text-primary hover:bg-surface-container-low'
                      }`}
                    >
                      {button.label}
                    </button>
                  ))}
                </div>
                <CodeBlock label="toast.ts" code={toastDemoCodeSamples[activeDemo as keyof typeof toastDemoCodeSamples]} />
              </section>

              <section id="types" className="docs-section">
                <h2>Toast Types</h2>
                <p>Use built-in helpers for common notification states.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {['toast()', 'toast.success()', 'toast.error()', 'toast.warning()', 'toast.info()', 'toast.loading()'].map((item) => (
                    <div key={item} className="rounded-lg border border-border-subtle bg-surface-container-low px-3 py-2 font-code-snippet text-code-snippet text-primary">
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section id="promise" className="docs-section">
                <h2>Promise Toasts</h2>
                <p>Bind a loading, success, and error message to a promise.</p>
                <CodeBlock label="promise.ts" code={toastDemoCodeSamples['Promise']} />
              </section>

              <section id="configuration" className="docs-section">
                <h2>Configuration</h2>
                <p>Configure defaults for position, duration, progress bars, theme, keyboard dismissal, and stack behavior.</p>
                <CodeBlock label="configure.ts" code={codeSamples.styling} />
              </section>

              <section id="styling" className="docs-section">
                <h2>Styling</h2>
                <p>Customize the packaged CSS with variables. The documentation theme switcher also updates the package theme through toast.configure.</p>
                <CodeBlock label="theme.css" code={codeSamples.styling} />
              </section>

              <section id="reference" className="docs-section pb-16">
                <h2>API Reference</h2>
                <p>Types are included and exported by the package.</p>
                <CodeBlock label="api.ts" code={codeSamples.reference} />
              </section>
            </main>

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="mb-3 text-sm font-medium text-primary">On this page</p>
                <nav className="space-y-2">
                  {pageLinks.map((link) => {
                    const id = link.href.replace('#', '');
                    // For active state mapping
                    const mappedActiveId = 
                      id === 'installation' ? 'installation' :
                      id === 'usage' ? 'usage' :
                      id === 'cdn' ? 'cdn' :
                      id === 'toast' ? 'toast' :
                      id === 'configuration' ? 'configuration' :
                      id === 'reference' ? 'reference' : '';
                    
                    const isActive = mappedActiveId === activeSection;

                    return (
                      <a 
                        key={link.href} 
                        href={link.href} 
                        className={`block text-sm transition-colors border-l-2 pl-3 ${
                          isActive
                            ? 'border-primary text-primary font-semibold'
                            : 'border-transparent text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
