import { useState } from 'react';

export default function useOperationModal() {
   const [modal, setModal] = useState({ show: false, tipo: null });

  const showModal = (tipo) => {
    setModal({ show: true, tipo });
  };

  const hideModal = () => {
    setModal({ show: false, tipo: null });
  };

  return { modal, showModal, hideModal };
}
