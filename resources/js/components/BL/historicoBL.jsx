import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";

function EntradaBL({ historico }) {
  // Filtrar solo las entradas
  const entradas = historico?.filter((item) => item.tipo === "entrada") || [];

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
            <p className="text-sm text-gray-500">Sin datos de entrada disponibles.</p>
          ) : (
            entradas.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start  border  p-3 rounded-lg transition hover:shadow-md"
              >
                <div className="space-y-1">
                  <p className="font-semibold ">
                    {item.producto || 'No existe'} - {item.tamanio} - {item.color}
                  </p>
                  <p className="text-xs ">
                    {item.fecha} — {item.tipo || "sin tipo"} —{" "}
                    <span className="font-medium">{item.usuario}</span>
                  </p>
                </div>
                <Badge variant="outline" className="text-sm  border-green-300 text-green-600">
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

export default EntradaBL;
