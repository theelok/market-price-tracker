import { createContext, useCallback, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const dismiss = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback((type, message) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const success = useCallback((message) => notify('success', message), [notify]);
  const error = useCallback((message) => notify('error', message), [notify]);

  return (
    <NotificationContext.Provider value={{ success, error }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            role="alert"
            className={`flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg ring-1 animate-in slide-in-from-right ${
              n.type === 'success'
                ? 'bg-white text-grocery-800 ring-grocery-200'
                : 'bg-white text-red-800 ring-red-200'
            }`}
          >
            <span className="text-lg">{n.type === 'success' ? '✓' : '✕'}</span>
            <p className="flex-1 text-sm font-medium">{n.message}</p>
            <button
              type="button"
              onClick={() => dismiss(n.id)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}
