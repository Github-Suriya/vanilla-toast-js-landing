import { useToasts } from '../lib/toastStore';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Calendar, Loader } from 'lucide-react';

export default function Toaster() {
  const toasts = useToasts();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t, index) => {
          
          let Icon = Bell;
          let colorClass = "text-primary";
          
          if (t.type === 'success') { Icon = CheckCircle; colorClass = "text-green-500"; }
          else if (t.type === 'error') { Icon = XCircle; colorClass = "text-red-500"; }
          else if (t.type === 'warning') { Icon = AlertTriangle; colorClass = "text-amber-500"; }
          else if (t.type === 'info' || t.type === 'description') { Icon = Info; colorClass = "text-blue-500"; }
          else if (t.type === 'action') { Icon = Calendar; colorClass = "text-primary"; }
          else if (t.type === 'promise') { Icon = Loader; colorClass = "text-primary animate-spin"; }

          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="bg-white border border-border-subtle p-3 rounded-xl shadow-lg w-[320px] flex items-center gap-3 pointer-events-auto"
              style={{ zIndex: 1000 - index }}
            >
              <Icon className={colorClass} size={20} />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-primary m-0 pr-2 truncate leading-tight">{t.msg}</p>
                {t.desc && <p className="text-xs text-on-surface-variant m-0 mt-0.5 truncate">{t.desc}</p>}
              </div>
              {t.action && (
                <button 
                  onClick={t.onActionClick}
                  className="text-xs font-semibold px-3 py-1.5 bg-surface-container rounded hover:bg-surface-container-high transition-colors text-primary active:scale-95 duration-150"
                >
                  {t.action}
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
