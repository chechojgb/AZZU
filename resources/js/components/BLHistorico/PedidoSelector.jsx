// resources/js/components/BLHistorico/PedidoSelector.jsx
const PedidoSelector = ({ 
  nuevo, 
  pedidosDisponibles, 
  seleccionarPedido 
}) => {
  return (
    <div>
      <select
        name="pedido"
        value={nuevo.pedidoId || ""}
        onChange={(e) => {
          const pedidoSel = pedidosDisponibles.find(p => p.id == e.target.value);
          if (pedidoSel) seleccionarPedido(pedidoSel);
        }}
        className="border rounded-lg p-2 w-full"
        disabled={pedidosDisponibles.length === 0}
      >
        <option value="">Seleccionar Pedido</option>
        {pedidosDisponibles.map((p) => (
          <option key={p.id} value={p.id}>
            #{p.id} - {p.estado} ({p.fecha_pedido})
          </option>
        ))}
      </select>
    </div>
  );
};

export default PedidoSelector;