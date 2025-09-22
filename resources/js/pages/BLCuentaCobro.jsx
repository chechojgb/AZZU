import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Cuentas de cobro',
        href: '/BLCuentaCobro',
    },
];

// Datos de prueba (en producción vendrían del backend)
const datosPrueba = [
    {
        id: 1,
        numero: "CC-001-2023",
        cliente: "Empresa ABC S.A.S.",
        fecha_emision: "2023-10-15",
        fecha_vencimiento: "2023-11-15",
        monto: 2500000,
        estado: "pendiente"
    },
    {
        id: 2,
        numero: "CC-002-2023",
        cliente: "Comercial XYZ Ltda",
        fecha_emision: "2023-10-10",
        fecha_vencimiento: "2023-10-25",
        monto: 1800000,
        estado: "pagado"
    },
    {
        id: 3,
        numero: "CC-003-2023",
        cliente: "Distribuidora Norte",
        fecha_emision: "2023-09-20",
        fecha_vencimiento: "2023-10-20",
        monto: 3200000,
        estado: "vencido"
    }
];

export default function CuentasCobro({ user, cuentas = datosPrueba }) {    
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    
    // Asegurarse de que cuentas siempre sea un array
    const cuentasSeguras = cuentas || datosPrueba;
    
    // Filtrar cuentas según estado y búsqueda
    const cuentasFiltradas = cuentasSeguras.filter(cuenta => {
        const coincideEstado = filtroEstado === 'todos' || cuenta.estado === filtroEstado;
        const coincideBusqueda = cuenta.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
                               cuenta.numero.toString().includes(busqueda);
        return coincideEstado && coincideBusqueda;
    });

    // Calcular totales
    const totalPendiente = cuentasSeguras.filter(c => c.estado === 'pendiente')
                                 .reduce((sum, c) => sum + c.monto, 0);
    const totalPagado = cuentasSeguras.filter(c => c.estado === 'pagado')
                              .reduce((sum, c) => sum + c.monto, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cuentas de Cobro" />
            
            <div className="container mx-auto px-4 py-6">
                {/* Header con estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-600">Total Pendiente</h3>
                        <p className="text-3xl font-bold text-red-500">${totalPendiente.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-600">Total Pagado</h3>
                        <p className="text-3xl font-bold text-green-500">${totalPagado.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-600">Cuentas Totales</h3>
                        <p className="text-3xl font-bold text-blue-500">{cuentasSeguras.length}</p>
                    </div>
                </div>

                {/* Controles de filtrado y búsqueda */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div>
                                <label htmlFor="filtro" className="block text-sm font-medium text-gray-700 mb-1">
                                    Filtrar por estado
                                </label>
                                <select
                                    id="filtro"
                                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={filtroEstado}
                                    onChange={(e) => setFiltroEstado(e.target.value)}
                                >
                                    <option value="todos">Todos</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="pagado">Pagado</option>
                                    <option value="vencido">Vencido</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">
                                    Buscar
                                </label>
                                <input
                                    type="text"
                                    id="busqueda"
                                    placeholder="Cliente o número de cuenta"
                                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                            Nueva Cuenta de Cobro
                        </button>
                    </div>
                </div>

                {/* Tabla de cuentas de cobro */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Número
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Emisión
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Vencimiento
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Monto
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cuentasFiltradas.length > 0 ? (
                                    cuentasFiltradas.map((cuenta) => (
                                        <tr key={cuenta.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{cuenta.numero}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {cuenta.cliente}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(cuenta.fecha_emision).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(cuenta.fecha_vencimiento).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${cuenta.monto.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                    ${cuenta.estado === 'pagado' ? 'bg-green-100 text-green-800' : 
                                                      cuenta.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                                                      'bg-red-100 text-red-800'}`}>
                                                    {cuenta.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                                    Ver
                                                </button>
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                    Editar
                                                </button>
                                                <button className="text-red-600 hover:text-red-900">
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No se encontraron cuentas de cobro
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}