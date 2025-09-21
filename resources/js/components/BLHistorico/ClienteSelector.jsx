const ClienteSelector = ({ 
  nuevo, 
  handleChange, 
  sugerencias, 
  seleccionarCliente 
}) => {
  // Asegurar que nuevo.cliente siempre sea string
  const clienteValue = nuevo.cliente || '';
  
  return (
    <div className="relative">
      <input
        type="text"
        name="cliente"
        placeholder="Cliente"
        value={clienteValue}
        onChange={handleChange}
        className="border rounded-lg p-2 w-full"
      />
      {sugerencias && sugerencias.length > 0 && (
        <ul className="absolute z-10 bg-white dark:bg-gray-800 border rounded-lg shadow-md mt-1 w-full max-h-40 overflow-y-auto">
          {sugerencias.map((c) => (
            <li
              key={c.id}
              onClick={() => seleccionarCliente(c)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {c.nombre} ({c.nit})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClienteSelector;