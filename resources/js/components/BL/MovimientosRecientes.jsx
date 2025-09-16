import { ArrowDownCircle, ArrowUpCircle, Users, Package, ClipboardList } from 'lucide-react';

export default function MovimientosRecientesBL({ movimientos }) {
  return (
    <div className="relative flex flex-col h-full p-5">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Movimientos recientes
      </h3>

      {/* Lista scrollable */}
      <div className="flex-1 overflow-y-auto pr-1">
        <ul className="space-y-4 text-sm text-gray-800 dark:text-gray-300">
          {movimientos.map((mov, i) => {
            // Icono según tipo de movimiento
            let icono;
            switch (mov.tipo) {
              case "entrada":
                icono = <ArrowDownCircle className="text-green-600 w-5 h-5" />;
                break;
              case "salida":
                icono = <ArrowUpCircle className="text-red-600 w-5 h-5" />;
                break;
              case "pedido":
                icono = <ClipboardList className="text-blue-600 w-5 h-5" />;
                break;
              case "marcacion":
                icono = <Package className="text-yellow-600 w-5 h-5" />;
                break;
              case "cliente":
                icono = <Users className="text-purple-600 w-5 h-5" />;
                break;
              default:
                icono = <Package className="text-gray-400 w-5 h-5" />;
            }

            // Nombre dinámico según tipo de movible
            let nombre;
            if (mov.empaque?.producto?.descripcion) {
              nombre = mov.empaque.producto.descripcion;
            } else if (mov.movible?.nombre) {
              nombre = mov.movible.nombre;
            } else if (mov.movible?.descripcion) {
              nombre = mov.movible.descripcion;
            }else if (mov?.motivo){
              nombre = mov.motivo;
            } else {
              nombre = "Sin información";
            }

            return (
              <li key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                    {icono}
                  </div>
                  <div>
                    <p className="font-medium">
                      {mov.tipo.toUpperCase()}: {nombre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Fecha: {new Date(mov.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
