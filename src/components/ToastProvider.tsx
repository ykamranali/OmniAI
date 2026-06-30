"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        className: '',
        style: {
          background: '#1A233A',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      }} 
    />
  );
}
