// resources/js/components/BLHistorico/PedidoSelector.jsx
import { Select } from "flowbite-react";

const PedidoSelector = ({ 
  nuevo, 
  pedidosDisponibles, 
  seleccionarPedido 
}) => {
  return (
    <div>
      <Select
        value={nuevo.pedidoId || ""}
        onChange={(e) => {
          const pedidoSel = pedidosDisponibles.find(p => p.id == e.target.value);
          if (pedidoSel) seleccionarPedido(pedidoSel);
        }}
        className=" w-full text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Seleccionar Pedido</option>
        {pedidosDisponibles.map((p) => (
          <option 
            key={p.id} 
            value={p.id} 
            className="text-gray-700 dark:text-gray-200"
          >
            #{p.id} - {p.estado} ({p.fecha_pedido})
          </option>
        ))}
      </Select>
    </div>
  );
};

export default PedidoSelector;
