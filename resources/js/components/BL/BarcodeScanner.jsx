import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function BarcodeScanner({ onScan, onClose }) {
  const [error, setError] = useState(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
      <button 
        onClick={onClose}
        className="mb-4 bg-red-500 text-white px-4 py-2 rounded-lg z-10"
      >
        Cerrar Escáner
      </button>
      
      <div className="w-full max-w-md relative">
        {error && (
          <p className="text-red-500 bg-white p-2 rounded mb-2">
            Error: {error.message}
          </p>
        )}
        
        <Scanner
          onDecode={(result) => {
            onScan(result);
            onClose();
          }}
          onError={(error) => setError(error)}
          constraints={{
            facingMode: 'environment',
          }}
          containerStyle={{
            width: '100%',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            aspectRatio: '1/1'
          }}
          videoStyle={{
            objectFit: 'cover'
          }}
        />
      </div>
    </div>
  );
}
