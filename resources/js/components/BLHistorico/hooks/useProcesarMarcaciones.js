// // resources/js/components/BLHistorico/hooks/useProcesarMarcaciones.js
// import { useMemo } from 'react';

// export const useProcesarMarcaciones = (orderCustomer) => {
//   return useMemo(() => {
//     console.log("🔄 useProcesarMarcaciones: Procesando orderCustomer", orderCustomer);
//     const enProceso = [];
//     const completados = [];
//     const pendientes = [];
//     const usuariosUnicos = new Set();
    
//     if (!orderCustomer) return { enProceso, completados, pendientes, usuarios: [] };
    
//     orderCustomer.forEach(cliente => {
//       cliente.pedidos?.forEach(pedido => {
//         pedido.items?.forEach(item => {
//           const ultimaMarcacion = item.marcaciones?.[item.marcaciones.length - 1];
//           const trabajadorId = ultimaMarcacion?.user_id;
//           const trabajadorNombre = ultimaMarcacion?.trabajador?.name;
          
//           // DEBUG: Ver el estado real del item
//           console.log("📦 Item estado:", item.estado, "ID:", item.id);
          
//           const itemData = {
//             id: item.id,
//             cliente: cliente.nombre,
//             clienteId: cliente.id,
//             pedido: `#${pedido.id} - ${pedido.estado}`,
//             pedidoId: pedido.id,
//             referencia: item.empaque?.producto?.descripcion || "Sin descripción",
//             cantidad: item.cantidad_empaques,
//             nota: item.nota || "—",
//             estado: item.estado || 'pendiente',
//             marcaciones: item.marcaciones || [],
//             trabajador: trabajadorNombre,
//             trabajadorId: trabajadorId,
//             fecha_marcacion: ultimaMarcacion?.fecha || null
//           };
          
//           // Agregar usuario a la lista de únicos si existe
//           if (trabajadorId && trabajadorNombre) {
//             usuariosUnicos.add(JSON.stringify({
//               id: trabajadorId,
//               name: trabajadorNombre
//             }));
//           }
          
//           // Clasificar según el estado - CORREGIDO
//           if (item.estado === 'en_proceso') { // CORRECCIÓN: 'en proceso' con espacio
//             enProceso.push(itemData);
//           } else if (item.estado === 'completado' || item.estado === 'marcado') {
//             completados.push(itemData);
//           } else {
//             pendientes.push(itemData);
//           }
//         });
//       });
//     });
    
//     // Convertir Set a array de usuarios
//     const usuariosArray = Array.from(usuariosUnicos).map(userStr => JSON.parse(userStr));
    
//     console.log("📊 Resultados finales:", {
//       enProceso: enProceso.length,
//       completados: completados.length,
//       pendientes: pendientes.length,
//       usuarios: usuariosArray
//     });
    
//     return { enProceso, completados, pendientes, usuarios: usuariosArray };
//   }, [orderCustomer]);
// };