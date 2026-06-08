import { Github, Moon, Sun } from 'lucide-react';

const links = {
  github: 'https://github.com/Github-Suriya/vanilla-toast-js',
  issues: 'https://github.com/Github-Suriya/vanilla-toast-js/issues',
  npm: 'https://www.npmjs.com/package/vanilla-toast-js',
};

export function Navbar({ 
  theme, 
  setTheme 
}: { 
  theme: 'light' | 'dark' | 'system'; 
  setTheme: (theme: 'light' | 'dark' | 'system') => void; 
}) {
  return (
    <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-border-subtle dark:bg-surface/85">
      <div className="flex justify-between items-center max-w-4xl mx-auto px-6 py-4">
        <a href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
          <span className="font-headline-md text-headline-md font-bold tracking-tight text-primary">
            Vanilla Toast JS
          </span>
        </a>
        <nav className="hidden md:flex gap-8 items-center">
          <a className="text-primary font-semibold font-body-base text-body-base" href="/getting-start">Documentation</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-body-base text-body-base" href={links.npm} target="_blank" rel="noopener noreferrer">NPM</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-body-base text-body-base" href={links.issues} target="_blank" rel="noopener noreferrer">Issues</a>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-lg transition-all cursor-pointer" 
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <a href={links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary text-on-primary font-body-base text-body-base px-4 py-2 rounded-lg font-medium active:scale-95 transition-transform">
            <Github size={16} />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-surface-bright border-t border-border-subtle w-full py-12 mt-24">
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <a href={links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
          <div className="w-6 h-6 bg-secondary-fixed rounded-full flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-300 to-cyan-200"></div>
          </div>
          <span className="text-on-surface-variant text-sm">
            By <span className="font-semibold text-primary">Github-Suriya</span>
          </span>
        </a>
        <div className="flex gap-8">
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm underline-offset-4 hover:underline" href={links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm underline-offset-4 hover:underline" href="/getting-start">Docs</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm underline-offset-4 hover:underline" href={links.issues} target="_blank" rel="noopener noreferrer">Issues</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm underline-offset-4 hover:underline" href={links.npm} target="_blank" rel="noopener noreferrer">NPM</a>
        </div>
        <p className="text-on-surface-variant text-label-sm font-label-sm">
          (c) 2026 Vanilla Toast JS. MIT licensed.
        </p>
      </div>
    </footer>
  );
}
