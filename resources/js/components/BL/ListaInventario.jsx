// resources/js/Components/ListaInventario.jsx
import React, { useState, useEffect } from 'react'; // Agregar useEffect
import AgentModalWrapper from '../agentsModalWrapper';
import ModalUbicacion from './modalUBicacion';
import { router } from '@inertiajs/react';
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";

const ListaInventario = ({ 
    productos, 
    productosFiltrados, 
    filtro, 
    busqueda, 
    categoriaFiltro,
    categorias,
    onFiltroChange,
    onBusquedaChange,
    onCategoriaChange,
    onLimpiarFiltros,
    onEstanteriaClick,
    estanterias
}) => {
    console.log(productosFiltrados);
    
    const [expandida, setExpandida] = useState(true);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalUbicacionOpen, setModalUbicacionOpen] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        success: false,
        message: "",
    });
    console.log(productosFiltrados);
    

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, success: false, message: '' });
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [toast]);
    
    const toggleExpandida = () => {
        setExpandida(!expandida);
    };

    const openModalUbicacion = (producto) => {
        setProductoSeleccionado(producto);
        setModalUbicacionOpen(true);
    };

    const closeModalUbicacion = () => {
        setModalUbicacionOpen(false);
        setProductoSeleccionado(null);
    };

    const handleGuardarUbicacion = async (productoId, ubicacion) => {
        try {
            console.log('Guardando ubicación:', { productoId, ubicacion });
            
            // Preparar datos para enviar
            const datos = {
                producto_id: productoId,
                zona_id: ubicacion.zona_id,
                cantidad_actual: productoSeleccionado.stock_total,
                fecha_ubicacion: new Date().toISOString().split('T')[0],
                estado: 'disponible',
                // Incluir información adicional si es necesario
                estanteria_nombre: ubicacion.estanteria_nombre,
                nivel_nombre: ubicacion.nivel_nombre,
                zona_nombre: ubicacion.zona_nombre
            };

            router.post(route('inventarioBL.store'), datos, { // Enviar datos como objeto
                preserveState: true,
                onSuccess: () => {
                    setToast({
                        show: true,
                        success: true,
                        message: "Producto organizado correctamente"
                    });
                    closeModalUbicacion();
                },
                onError: (errors) => {
                    const primerError = Object.values(errors)[0];
                    setToast({
                        show: true,
                        success: false,
                        message: primerError || "Error al organizar el producto"
                    });
                },
                onFinish: (visit) => {
                    // Si hubo error de servidor (status 500 o más)
                    if (visit?.response?.status >= 500) {
                        const msg = visit?.response?.data?.message || "Error interno del servidor";
                        setToast({
                            show: true,
                            success: false,
                            message: msg
                        });
                    }
                }
            });
            
        } catch (error) {
            console.error('Error al guardar ubicación:', error);
            setToast({
                show: true,
                success: false,
                message: "Error al guardar la ubicación"
            });
        }
    };

    // Si está contraída, mostrar solo un ícono pequeño
    if (!expandida) {
        return (
            <div className="w-16 bg-white/80 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl p-4 flex flex-col items-center justify-center">
                <button
                    onClick={toggleExpandida}
                    className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-110"
                    title="Expandir lista de inventario"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <span className="text-xs text-gray-600 mt-2 text-center">Mostrar Lista</span>
            </div>
        );
    }

    // Si está expandida, mostrar la lista completa
    return (
        <>
            <div className="w-full sm:w-[350px] md:w-[400px] lg:w-[450px] bg-white/80 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl p-6 overflow-hidden flex flex-col transition-all duration-300">
                {/* Header con botón de cerrar */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">📦 Inventario</h2>
                    <button
                        onClick={toggleExpandida}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
                        title="Contraer lista"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
                
                {/* Filtros y búsqueda */}
                <div className="mb-4 space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Buscar producto, color, tipo o ubicación..."
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={busqueda}
                            onChange={(e) => onBusquedaChange(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition text-sm whitespace-nowrap"
                            onClick={onLimpiarFiltros}
                        >
                            Limpiar
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium text-sm">Categoría:</span>
                        <select 
                            className="border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
                            value={categoriaFiltro}
                            onChange={(e) => onCategoriaChange(e.target.value)}
                        >
                            {categorias.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* Información de filtros activos */}
                {filtro && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
                        <span className="text-blue-700 text-sm">
                            Filtrado por: <strong>{filtro}</strong>
                        </span>
                        <button 
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            onClick={() => onFiltroChange(null)}
                        >
                            Quitar filtro
                        </button>
                    </div>
                )}
                
                {/* Contador de resultados */}
                <div className="mb-3 text-xs text-gray-600">
                    Mostrando {productosFiltrados.length} de {productos.length} productos
                    {productosFiltrados.some(p => !p.tiene_ubicacion) && (
                        <span className="text-red-500 ml-2">⚠️ Algunos sin ubicación</span>
                    )}
                </div>
                
                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto pr-2">
                    {productosFiltrados.length > 0 ? (
                        productosFiltrados.map((p) => (
                            <div
                                key={p.id}
                                className={`border-b border-gray-200 py-3 px-3 hover:bg-blue-50 rounded-lg transition cursor-pointer ${
                                    !p.tiene_ubicacion ? 'bg-red-50 border-l-4 border-l-red-400' : ''
                                }`}
                                onClick={() => openModalUbicacion(p)}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    {/* Información del producto */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-800 text-sm mb-1 truncate">
                                            {p.descripcion || `${p.tipo_producto} ${p.color_nombre} ${p.tamanio}`}
                                            {!p.tiene_ubicacion && (
                                                <span className="text-red-500 text-xs ml-1">📍</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {p.tipo_producto} • {p.color_nombre} • {p.tamanio}
                                        </div>
                                    </div>

                                    {/* Stock */}
                                    <div className="text-right whitespace-nowrap ml-2">
                                        <div className="text-sm font-semibold text-gray-700">
                                            {p.stock_total} unidades
                                        </div>
                                    </div>
                                </div>

                                {/* Ubicaciones como badges con scroll */}
                                <div className="mt-2 overflow-x-auto whitespace-nowrap scrollbar-thin">
                                    <div className="flex gap-1 pb-1">
                                        {p.estanteria.split(', ').map((ubicacion, index) => (
                                            <span 
                                                key={index}
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${
                                                    !p.tiene_ubicacion 
                                                        ? 'bg-red-100 text-red-800 border-red-200' 
                                                        : 'bg-blue-100 text-blue-800 border-blue-200'
                                                }`}
                                            >
                                                {ubicacion}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No se encontraron productos con los filtros aplicados
                        </div>
                    )}
                </div>
                
                {/* Botón flotante para contraer (alternativo) */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={toggleExpandida}
                        className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Ocultar lista
                    </button>
                </div>
            </div>

            {/* Modal de ubicación usando AgentModalWrapper */}
            {modalUbicacionOpen && productoSeleccionado && (
                <AgentModalWrapper closeModal={closeModalUbicacion}>
                    <ModalUbicacion
                        producto={productoSeleccionado}
                        estanterias={estanterias}
                        onClose={closeModalUbicacion}
                        onSave={handleGuardarUbicacion}
                    />
                </AgentModalWrapper>
            )}
            
            {/* Toast notifications */}
            {toast.show && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Toast>
                        <div
                            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                toast.success ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
                            }`}
                        >
                            {toast.success ? <HiCheck className="h-5 w-5" /> : <HiX className="h-5 w-5" />}
                        </div>
                        <div className="ml-3 text-sm font-normal">{toast.message}</div>
                    </Toast>
                </div>
            )}
        </>
    );
};

export default ListaInventario;