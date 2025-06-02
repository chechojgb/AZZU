import { useSpyCall } from './utils/useSpyCall';
import {
  HiOutlineSpeakerWave,
  HiMiniMicrophone,
  HiMiniStopCircle,
  HiMiniPlayCircle,
} from 'react-icons/hi2';

function ListenRecords({ extension }) {
  const {
    isRegistered,
    isCalling,
    mode,
    startCall,
    stopCall,
    toggleMode,
  } = useSpyCall(extension);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 w-full max-w-4xl mx-auto transition-all">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white p-2 rounded-full ring-2 ring-indigo-300">
            <HiOutlineSpeakerWave className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isCalling ? 'Escuchando llamada' : 'No estás escuchando'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supervisión activa de la llamada
            </p>
          </div>
        </div>
        {isCalling && (
          <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold tracking-wide shadow-sm">
            {mode === 'normal' ? 'Modo escucha' : 'Modo susurro'}
          </span>
        )}
      </div>

      {/* Indicador de registro SIP */}
      {!isRegistered && (
        <div className="mb-4 text-sm text-red-500">
          ⚠️ No estás registrado aún. Esperando conexión con el servidor SIP.
        </div>
      )}

      {/* Línea de progreso */}
      {isCalling && (
        <div className="mb-6">
          <div className="w-full h-2 bg-blue-100 rounded-full">
            <div className="h-2 bg-blue-600 rounded-full w-3/4 transition-all duration-500" />
          </div>
          <p className="text-right text-xs text-gray-500 mt-1">Duración: 02:43</p>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-4">
        {isCalling ? (
          <>
            <button
              onClick={stopCall}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition"
            >
              <HiMiniStopCircle className="w-5 h-5" />
              Detener escucha
            </button>
            <button
              onClick={toggleMode}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition"
            >
              <HiMiniMicrophone className="w-5 h-5" />
              {mode === 'normal' ? 'Cambiar a susurro' : 'Cambiar a escucha'}
            </button>
          </>
        ) : (
          <button
            onClick={() => startCall('normal')}
            disabled={!isRegistered}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
              isRegistered
                ? 'bg-blue-100 dark:bg-blue-800/70 text-gray-900 dark:text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } shadow-inner hover:shadow-md transition`}
          >
            <HiMiniPlayCircle className="w-5 h-5 text-blue-500" />
            Iniciar escucha
          </button>
        )}
      </div>
    </div>
  );
}

export default ListenRecords;
