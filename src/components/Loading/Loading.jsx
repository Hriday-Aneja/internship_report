import React from 'react';
import './Loading.css';

export default function Loading() {
  return (
    <div className="cw-loading-overlay" role="status" aria-live="polite">
      <div className="cw-loading-box">
        <img src="/logo12.png" alt="C-DAC Logo" className="cw-loading-logo" />
        <div className="cw-loader" aria-hidden="true" />
      </div>
    </div>
  );
}
