import React, { useEffect, useState } from 'react';

const BigModalWrapper = ({ children, closeModal }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(closeModal, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-40 backdrop-blur-sm p-2 sm:p-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`transform transition-all duration-300 ease-out
          ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          bg-white dark:bg-black border rounded-xl shadow-xl 
          w-full sm:max-w-6xl max-h-[95vh] overflow-y-auto`}
      >
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BigModalWrapper;
