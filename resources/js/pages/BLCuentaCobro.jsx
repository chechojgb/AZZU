import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Cuentas de cobro',
        href: '/BLCuentaCobro',
    },
];

const datosPrueba = [
    {
        id: 1,
        numero: "CC-001-2023",
        cliente: "Empresa ABC S.A.S.",
        fecha_emision: "2023-10-15",
        fecha_vencimiento: "2023-11-15",
        monto: 2500000,
        estado: "pendiente",
        descripcion: "Servicios de consultoría Q3 2023",
        telefono: "+57 300 123 4567",
        email: "contacto@empresaabc.com",
        dias_vencimiento: 5,
        items: [
            { descripcion: "Consultoría estratégica", cantidad: 40, precio: 50000 },
            { descripcion: "Análisis de mercado", cantidad: 1, precio: 500000 }
        ]
    },
    {
        id: 2,
        numero: "CC-002-2023",
        cliente: "Comercial XYZ Ltda",
        fecha_emision: "2023-10-10",
        fecha_vencimiento: "2023-10-25",
        monto: 1800000,
        estado: "pagado",
        descripcion: "Desarrollo software personalizado",
        telefono: "+57 310 987 6543",
        email: "compras@comercialxyz.com",
        fecha_pago: "2023-10-20",
        items: [
            { descripcion: "Desarrollo módulo principal", cantidad: 1, precio: 1200000 },
            { descripcion: "Capacitación equipo", cantidad: 2, precio: 300000 }
        ]
    },
    {
        id: 3,
        numero: "CC-003-2023",
        cliente: "Distribuidora Norte S.A.",
        fecha_emision: "2023-09-20",
        fecha_vencimiento: "2023-10-20",
        monto: 3200000,
        estado: "vencido",
        descripcion: "Suministro de materiales",
        telefono: "+57 315 555 8888",
        email: "finanzas@distribuidoranorte.com",
        dias_vencimiento: -12,
        items: [
            { descripcion: "Materiales de construcción", cantidad: 100, precio: 25000 },
            { descripcion: "Transporte y logística", cantidad: 1, precio: 700000 }
        ]
    },
    {
        id: 4,
        numero: "CC-004-2023",
        cliente: "Alimentos Saludables Ltda",
        fecha_emision: "2023-10-18",
        fecha_vencimiento: "2023-11-18",
        monto: 1500000,
        estado: "pendiente",
        descripcion: "Servicios de marketing digital",
        telefono: "+57 320 444 3333",
        email: "mercadeo@alimentossaludables.com",
        dias_vencimiento: 28,
        items: [
            { descripcion: "Campaña redes sociales", cantidad: 1, precio: 800000 },
            { descripcion: "Content marketing", cantidad: 1, precio: 700000 }
        ]
    }
];

export default function CuentasCobroCards({ user, cuentas = datosPrueba, cuentasCobro }) {    
    console.log(cuentasCobro);
    
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    const [orden, setOrden] = useState('fecha_reciente');
    const [vista, setVista] = useState('grid'); // 'grid' o 'list'
    
    const cuentasSeguras = cuentas || datosPrueba;
    
    // Función para calcular días restantes
    const calcularDiasRestantes = (fechaVencimiento) => {
        const hoy = new Date();
        const vencimiento = new Date(fechaVencimiento);
        const diffTime = vencimiento - hoy;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Enriquecer datos con días restantes
    const cuentasEnriquecidas = cuentasSeguras.map(cuenta => ({
        ...cuenta,
        dias_restantes: calcularDiasRestantes(cuenta.fecha_vencimiento)
    }));

    // Filtrar y ordenar
    const cuentasFiltradas = cuentasEnriquecidas
        .filter(cuenta => {
            const coincideEstado = filtroEstado === 'todos' || cuenta.estado === filtroEstado;
            const coincideBusqueda = cuenta.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
                                   cuenta.numero.toString().includes(busqueda) ||
                                   cuenta.descripcion.toLowerCase().includes(busqueda.toLowerCase());
            return coincideEstado && coincideBusqueda;
        })
        .sort((a, b) => {
            switch(orden) {
                case 'monto_alto':
                    return b.monto - a.monto;
                case 'monto_bajo':
                    return a.monto - b.monto;
                case 'fecha_reciente':
                    return new Date(b.fecha_emision) - new Date(a.fecha_emision);
                case 'fecha_antigua':
                    return new Date(a.fecha_emision) - new Date(b.fecha_emision);
                case 'vencimiento_cercano':
                    return a.dias_restantes - b.dias_restantes;
                default:
                    return 0;
            }
        });
    

    // Estadísticas
    const estadisticas = {
        total: cuentasEnriquecidas.reduce((sum, c) => sum + c.monto, 0),
        pendiente: cuentasEnriquecidas.filter(c => c.estado === 'pendiente').reduce((sum, c) => sum + c.monto, 0),
        pagado: cuentasEnriquecidas.filter(c => c.estado === 'pagado').reduce((sum, c) => sum + c.monto, 0),
        vencido: cuentasEnriquecidas.filter(c => c.estado === 'vencido').reduce((sum, c) => sum + c.monto, 0),
        totalCuentas: cuentasEnriquecidas.length
    };

    const getEstadoColor = (estado) => {
        switch(estado) {
            case 'pagado': return 'border-l-green-500 bg-green-50';
            case 'pendiente': return 'border-l-yellow-500 bg-yellow-50';
            case 'vencido': return 'border-l-red-500 bg-red-50';
            default: return 'border-l-gray-500 bg-gray-50';
        }
    };

    const getEstadoBadge = (estado) => {
        switch(estado) {
            case 'pagado': return 'bg-green-100 text-green-800';
            case 'pendiente': return 'bg-yellow-100 text-yellow-800';
            case 'vencido': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getIconoEstado = (estado) => {
        switch(estado) {
            case 'pagado': return '✅';
            case 'pendiente': return '⏳';
            case 'vencido': return '⚠️';
            default: return '📄';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cuentas de Cobro" />
            
            <div className="container mx-auto px-4 py-6">
                {/* Header Mejorado */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Cuentas de Cobro</h1>
                        <p className="text-gray-600 mt-2">Gestiona y monitorea tus facturas pendientes y pagadas</p>
                    </div>
                    {/* <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg flex items-center shadow-lg transition-all duration-200">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nueva Cuenta de Cobro
                    </button> */}
                </div>

                {/* Panel de Estadísticas Mejorado */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Total General</p>
                                <p className="text-2xl font-bold text-gray-900">${estadisticas.total.toLocaleString()}</p>
                            </div>
                            <div className="text-2xl">💰</div>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">{estadisticas.totalCuentas} cuentas</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm p-6 border border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-600 text-sm font-medium">Pendiente</p>
                                <p className="text-2xl font-bold text-gray-900">${estadisticas.pendiente.toLocaleString()}</p>
                            </div>
                            <div className="text-2xl">⏳</div>
                        </div>
                        <p className="text-xs text-yellow-600 mt-2">
                            {cuentasEnriquecidas.filter(c => c.estado === 'pendiente').length} por cobrar
                        </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium">Pagado</p>
                                <p className="text-2xl font-bold text-gray-900">${estadisticas.pagado.toLocaleString()}</p>
                            </div>
                            <div className="text-2xl">✅</div>
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                            {cuentasEnriquecidas.filter(c => c.estado === 'pagado').length} cobradas
                        </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm p-6 border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-600 text-sm font-medium">Vencido</p>
                                <p className="text-2xl font-bold text-gray-900">${estadisticas.vencido.toLocaleString()}</p>
                            </div>
                            <div className="text-2xl">⚠️</div>
                        </div>
                        <p className="text-xs text-red-600 mt-2">
                            {cuentasEnriquecidas.filter(c => c.estado === 'vencido').length} vencidas
                        </p>
                    </div>
                </div>

                {/* Panel de Control Mejorado */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            {/* Búsqueda Mejorada */}
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar por cliente, número o descripción..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                    />
                                    <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Filtros Mejorados */}
                            <div className="flex gap-3">
                                <select
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={filtroEstado}
                                    onChange={(e) => setFiltroEstado(e.target.value)}
                                >
                                    <option value="todos">Todos los estados</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="pagado">Pagado</option>
                                    <option value="vencido">Vencido</option>
                                </select>
                                
                                <select
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={orden}
                                    onChange={(e) => setOrden(e.target.value)}
                                >
                                    <option value="fecha_reciente">Más recientes</option>
                                    <option value="fecha_antigua">Más antiguas</option>
                                    <option value="monto_alto">Monto mayor</option>
                                    <option value="monto_bajo">Monto menor</option>
                                    <option value="vencimiento_cercano">Vencimiento cercano</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Botones de Vista */}
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setVista('grid')}
                                className={`p-3 rounded-lg border ${
                                    vista === 'grid' 
                                        ? 'bg-indigo-100 border-indigo-500 text-indigo-600' 
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => setVista('list')}
                                className={`p-3 rounded-lg border ${
                                    vista === 'list' 
                                        ? 'bg-indigo-100 border-indigo-500 text-indigo-600' 
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {/* Resumen de Filtros */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-sm text-gray-600">
                            Mostrando {cuentasFiltradas.length} de {cuentasEnriquecidas.length} cuentas
                        </span>
                        {filtroEstado !== 'todos' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                Estado: {filtroEstado}
                            </span>
                        )}
                        {busqueda && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                Búsqueda: "{busqueda}"
                            </span>
                        )}
                    </div>
                </div>

                {/* Grid de Tarjetas Mejorado */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {cuentasFiltradas.map((cuenta) => (
                        <div key={cuenta.id} className={`rounded-xl shadow-lg border-l-4 transition-all duration-300 hover:shadow-xl hover:scale-105 ${getEstadoColor(cuenta.estado)}`}>
                            <div className="p-6">
                                {/* Header de la Tarjeta */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">{getIconoEstado(cuenta.estado)}</div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">#{cuenta.numero}</h3>
                                            <p className="text-sm text-gray-600">{cuenta.cliente}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(cuenta.estado)}`}>
                                        {cuenta.estado}
                                    </span>
                                </div>
                                
                                {/* Descripción */}
                                <p className="text-gray-700 mb-4 text-sm line-clamp-2">{cuenta.descripcion}</p>
                                
                                {/* Información Principal */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Emisión:</span>
                                        <span className="text-sm font-medium">{new Date(cuenta.fecha_emision).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Vencimiento:</span>
                                        <span className={`text-sm font-medium ${
                                            cuenta.dias_restantes < 0 ? 'text-red-600' : 
                                            cuenta.dias_restantes < 7 ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                            {new Date(cuenta.fecha_vencimiento).toLocaleDateString()}
                                            <span className={`ml-2 text-xs ${
                                                cuenta.dias_restantes < 0 ? 'bg-red-100 text-red-800' : 
                                                cuenta.dias_restantes < 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                            } px-2 py-1 rounded-full`}>
                                                {cuenta.dias_restantes < 0 ? `Vencido hace ${Math.abs(cuenta.dias_restantes)} días` : 
                                                 cuenta.dias_restantes === 0 ? 'Vence hoy' : 
                                                 `${cuenta.dias_restantes} días restantes`}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Monto:</span>
                                        <span className="text-xl font-bold text-gray-900">
                                            ${cuenta.monto.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Items (Preview) */}
                                {cuenta.items && cuenta.items.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-2">Items incluidos:</p>
                                        <div className="space-y-1">
                                            {cuenta.items.slice(0, 2).map((item, index) => (
                                                <div key={index} className="flex justify-between text-xs">
                                                    <span className="text-gray-600 truncate">{item.descripcion}</span>
                                                    <span className="text-gray-900 font-medium">${(item.cantidad * item.precio).toLocaleString()}</span>
                                                </div>
                                            ))}
                                            {cuenta.items.length > 2 && (
                                                <div className="text-xs text-gray-500 text-center">
                                                    +{cuenta.items.length - 2} items más
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Contacto */}
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                    <span>{cuenta.email}</span>
                                    <span>{cuenta.telefono}</span>
                                </div>

                                {/* Acciones */}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <div className="flex space-x-2">
                                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                                            Descargar cuenta de cobro
                                        </button>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors" title="Editar">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Eliminar">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {cuentasCobro.map((cuenta) => (
                        console.log(cuenta),
                        
                        <div key={cuenta.id} className={`rounded-xl shadow-lg border-l-4 transition-all duration-300 hover:shadow-xl hover:scale-105 ${getEstadoColor(cuenta.estado)}`}>
                            <div className="p-6">
                                {/* Header de la Tarjeta */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">{getIconoEstado(cuenta.pagado)}</div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Cuenta #{cuenta.id}</h3>
                                            <p className="text-sm text-gray-600">{cuenta.usuario.name}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(cuenta.estado)}`}>
                                        {cuenta.estado}
                                    </span>
                                </div>
                                
                                {/* Descripción */}
                                <p className="text-gray-700 mb-4 text-sm line-clamp-2">{cuenta.descripcion}</p>
                                
                                {/* Información Principal */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Emisión:</span>
                                        <span className="text-sm font-medium">{new Date(cuenta.fecha).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Vencimiento:</span>
                                        <span className={`text-sm font-medium ${
                                            cuenta.dias_restantes < 0 ? 'text-red-600' : 
                                            cuenta.dias_restantes < 7 ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                            {new Date(cuenta.fecha_vencimiento).toLocaleDateString()}
                                            <span className={`ml-2 text-xs ${
                                                cuenta.dias_restantes < 0 ? 'bg-red-100 text-red-800' : 
                                                cuenta.dias_restantes < 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                            } px-2 py-1 rounded-full`}>
                                                {cuenta.dias_restantes < 0 ? `Vencido hace ${Math.abs(cuenta.dias_restantes)} días` : 
                                                 cuenta.dias_restantes === 0 ? 'Vence hoy' : 
                                                 `${cuenta.dias_restantes} días restantes`}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Monto:</span>
                                        <span className="text-xl font-bold text-gray-900">
                                            ${cuenta.total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Items (Preview) */}
                                {cuenta.items_marcacion && cuenta.items_marcacion.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-2">Items incluidos:</p>
                                        <div className="space-y-1">
                                            {cuenta.items_marcacion.slice(0, 30).map((item, index) => {
                                                const descripcion = item?.marcacion?.pedido?.items[0]?.empaque?.producto?.descripcion ?? "Sin descripción";
                                                const cantidad = item.marcacion.cantidad ?? 'sin cantidad'
                                                const total = item.marcacion.costo_total ?? 'Sin costo total'
                                                

                                                return (
                                                    <div key={index} className="flex justify-between text-xs">
                                                        <span className="text-gray-600 truncate">{descripcion} - Cantidad: {cantidad}</span>
                                                        <span className="text-gray-900 font-medium">
                                                            ${(total).toLocaleString()}
                                                        </span>
                                                    </div>
                                                );
                                            })}

                                            {cuenta.items_marcacion.length > 7 && (
                                                <div className="text-xs text-gray-500 text-center">
                                                    +{cuenta.items.length - 2} items más
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Contacto */}
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                    <span>{cuenta.email}</span>
                                    <span>{cuenta.telefono}</span>
                                </div>

                                {/* Acciones */}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <div className="flex space-x-2">
                                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                                            Descargar cuenta de cobro
                                        </button>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors" title="Editar">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Eliminar">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Estado Vacío Mejorado */}
                {cuentasFiltradas.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron cuentas</h3>
                        <p className="text-gray-600 mb-6">Intenta ajustar los filtros o crear una nueva cuenta</p>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg">
                            Crear Primera Cuenta
                        </button>
                    </div>
                )}

                {/* Footer con Resumen */}
                {cuentasFiltradas.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Mostrando <span className="font-semibold">{cuentasFiltradas.length}</span> de <span className="font-semibold">{cuentasEnriquecidas.length}</span> cuentas
                            </div>
                            <div className="text-lg font-bold text-gray-900 mt-2 sm:mt-0">
                                Total filtrado: ${cuentasFiltradas.reduce((sum, c) => sum + c.monto, 0).toLocaleString()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}