import React from "react";
import { useState } from "react";
import AgentModalWrapper from '@/components/agentsModalWrapper';

function TransferModal ({hideModal, handlers}){
    const [selectedOperation, setSelectedOperation] = useState(null)
    return(
        <>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Transferir llamada</h3>
            
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              ⚠️ Esta acción puede afectar la llamada en curso. El registro de la transferencia quedará guardado en el sistema.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Selecciona la operación de destino:</label>
              <div className="grid grid-cols-2 gap-2">
                {['Tramites', 'Soporte', 'Movil', 'Retencion', 'Pruebas'].map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedOperation(area)} 
                    className={`w-full py-2 px-3 text-sm rounded-md font-medium border dark:border-gray-600 transition ${
                      selectedOperation === area
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={hideModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm font-medium text-gray-800 dark:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handlers.handleTransfer(selectedOperation);
                  hideModal();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
                disabled={!selectedOperation}
              >
                Confirmar
              </button>
            </div>
          </>
    );
}

export default TransferModal;