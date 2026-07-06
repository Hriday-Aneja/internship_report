import React, { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message = '', onClose, tone = 'success' }) {
  useEffect(() => {
    const t = setTimeout(() => {
      if (onClose) onClose();
    }, 2000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`cw-toast cw-toast-${tone}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
