import { useState, useEffect } from 'react';

export type ToastType = 'default' | 'description' | 'success' | 'info' | 'warning' | 'error' | 'action' | 'promise';

export interface ToastProps {
  id: string;
  type: ToastType;
  msg: string;
  desc?: string;
  action?: string;
  spin?: boolean;
  onActionClick?: () => void;
}

type Listener = (toasts: ToastProps[]) => void;

let toasts: ToastProps[] = [];
let listeners: Listener[] = [];

const emit = () => listeners.forEach((l) => l(toasts));

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Global toast trigger method
export const toast = (msg: string, options?: Partial<ToastProps>) => {
  const id = generateId();
  const newToast = { id, msg, type: 'default', ...options } as ToastProps;
  toasts = [newToast, ...toasts];
  emit();

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 4000);
};

// Shorthand convenience methods
toast.success = (msg: string, options?: Partial<ToastProps>) => toast(msg, { ...options, type: 'success' });
toast.error = (msg: string, options?: Partial<ToastProps>) => toast(msg, { ...options, type: 'error' });
toast.info = (msg: string, options?: Partial<ToastProps>) => toast(msg, { ...options, type: 'info' });
toast.warning = (msg: string, options?: Partial<ToastProps>) => toast(msg, { ...options, type: 'warning' });
toast.promise = (p: Promise<any>, options: { loading: string; success: string; error: string }) => {
  const id = generateId();
  toasts = [{ id, msg: options.loading, type: 'promise', spin: true }, ...toasts];
  emit();
   
  p.then(() => {
    toasts = toasts.map(t => t.id === id ? { ...t, msg: options.success, type: 'success', spin: false } : t);
    emit();
    setTimeout(() => { toasts = toasts.filter((t) => t.id !== id); emit(); }, 4000);
  }).catch(() => {
    toasts = toasts.map(t => t.id === id ? { ...t, msg: options.error, type: 'error', spin: false } : t);
    emit();
    setTimeout(() => { toasts = toasts.filter((t) => t.id !== id); emit(); }, 4000);
  });
};

export const useToasts = () => {
  const [currToasts, setCurrToasts] = useState<ToastProps[]>(toasts);
  
  useEffect(() => {
    const listener = (t: ToastProps[]) => setCurrToasts([...t]);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);
  
  return currToasts.slice(0, 3); // Max 3 visible according to specs
};
