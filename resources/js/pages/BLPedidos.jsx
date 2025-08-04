import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
  { title: "Pedidos BL", href: "/BLproductosInventario/pedidos" }
];

export default function BLPedidos({ user }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pedidos" />

      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Lista de pedidos</h2>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full text-sm text-left   border ">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">Cliente</th>
                <th scope="col" className="px-6 py-3">Productos</th>
                <th scope="col" className="px-6 py-3">Fecha acordada</th>
                <th scope="col" className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4">Textiles Zuluaga</td>
                <td className="px-6 py-4 space-y-1">
                  <div>Botón Azul <span className="text-gray-500">x300</span></div>
                  <div>Botón Rojo <span className="text-gray-500">x150</span></div>
                </td>
                <td className="px-6 py-4">2025-08-08</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                    En proceso
                  </span>
                </td>
              </tr>

              <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4">Confecciones Lara</td>
                <td className="px-6 py-4 space-y-1">
                  <div>Botón Negro <span className="text-gray-500">x100</span></div>
                </td>
                <td className="px-6 py-4">2025-08-10</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    Entregado
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
