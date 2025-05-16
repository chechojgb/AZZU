import { useState } from 'react';
import hangupChannel from '@/components/actionsAgent/deleteCall';
import PausedExtension from '@/components/actionsAgent/pausedExtension';
import UnpauseExtension from '@/components/actionsAgent/unpauseExtension';
import TransferCall from '@/components/actionsAgent/transferCall';

export default function useAdminHandlers(data) {
  const [toast, setToast] = useState({ show: false, success: true, message: '' });

  const showToast = (result) => {
    setToast({ show: true, success: result.success, message: result.message });
    setTimeout(() => setToast({ show: false, success: true, message: '' }), 4000);
  };

  const handleHangup = async () => {
    const result = await hangupChannel(data?.canal);
    showToast(result);
  };

  const handlePause = async () => {
    const result = await PausedExtension(data?.extension);
    showToast(result);
  };

  const handleUnpause = async () => {
    const result = await UnpauseExtension(data?.extension);
    showToast(result);
  };

  const handleTransfer = async (destino) => {
    const result = await TransferCall({ canal: data?.canalRelacionado, destino });
    showToast(result);
  };


  return { handleHangup, handlePause, handleUnpause,handleTransfer, toast };
}