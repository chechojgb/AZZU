// resources/js/pages/BLHistorico.jsx

import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, PackageCheck, ArrowDown, ArrowUp } from "lucide-react";
import EntradaBL from "@/components/BL/historicoBL";
import { MarcacionBL } from "@/components/BL/historicoBL";
import { EntregaBL } from "@/components/BL/historicoBL";

const breadcrumbs = [{ title: "Histórico", href: "/BLproductosInventario/historico" }];

function Seccion({ title, icon: Icon, color, data }) {
  return (
    <Card className="h-[350px] overflow-hidden">
      <CardContent className="p-4 flex flex-col gap-4 h-full">
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${color}`} />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        <div className="overflow-y-auto pr-2 h-full">
          {data.length === 0 ? (
            <p className="">Sin datos disponibles.</p>
          ) : (
            <div className="space-y-2">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border p-2 rounded-md shadow-sm  hover:bg-gray-100"
                >
                  <div>
                    <p className="font-medium">{item.producto}</p>
                    <p className="text-sm ">
                      {item.fecha} {item.cliente && `| Cliente: ${item.cliente}`}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {item.cantidad} unidades
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function BLHistorico({entrada, marcacion, entrega}) {
  console.log("Datos del histórico:", entrada);
  console.log("Datos de marcacion:", marcacion);
  console.log("Datos de entrega:", entrega);
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Histórico de Productos" />
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Histórico de movimientos</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EntradaBL historico={entrada || []} />
          <MarcacionBL marcacion={marcacion}/>
          <EntregaBL entrega={entrega}/>
        </div>
      </div>
    </AppLayout>
  );
}
