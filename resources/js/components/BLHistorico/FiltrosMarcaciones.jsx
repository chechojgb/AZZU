// resources/js/components/BLHistorico/FiltrosMarcaciones.jsx
const FiltrosMarcaciones = ({ filtroActivo, onChangeFiltro }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onChangeFiltro('enProceso')}
        className={`px-4 py-2 rounded-lg font-medium ${
          filtroActivo === 'enProceso'
            ? 'bg-yellow-500 text-white'
            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
        }`}
      >
        🟡 En Proceso
      </button>
      
      <button
        onClick={() => onChangeFiltro('completados')}
        className={`px-4 py-2 rounded-lg font-medium ${
          filtroActivo === 'completados'
            ? 'bg-green-500 text-white'
            : 'bg-green-100 text-green-800 hover:bg-green-200'
        }`}
      >
        ✅ Completados
      </button>
      
      <button
        onClick={() => onChangeFiltro('pendientes')}
        className={`px-4 py-2 rounded-lg font-medium ${
          filtroActivo === 'pendientes'
            ? 'bg-blue-500 text-white'
            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        }`}
      >
        ⏳ Pendientes
      </button>
      
      <button
        onClick={() => onChangeFiltro('todos')}
        className={`px-4 py-2 rounded-lg font-medium ${
          filtroActivo === 'todos'
            ? 'bg-gray-500 text-white'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        📋 Todos
      </button>
    </div>
  );
};

export default FiltrosMarcaciones;