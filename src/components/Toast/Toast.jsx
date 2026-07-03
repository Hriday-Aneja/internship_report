import React, { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message = '', onClose }) {
  useEffect(() => {
    const t = setTimeout(() => {
      if (onClose) onClose();
    }, 2000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="cw-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}
