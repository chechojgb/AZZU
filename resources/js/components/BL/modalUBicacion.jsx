// Componente ModalUbicacion actualizado
import { useState } from "react";

const ModalUbicacion = ({ 
    producto, 
    estanterias,
    onClose, 
    onSave  
}) => {
    const [estanteriaSeleccionada, setEstanteriaSeleccionada] = useState('');
    const [nivelSeleccionado, setNivelSeleccionado] = useState('');
    const [zonaSeleccionada, setZonaSeleccionada] = useState('');

    // Obtener niveles de la estantería seleccionada
    const nivelesDisponibles = estanteriaSeleccionada 
        ? estanterias.find(e => e.codigo === estanteriaSeleccionada)?.niveles || []
        : [];

    // Obtener zonas del nivel seleccionado
    const zonasDisponibles = nivelSeleccionado 
        ? nivelesDisponibles.find(n => n.nivel === nivelSeleccionado)?.zona_nivel || []
        : [];

    // Calcular espacio disponible en la zona
    const calcularEspacioDisponible = (zona) => {
        const productosActuales = zona.inventario_details?.reduce((total, inv) => 
            total + inv.cantidad_actual, 0) || 0;
        return zona.capacidad_maxima - productosActuales;
    };

    const handleGuardar = () => {
        if (estanteriaSeleccionada && nivelSeleccionado && zonaSeleccionada) {
            const zona = zonasDisponibles.find(z => z.id == zonaSeleccionada);
            const ubicacion = {
                estanteria_id: estanterias.find(e => e.codigo === estanteriaSeleccionada)?.id,
                nivel_id: nivelesDisponibles.find(n => n.nivel === nivelSeleccionado)?.id,
                zona_id: zonaSeleccionada,
                codigo_completo: zona?.codigo_completo,
                estanteria_nombre: estanterias.find(e => e.codigo === estanteriaSeleccionada)?.nombre,
                nivel_nombre: nivelSeleccionado,
                zona_nombre: zona?.zona
            };
            onSave(producto.id, ubicacion);
        }
    };

    // Resetear selecciones cuando cambia la estantería
    const handleEstanteriaChange = (codigo) => {
        setEstanteriaSeleccionada(codigo);
        setNivelSeleccionado('');
        setZonaSeleccionada('');
    };

    // Resetear zona cuando cambia el nivel
    const handleNivelChange = (nivel) => {
        setNivelSeleccionado(nivel);
        setZonaSeleccionada('');
    };

    return (
        <div className="w-full max-w-2xl mx-auto"> {/* Más ancho: max-w-2xl */}
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold ">
                        📍 Gestionar Ubicación
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl p-1 rounded-full hover:bg-gray-100 transition dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                        ×
                    </button>
                </div>
                <div className="mt-3">
                    <p className="text-lg font-medium text-gray-800">
                        {producto.descripcion || `${producto.tipo_producto} ${producto.color_nombre} ${producto.tamanio}`}
                    </p>
                    <p className="text-sm mt-1">
                        Stock: <span className="font-semibold">{producto.stock_total} unidades</span>
                    </p>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
                {/* Estantería */}
                <div>
                    <label className="block text-sm font-medium mb-3">
                        Estantería/Rack
                    </label>
                    <select 
                        value={estanteriaSeleccionada}
                        onChange={(e) => handleEstanteriaChange(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base "
                    >
                        <option value="" className="dark:bg-gray-800">Seleccionar estantería...</option>
                        {estanterias.map(est => (
                            <option key={est.codigo} value={est.codigo} className="dark:bg-gray-800">
                                {est.nombre} ({est.tipo}) - {est.zona}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Nivel */}
                <div>
                    <label className="block text-sm font-medium mb-3">
                        Nivel
                    </label>
                    <select 
                        value={nivelSeleccionado}
                        onChange={(e) => handleNivelChange(e.target.value)}
                        disabled={!estanteriaSeleccionada}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-800"
                    >
                        <option value="" className="dark:bg-gray-800">Seleccionar nivel...</option>
                        {nivelesDisponibles.map(nivel => (
                            <option key={nivel.id} value={nivel.nivel} className="dark:bg-gray-800">
                                {nivel.nivel}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Zona */}
                <div>
                    <label className="block text-sm font-medium mb-3">
                        Zona
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        {zonasDisponibles.map(zona => {
                            const espacioDisponible = calcularEspacioDisponible(zona);
                            const tieneEspacio = espacioDisponible >= producto.stock_total;
                            
                            return (
                                <button
                                    key={zona.id}
                                    type="button"
                                    onClick={() => setZonaSeleccionada(zona.id)}
                                    disabled={!tieneEspacio}
                                    className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                                        zonaSeleccionada == zona.id
                                            ? 'bg-blue-500 text-white border-blue-500 shadow-lg scale-105 dark:bg-gray-900 dark:border-gray-700'
                                            : tieneEspacio
                                                ? '  border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-400 hover:border-blue-300 dark:hover:border-black hover:shadow-md'
                                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    }`}
                                    title={!tieneEspacio ? `Espacio insuficiente. Disponible: ${espacioDisponible}` : ''}
                                >
                                    <div className="font-semibold text-lg">Zona {zona.zona}</div>
                                    <div className="text-sm mt-2">
                                        {tieneEspacio ? (
                                            <span className="text-green-600 font-medium">
                                                {espacioDisponible} disponibles
                                            </span>
                                        ) : (
                                            <span className="text-red-600">
                                                Capacidad llena
                                            </span>
                                        )}
                                    </div>
                                    {zona.descripcion && (
                                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                            {zona.descripcion}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Vista previa */}
                {estanteriaSeleccionada && nivelSeleccionado && zonaSeleccionada && (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:bg-none dark:bg-gray-900 border border-blue-200 dark:border-gray-600 rounded-xl p-4">
                        <p className="text-sm font-semibold text-blue-800 dark:text-white mb-2">
                            ✅ Ubicación seleccionada:
                        </p>
                        <p className="text-lg text-blue-700 font-medium dark:text-white">
                            {estanterias.find(e => e.codigo === estanteriaSeleccionada)?.nombre} - {nivelSeleccionado} - Zona {zonasDisponibles.find(z => z.id == zonaSeleccionada)?.zona}
                        </p>
                        <p className="text-sm text-blue-600 mt-1 dark:text-white">
                            Código: <span className="font-mono dark:text-blue-500/80">{zonasDisponibles.find(z => z.id == zonaSeleccionada)?.codigo_completo}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 flex gap-4">
                <button
                    onClick={onClose}
                    className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition font-medium"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleGuardar}
                    disabled={!estanteriaSeleccionada || !nivelSeleccionado || !zonaSeleccionada}
                    className="flex-1 py-3 px-6 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                    Guardar Ubicación
                </button>
            </div>
        </div>
    );
};

export default ModalUbicacion;