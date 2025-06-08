import React, { useEffect, useState } from 'react';

const AgentModalWrapper = ({ children, closeModal }) => {
  const [show, setShow] = useState(false);

  if (children && children.props && children.props.agent) {
    console.log('Abriendo o cerrando modal para:', children.props.agent.name);
  }

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
      className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-25 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`mx-2 transform transition-all duration-300 ease-out ${
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } bg-white dark:bg-gray-800 border rounded-xl p-4 shadow max-w-sm w-full`}
      >
        {children}
      </div>
    </div>
  );
};

export default AgentModalWrapper;
