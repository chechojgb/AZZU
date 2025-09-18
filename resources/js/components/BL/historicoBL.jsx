import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp,PackageCheck } from "lucide-react";
import { format } from "date-fns"; 

export default function EntradaBL({ historico }) {
  // Convertir el objeto en array
  const historicoArray = Object.values(historico || {});

  // Filtrar solo las entradas
  const entradas = historicoArray.filter((item) => item.tipo === "entrada");

  return (
    <Card className="h-[350px] overflow-hidden shadow-md border ">
      <CardContent className="p-4 flex flex-col gap-4 h-full">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full black:bg-green-200">
            <ArrowDown className="w-5 h-5 text-green-600 black:text-green-700" />
          </div>
          <h2 className="text-lg font-bold text-green-700 tracking-tight ">
            Entrada de productos
          </h2>
        </div>

        <div className="overflow-y-auto pr-2 h-full space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {entradas.length === 0 ? (
            <p className="text-sm text-gray-500">
              Sin datos de entrada disponibles.
            </p>
          ) : (
            entradas.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start  border  p-3 rounded-lg transition hover:shadow-md"
              >
                <div className="space-y-1">
                  <p className="font-semibold ">
                    {item.producto || "No existe"} - {item.tamanio} - {item.color}
                  </p>
                  <p className="text-xs ">
                    {item.fecha} — {item.tipo || "sin tipo"} —{" "}
                    <span className="font-medium">{item.usuario}</span>
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-sm  border-green-300 text-green-600"
                >
                  {item.cantidad_por_empaque} und
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}



export function MarcacionBL({ marcacion }) {
  // Filtrar solo los pedidos
  const marcaciones = marcacion?.filter((item) => item.tipo === "pedido") || [];

  // Agrupar según motivo
  const enProceso = marcaciones.filter(
    (item) => item.motivo === "Cambio de estado a en proceso"
  );
  const completados = marcaciones.filter(
    (item) => item.motivo === "Cambio de estado a completado"
  );

  return (
    <Card className="h-[350px] overflow-hidden shadow-md border">
      <CardContent className="p-4 flex flex-col gap-4 h-full">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-50 p-2 rounded-full dark:bg-yellow-200">
            <ArrowUp className="w-5 h-5 text-yellow-400 dark:text-yellow-700" />
          </div>
          <h2 className="text-lg font-bold text-yellow-700 tracking-tight">
            Items en marcación
          </h2>
        </div>

        <div className="overflow-y-auto pr-2 h-full space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* En proceso */}
          <div>
            <h3 className="text-sm font-semibold text-blue-600 mb-2">
              En proceso
            </h3>
            {enProceso.length === 0 ? (
              <p className="text-xs text-gray-500">
                No hay items en proceso.
              </p>
            ) : (
              enProceso.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border p-3 rounded-lg transition hover:shadow-md"
                >
                  <div className="space-y-1">
                    <p className="font-semibold">{item?.motivo}</p>
                    <p className="text-xs">
                      {format(new Date(item.updated_at), "dd-MM-yyyy HH:mm")} —{" "}
                      {item.tipo || "sin tipo"} —{" "}
                      <span className="font-medium">
                        {item?.usuario?.name || "Sin usuario"}
                      </span>
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-sm border-blue-300 text-blue-600"
                  >
                    {item.cantidad} und
                  </Badge>
                </div>
              ))
            )}
          </div>

          {/* Completados */}
          <div>
            <h3 className="text-sm font-semibold text-green-600 mb-2">
              Completados
            </h3>
            {completados.length === 0 ? (
              <p className="text-xs text-gray-500">
                No hay items completados.
              </p>
            ) : (
              completados.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border p-3 rounded-lg transition hover:shadow-md"
                >
                  <div className="space-y-1">
                    <p className="font-semibold">{item?.motivo}</p>
                    <p className="text-xs">
                      {format(new Date(item.updated_at), "dd-MM-yyyy HH:mm")} —{" "}
                      {item.tipo || "sin tipo"} —{" "}
                      <span className="font-medium">
                        {item?.usuario?.name || "Sin usuario"}
                      </span>
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-sm border-green-300 text-green-600"
                  >
                    {item.cantidad} und
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EntregaBL({ entrega }) {
  // Filtrar solo los pedidos
  const entregado = entrega?.filter((item) => item.estado === "entregado") || [];


  return (
    <Card className="h-[350px] overflow-hidden shadow-md border">
      <CardContent className="p-4 flex flex-col gap-4 h-full">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-50 p-2 rounded-full dark:bg-blue-200">
              <PackageCheck className="w-5 h-5 text-blue-400 dark:text-blue-700" />
            </div>
            <h2 className="text-lg font-bold text-blue-700 tracking-tight">
              Pedidos entregados
            </h2>
          </div>

            {/* entregados */}
            <div className="overflow-y-auto pr-2 h-full space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {entregado.length === 0 ? (
                <p className="text-xs text-gray-500">
                  No hay pedidos entregados.
                </p>
              ) : (
                entregado.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start border p-3 rounded-lg transition hover:shadow-md"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">PED #{item?.id}</p>
                      <p className="text-xs">fecha entrega:
                        {format(new Date(item.updated_at), "dd-MM-yyyy HH:mm")} —{" "}
                        {item.tipo || "sin tipo"} —{" "}
                        <span className="font-medium">
                          {item?.cliente?.nombre || "Sin cliente"}
                        </span>
                      </p>
                    </div>

                  </div>
                ))
              )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}