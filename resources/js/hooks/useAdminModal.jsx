import { useState } from 'react';

export default function useAdminModal() {
  const [modal, setModal] = useState({ show: false, message: '' });

  const showModal = (message) => {
    setModal({ show: true, message });
  };

  const hideModal = () => {
    setModal({ show: false, message: '' });
  };

  return { modal, showModal, hideModal };
}
