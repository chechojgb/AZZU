// import AppLayout from '@/layouts/app-layout';
// import { Head } from '@inertiajs/react';

// const breadcrumbs = [
//   { title: "Clientes", href: "/clientes" }
// ];

// export default function Clientes({ clientes }) {
// return (
//     <AppLayout breadcrumbs={breadcrumbs}>
//         <Head title="Clientes" />

//         <div className="p-4 space-y-4">
//             <h2 className="text-xl font-semibold">Listado de clientes</h2>

//             <div className="overflow-x-auto rounded-lg shadow-md">
//                 {clientes.length === 0 ? (
//                     <div className="p-6 text-center text-gray-500">
//                         No hay clientes registrados.
//                     </div>
//                 ) : (
//                     <table className="w-full text-sm text-left text-gray-700 bg-white border border-gray-200">
//                         <thead className="text-xs text-gray-700 uppercase bg-gray-100">
//                             <tr>
//                                 <th className="px-6 py-3">Nombre</th>
//                                 <th className="px-6 py-3">Contacto</th>
//                                 <th className="px-6 py-3">Teléfono</th>
//                                 <th className="px-6 py-3">Ciudad</th>
//                                 <th className="px-6 py-3">Estado</th>
//                                 <th className="px-6 py-3">Acciones</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {clientes.map(cliente => (
//                                 <tr key={cliente.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
//                                     <td className="px-6 py-4">{cliente.nombre}</td>
//                                     <td className="px-6 py-4">{cliente.contacto}</td>
//                                     <td className="px-6 py-4">{cliente.telefono}</td>
//                                     <td className="px-6 py-4">{cliente.ciudad}</td>
//                                     <td className="px-6 py-4">
//                                         {cliente.activo ? (
//                                             <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Activo</span>
//                                         ) : (
//                                             <span className="inline-flex px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Inactivo</span>
//                                         )}
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <button className="text-blue-600 hover:underline mr-2">Ver</button>
//                                         <button className="text-yellow-600 hover:underline mr-2">Editar</button>
//                                         <button className="text-red-600 hover:underline">Eliminar</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     </AppLayout>
// );
// }


import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
  { title: "Clientes", href: "/clientes" }
];

// Datos de prueba (mock)
const clientesMock = [
  {
    id: 1,
    nombre: "Botonera Bogotá",
    contacto: "Carlos Pérez",
    telefono: "3214567890",
    correo: "carlos@botonera.com",
    ciudad: "Bogotá",
    activo: true,
  },
  {
    id: 2,
    nombre: "Textiles Medellín",
    contacto: "Laura Gómez",
    telefono: "3127894561",
    correo: "laura@textiles.com",
    ciudad: "Medellín",
    activo: false,
  },
  {
    id: 3,
    nombre: "Accesorios Cali",
    contacto: "Andrés Ruiz",
    telefono: "3102345678",
    correo: "andres@accesorios.com",
    ciudad: "Cali",
    activo: true,
  },
];

export default function Clientes() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Clientes" />

      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Listado de clientes</h2>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full text-sm text-left  border ">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Contacto</th>
                <th className="px-6 py-3">Teléfono</th>
                <th className="px-6 py-3">Correo</th>
                <th className="px-6 py-3">Ciudad</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesMock.map(cliente => (
                <tr key={cliente.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4">{cliente.nombre}</td>
                  <td className="px-6 py-4">{cliente.contacto}</td>
                  <td className="px-6 py-4">{cliente.telefono}</td>
                  <td className="px-6 py-4">{cliente.correo}</td>
                  <td className="px-6 py-4">{cliente.ciudad}</td>
                  <td className="px-6 py-4">
                    {cliente.activo ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Activo</span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Inactivo</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:underline mr-2">Ver</button>
                    <button className="text-yellow-600 hover:underline mr-2">Editar</button>
                    <button className="text-red-600 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
