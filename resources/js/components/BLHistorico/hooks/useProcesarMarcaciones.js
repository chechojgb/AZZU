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
            pedido: `#${pedido.id} - ${pedido.estado}`,
            referencia: item.empaque?.producto?.descripcion || "Sin descripción",
            cantidad: item.cantidad_empaques,
            nota: item.nota || "—",
            fecha_pedido: pedido.fecha_pedido,
            itemId: item.id,
            pedidoId: pedido.id
          };
          
          if (item.marcaciones && item.marcaciones.length > 0) {
            const ultimaMarcacion = item.marcaciones[item.marcaciones.length - 1];
            
            const marcacionData = {
              ...itemData,
              trabajador: ultimaMarcacion.trabajador?.name || "Desconocido",
              fecha_marcacion: ultimaMarcacion.fecha,
              marcacionId: ultimaMarcacion.id
            };
            
            // Lógica para determinar si está completado o en proceso
            // (Ajusta según tus criterios específicos)
            if (ultimaMarcacion.cantidad >= item.cantidad_empaques) {
              completados.push(marcacionData);
            } else {
              enProceso.push(marcacionData);
            }
          } else {
            pendientes.push(itemData);
          }
        });
      });
    });
    
    return { enProceso, completados, pendientes };
  }, [orderCustomer]);
};