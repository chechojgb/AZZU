// resources/js/components/BLHistorico/hooks/useProcesarMarcaciones.js
import { useMemo } from 'react';

export const useProcesarMarcaciones = (orderCustomer) => {
  return useMemo(() => {
    const enProceso = [];
    const completados = [];
    const pendientes = [];
    
    if (!orderCustomer) return { enProceso, completados, pendientes };
    
    orderCustomer.forEach(cliente => {
      cliente.pedidos?.forEach(pedido => {
        pedido.items?.forEach(item => {
          const itemData = {
            id: item.id,
            cliente: cliente.nombre,
            clienteId: cliente.id,
            pedido: `#${pedido.id} - ${pedido.estado}`,
            pedidoId: pedido.id,
            referencia: item.empaque?.producto?.descripcion || "Sin descripción",
            cantidad: item.cantidad_empaques,
            nota: item.nota || "—",
            estado: item.estado || 'pendiente',
            // Información de marcaciones si existe
            marcaciones: item.marcaciones || [],
            trabajador: item.marcaciones?.[item.marcaciones.length - 1]?.trabajador?.name || null,
            fecha_marcacion: item.marcaciones?.[item.marcaciones.length - 1]?.fecha || null
          };
          
          // Clasificar según el estado
          if (item.estado === 'en_proceso') {
            enProceso.push(itemData);
          } else if (item.estado === 'completado' || item.estado === 'marcado') {
            completados.push(itemData);
          } else {
            pendientes.push(itemData);
          }
        });
      });
    });
    
    return { enProceso, completados, pendientes };
  }, [orderCustomer]);
};