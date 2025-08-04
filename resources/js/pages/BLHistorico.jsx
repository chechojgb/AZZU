// resources/js/pages/BLHistorico.jsx

import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, PackageCheck, ArrowDown, ArrowUp } from "lucide-react";
import EntradaBL from "@/components/BL/historicoBL";

const breadcrumbs = [{ title: "Histórico", href: "/BLproductosInventario/historico" }];

const entregados = [
  { id: 1, cliente: "ModaClick", fecha: "2024-03-15", producto: "Botón Z6", cantidad: 1000 },
  { id: 2, cliente: "Diseños SAS", fecha: "2024-04-02", producto: "Botón V3", cantidad: 2500 },
  { id: 3, cliente: "Ejemplo", fecha: "2024-04-05", producto: "Botón F2", cantidad: 1200 },
  { id: 4, cliente: "Ejemplo", fecha: "2024-04-06", producto: "Botón G9", cantidad: 1100 },
  { id: 5, cliente: "Ejemplo", fecha: "2024-04-07", producto: "Botón X4", cantidad: 1400 },
  { id: 6, cliente: "Ejemplo", fecha: "2024-04-08", producto: "Botón W1", cantidad: 1800 },
  // agrega más para probar el scroll
];

const entradas = [
  { id: 1, fecha: "2024-03-01", producto: "Botón Z6", cantidad: 2000 },
  { id: 2, fecha: "2024-04-01", producto: "Botón V3", cantidad: 3000 },
  { id: 3, fecha: "2024-04-03", producto: "Botón K9", cantidad: 1000 },
  { id: 4, fecha: "2024-04-04", producto: "Botón H3", cantidad: 1500 },
  { id: 5, fecha: "2024-04-05", producto: "Botón Y1", cantidad: 1200 },
];

const salidas = [
  { id: 1, fecha: "2024-03-10", producto: "Botón Z6", cantidad: 1000 },
  { id: 2, fecha: "2024-04-10", producto: "Botón V3", cantidad: 500 },
  { id: 3, fecha: "2024-04-11", producto: "Botón L2", cantidad: 1300 },
  { id: 4, fecha: "2024-04-12", producto: "Botón M4", cantidad: 1100 },
  { id: 5, fecha: "2024-04-13", producto: "Botón D7", cantidad: 1600 },
];

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

export default function BLHistorico({historico}) {
  console.log("Datos del histórico:", historico);
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Histórico de Productos" />
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Histórico de movimientos</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EntradaBL historico={historico} />
          <Seccion
            title="Salidas de Productos"
            icon={ArrowUp}
            color="text-red-500"
            data={salidas}
          />
          <Seccion
            title="Pedidos Entregados"
            icon={PackageCheck}
            color="text-blue-500"
            data={entregados}
          />
        </div>
      </div>
    </AppLayout>
  );
}
