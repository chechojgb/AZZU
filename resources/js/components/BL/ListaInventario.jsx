// resources/js/Components/ListaInventario.jsx
import React from 'react';

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
    onEstanteriaClick 
}) => {
    return (
        <div className="w-[450px] bg-white/80 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl p-6 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">📦 Inventario</h2>
            </div>
            
            {/* Filtros y búsqueda */}
            <div className="mb-4 space-y-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar producto, color, tipo o ubicación..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={busqueda}
                        onChange={(e) => onBusquedaChange(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        onClick={onLimpiarFiltros}
                    >
                        Limpiar
                    </button>
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">Categoría:</span>
                    <select 
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <span className="text-blue-700">
                        Filtrado por: <strong>{filtro}</strong>
                    </span>
                    <button 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => onFiltroChange(null)}
                    >
                        Quitar filtro
                    </button>
                </div>
            )}
            
            {/* Contador de resultados */}
            <div className="mb-3 text-sm text-gray-600">
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
                            className={`border-b border-gray-200 py-3 px-2 hover:bg-blue-50 rounded-lg transition cursor-pointer flex justify-between items-center ${
                                !p.tiene_ubicacion ? 'bg-red-50 border-l-4 border-l-red-400' : ''
                            }`}
                            onClick={() => onEstanteriaClick(p.estanteria)}
                        >
                            <div className="max-w-[60%]">
                                <div className="font-medium text-gray-800 text-base truncate">
                                    {p.descripcion || `${p.tipo_producto} ${p.color_nombre} ${p.tamanio}`}
                                    {!p.tiene_ubicacion && (
                                        <span className="text-red-500 text-xs ml-2">⚠️ Sin ubicación</span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {p.tipo_producto} • {p.color_nombre} • {p.tamanio}
                                </div>
                            </div>
                            <div className="text-right max-w-[40%]">
                                <div className={`text-sm font-medium truncate ${
                                    !p.tiene_ubicacion ? 'text-red-700' : 'text-gray-700'
                                }`}>
                                    {p.estanteria}
                                </div>
                                <div className="text-xs text-gray-500">{p.stock_total} unidades</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No se encontraron productos con los filtros aplicados
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListaInventario;