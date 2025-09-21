import { Select } from "flowbite-react";

const PedidoSelector = ({ 
  nuevo, 
  pedidosDisponibles, 
  seleccionarPedido 
}) => {
  const pedidos = Array.isArray(pedidosDisponibles) ? pedidosDisponibles : [];
  
  return (
    <div>
      <Select
        value={nuevo.pedidoId || ""}
        onChange={(e) => {
          const pedidoSel = pedidos.find(p => p && p.id == e.target.value);
          if (pedidoSel) seleccionarPedido(pedidoSel);
        }}
        className="w-full text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Seleccionar Pedido</option>
        {pedidos.map((p) => (
          p && p.id && (
            <option 
              key={p.id} 
              value={p.id} 
              className="text-gray-700 dark:text-gray-200"
            >
              #{p.id} - {p.estado || 'Sin estado'} ({p.fecha_pedido || 'Sin fecha'})
            </option>
          )
        ))}
      </Select>
    </div>
  );
};

export default PedidoSelector;