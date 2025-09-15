// resources/js/components/BLHistorico/TrabajadorSelector.jsx
import { Select } from "flowbite-react";

const TrabajadorSelector = ({ 
  nuevo, 
  buttonUser, 
  setNuevo, 
  itemsDisponibles, 
  setPrecios 
}) => {
  return (
    <div>
      <Select
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
        className="w-full text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Seleccionar Trabajador</option>
        {buttonUser.map((u) => (
          <option 
            key={u.id} 
            value={u.id} 
            className="text-gray-700 dark:text-gray-200"
          >
            {u.name}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default TrabajadorSelector;
