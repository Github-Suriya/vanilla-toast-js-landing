import { useEffect, useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Globe, 
  Activity, 
  MapPin, 
  RefreshCw, 
  Search, 
  Monitor, 
  ShieldAlert,
  Moon,
  Sun
} from 'lucide-react';
import { motion } from 'motion/react';

interface VisitLog {
  ip: string;
  country: string;
  city: string;
  userAgent: string;
  timestamp: string;
}

function parseUserAgent(ua: string) {
  if (!ua) return 'Unknown Client';
  let browser = 'Browser';
  let os = 'OS';

  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('SamsungBrowser')) browser = 'Samsung';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
  else if (ua.includes('Edge') || ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Macintosh')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  return `${browser} on ${os}`;
}

export default function VisitsPage({ 
  theme, 
  setTheme 
}: { 
  theme: 'light' | 'dark' | 'system'; 
  setTheme: (theme: 'light' | 'dark' | 'system') => void; 
}) {
  const [logs, setLogs] = useState<VisitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStaticMode, setIsStaticMode] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/visits.php');
      if (!res.ok) throw new Error('Server API failed');
      const data = await res.json();
      setLogs(data);
      setIsStaticMode(false);
    } catch (err: any) {
      // Fallback to localStorage data if server endpoint fails (e.g. purely static hosting)
      try {
        const localVisitsJson = localStorage.getItem('vanilla_toast_local_visits');
        if (localVisitsJson) {
          setLogs(JSON.parse(localVisitsJson));
          setIsStaticMode(true);
        } else {
          throw new Error('Visits API could not connect and no local browser logs were found.');
        }
      } catch (localErr: any) {
        setError(localErr.message || 'Could not connect to database API.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter logs based on search query
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const search = searchQuery.toLowerCase();
      return (
        log.ip?.toLowerCase().includes(search) ||
        log.country?.toLowerCase().includes(search) ||
        log.city?.toLowerCase().includes(search) ||
        parseUserAgent(log.userAgent).toLowerCase().includes(search)
      );
    });
  }, [logs, searchQuery]);

  // Compute stats
  const stats = useMemo(() => {
    const total = logs.length;
    const countries = new Set(logs.map(log => log.country).filter(Boolean));
    const countryCounts: Record<string, number> = {};
    
    logs.forEach(log => {
      if (log.country) {
        countryCounts[log.country] = (countryCounts[log.country] || 0) + 1;
      }
    });

    const topCountry = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      total,
      uniqueCountries: countries.size,
      topCountry
    };
  }, [logs]);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 lg:px-10">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </a>

          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Activity size={16} className="text-red-500 animate-pulse" />
            Visits Analytics Dashboard
          </div>

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-lg transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-5 py-10 lg:px-10 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold leading-tight tracking-normal text-primary md:text-4xl">Visitor Traffic</h1>
            <p className="mt-2 text-sm text-on-surface-variant">Real-time connection metrics for Vanilla Toast JS</p>
          </div>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-subtle bg-surface-container-low px-4 py-2 text-sm font-medium text-primary hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-55"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh Logs
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-bento-gap">
          <div className="bg-surface-container-low border border-border-subtle p-5 rounded-xl flex items-center gap-4 hover:shadow-sm transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <Activity size={20} />
            </div>
            <div>
              <span className="block text-xs font-medium text-on-surface-variant">Total Visits</span>
              <span className="text-2xl font-bold text-primary">{stats.total}</span>
            </div>
          </div>

          <div className="bg-surface-container-low border border-border-subtle p-5 rounded-xl flex items-center gap-4 hover:shadow-sm transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <Globe size={20} />
            </div>
            <div>
              <span className="block text-xs font-medium text-on-surface-variant">Unique Countries</span>
              <span className="text-2xl font-bold text-primary">{stats.uniqueCountries}</span>
            </div>
          </div>

          <div className="bg-surface-container-low border border-border-subtle p-5 rounded-xl flex items-center gap-4 hover:shadow-sm transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <MapPin size={20} />
            </div>
            <div>
              <span className="block text-xs font-medium text-on-surface-variant">Top Source Country</span>
              <span className="text-2xl font-bold text-primary truncate max-w-[180px] block">{stats.topCountry}</span>
            </div>
          </div>
        </div>

        {/* Static Host Notice */}
        {isStaticMode && (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 p-4 flex items-start gap-3">
            <ShieldAlert className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Static Host Mode (cPanel/PHP Inactive)</h3>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                Visitor writes are disabled globally because this page is loaded in static mode. Showing local browser visits log.
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isStaticMode && (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-4 flex items-start gap-3">
            <ShieldAlert className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">Connection Error</h3>
              <p className="text-xs text-red-700 dark:text-red-400 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex items-center gap-3 bg-surface-container-low border border-border-subtle px-4 py-2 rounded-xl">
          <Search size={18} className="text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search by IP, country, city, or OS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-primary outline-none border-none placeholder:text-on-surface-variant/50"
          />
        </div>

        {/* Table/List */}
        <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-container-low">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-container-high text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                  <th className="px-6 py-4">IP Address</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Client System</th>
                  <th className="px-6 py-4 text-right">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm text-primary bg-surface-container-low">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                      <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-on-surface-variant/50" />
                      Loading logs...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.3) }}
                      key={index} 
                      className="hover:bg-surface-container-high/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono font-medium text-xs tracking-tight">{log.ip}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-on-surface-variant" />
                          <span className="font-semibold">{log.country || 'Unknown'}</span>
                          {log.city && <span className="text-xs text-on-surface-variant">({log.city})</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs">
                          <Monitor size={14} className="text-on-surface-variant" />
                          <span>{parseUserAgent(log.userAgent)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-on-surface-variant font-mono">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
