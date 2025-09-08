// resources/js/components/BLHistorico/TrabajadorSelector.jsx
const TrabajadorSelector = ({ 
  nuevo, 
  buttonUser, 
  setNuevo, 
  itemsDisponibles, 
  setPrecios 
}) => {
  return (
    <div>
      <select
        name="trabajador"
        value={nuevo.trabajadorId || ""}
        onChange={(e) => {
          const user = buttonUser.find(u => u.id == e.target.value);
          if (user) {
            setNuevo(prev => ({
              ...prev,
              trabajador: user.name,
              trabajadorId: user.id,
              proyecto: user.proyecto,
            }));

            // inicializar precios si es Button LoversMN
            if (user.proyecto === "Button LoversMN") {
              const preciosIniciales = {};
              itemsDisponibles.forEach(i => {
                preciosIniciales[i.id] = "";
              });
              setPrecios(preciosIniciales);
            }
          }
        }}
        className="border rounded-lg p-2 w-full"
      >
        <option value="">Seleccionar Trabajador</option>
        {buttonUser.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TrabajadorSelector;