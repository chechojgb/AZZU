import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import GraficoProduccionSemanalBL from '@/components/BL/GraficoProduccionSemanal';
import { Separator } from '@/components/ui/separator';
import { CardHeader } from "@/components/ui/card";

const datosClientes = [
  { cliente: 'Cliente A', total: 120 },
  { cliente: 'Cliente B', total: 95 },
  { cliente: 'Cliente C', total: 70 },
  { cliente: 'Cliente D', total: 40 },
  { cliente: 'Cliente E', total: 25 },
];

const datosComparativa = [
  { periodo: 'Julio', valor: 420 },
  { periodo: 'Agosto', valor: 530 },
];

export default function BLAnalisis({pedidosMes, cantidadProduccion, clientesActivos, cantidadProductosStock, rankingClientes}) {
  console.log(rankingClientes);
  
  return (
    <AppLayout breadcrumbs={[{ title: 'Análisis', href: '/BLproductosInventario/analisis' }]}>
      <Head title="Análisis" />
      <div className="flex flex-col gap-4 p-4 min-h-screen">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Resumen de Análisis</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Pedidos este mes</p>
              <p className="text-2xl font-bold">{pedidosMes}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Producción total</p>
              <p className="text-2xl font-bold">{cantidadProduccion}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Clientes activos</p>
              <p className="text-2xl font-bold">{clientesActivos}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Productos en stock</p>
              <p className="text-2xl font-bold">{cantidadProductosStock}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 h-[300px]">
            <Card className="h-full">
              <CardContent className="h-full">
                <GraficoProduccionSemanalBL />
              </CardContent>
            </Card>
          </div>

            <div className="h-[300px]">
                <Card className="h-full flex flex-col">
                    <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Ranking de Clientes
                    </h3>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto"> {/* Contenido desplazable */}
                    <ul className="grid gap-2">
                        {rankingClientes.map((item, idx) => (
                        <li
                            key={idx}
                            className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                            <div className="flex items-center gap-3">
                            <div className="text-lg font-bold text-gray-400 w-6 text-right">{idx + 1}</div>
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">{item.nombre}</div>
                            </div>
                            <div className="text-sm font-bold text-blue-600">{item.pedidos_count}</div>
                        </li>
                        ))}
                    </ul>
                    </CardContent>
                </Card>
            </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Comparativa entre periodos</h3>
                <div className="grid grid-cols-2 gap-2">
                {datosComparativa.map((item, idx) => (
                    <div
                    key={idx}
                    className="p-3 rounded-md shadow bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900"
                    >
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.periodo}</p>
                    <p className="text-2xl font-bold text-blue-700">{item.valor}</p>
                    </div>
                ))}
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Notas del análisis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Estos datos son de ejemplo y sirven como referencia para el análisis del rendimiento de
                pedidos, clientes y producción. Los valores pueden actualizarse cada semana.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
