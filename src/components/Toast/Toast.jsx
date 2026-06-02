import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className={styles.icon} />;
      case 'error':
        return <XCircle className={styles.icon} />;
      case 'warning':
        return <AlertCircle className={styles.icon} />;
      case 'info':
      default:
        return <Info className={styles.icon} />;
    }
  };

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type] || styles.info}`}
          role="alert"
          aria-live="assertive"
        >
          <div className={styles.content}>
            {getIcon(toast.type)}
            <span className={styles.message}>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className={styles.closeBtn}
            aria-label="Fechar notificação"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
