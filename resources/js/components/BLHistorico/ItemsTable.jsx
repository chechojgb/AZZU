// resources/js/components/BLHistorico/ItemsTable.jsx
const ItemsTable = ({ 
  itemsDisponibles, 
  seleccionados, 
  setSeleccionados, 
  nuevo, 
  precios, 
  setPrecios 
}) => {
  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Items del Pedido</h3>
      <table className="w-full text-sm border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1">Referencia</th>
            <th className="px-2 py-1">Cantidad</th>
            <th className="px-2 py-1">Nota</th>
            {nuevo.proyecto === "Button LoversMN" && (
              <th className="px-2 py-1">💲 Precio Unitario</th>
            )}
            <th className="px-2 py-1">Seleccionar</th>
          </tr>
        </thead>
        <tbody>
          {itemsDisponibles.map((item) => {
            const yaMarcado = item.marcaciones && item.marcaciones.length > 0;

            return (
              <tr key={item.id} className="border-t">
                <td className="px-2 py-1">{item.empaque?.producto?.descripcion}</td>
                <td className="px-2 py-1">{item.cantidad_empaques}</td>
                <td className="px-2 py-1">{item.nota || "—"}</td>
                {nuevo.proyecto === "Button LoversMN" && (
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      value={precios[item.id] || ""}
                      onChange={(e) => setPrecios({
                        ...precios,
                        [item.id]: e.target.value
                      })}
                      className="border rounded p-1 w-20"
                      disabled={yaMarcado}
                    />
                  </td>
                )}
                <td className="px-2 py-1 text-center">
                  {yaMarcado ? (
                    <span className="text-red-500 font-semibold">
                      En proceso por {item.marcaciones.slice(-1)[0]?.trabajador?.name}
                    </span>
                  ) : (
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSeleccionados([...seleccionados, item.id]);
                        } else {
                          setSeleccionados(seleccionados.filter(id => id !== item.id));
                        }
                      }}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsTable;