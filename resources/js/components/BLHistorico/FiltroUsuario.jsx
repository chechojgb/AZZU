// resources/js/components/BLHistorico/FiltroUsuario.jsx
const FiltroUsuario = ({ usuarios, usuarioFiltro, onChangeUsuarioFiltro }) => {
  const handleUsuarioChange = (e) => {
    const nuevoValor = e.target.value || null;
    console.log("👤 FILTRO USUARIO: Seleccionado:", {
      usuarioId: nuevoValor,
      usuarioNombre: nuevoValor ? usuarios.find(u => u.id.toString() === nuevoValor)?.name : "TODOS"
    });
    onChangeUsuarioFiltro(nuevoValor);
  };

  const handleLimpiarFiltro = () => {
    console.log("👤 FILTRO USUARIO: Limpiando filtro - Mostrando TODOS los usuarios");
    onChangeUsuarioFiltro(null);
  };

  return (
    <div className="mb-4 p-3 bg-white rounded-lg shadow border">
      <label htmlFor="filtro-usuario" className="block text-sm font-medium text-gray-700 mb-2">
        👤 Filtrar por usuario:
      </label>
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <select
          id="filtro-usuario"
          value={usuarioFiltro || ''}
          onChange={handleUsuarioChange}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        >
          <option value="">Todos los usuarios</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.name}
            </option>
          ))}
        </select>
        
        {usuarioFiltro && (
          <button
            onClick={handleLimpiarFiltro}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium w-full sm:w-auto"
          >
            Limpiar filtro
          </button>
        )}
      </div>
    </div>
  );
};

export default FiltroUsuario;