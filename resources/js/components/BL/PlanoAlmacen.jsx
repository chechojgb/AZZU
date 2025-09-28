// resources/js/components/BL/PlanoAlmacen.jsx
import React from 'react';

const PlanoAlmacen = ({ onEstanteriaClick, productos }) => {
    // Función mejorada para contar productos por estantería
    const productosPorEstanteria = (codigoEstanteria) => {
        return productos.filter(p => {
            // PRIMERO: Buscar en el nuevo array estanterias_codigos
            if (p.estanterias_codigos && p.estanterias_codigos.length > 0) {
                return p.estanterias_codigos.includes(codigoEstanteria);
            }
            // SEGUNDO: Buscar en ubicaciones_detalladas
            if (p.ubicaciones_detalladas && p.ubicaciones_detalladas.length > 0) {
                return p.ubicaciones_detalladas.some(ubicacion => 
                    ubicacion.estanteria_codigo === codigoEstanteria
                );
            }
            // TERCERO: Fallback - buscar en la cadena de texto
            return p.estanteria.includes(codigoEstanteria);
        }).length;
    };

    // Función para obtener el nombre legible de la estantería
    const getNombreEstanteria = (codigo) => {
        const nombres = {
            'EST-01': 'Estantería 1',
            'EST-02': 'Estantería 2', 
            'EST-03': 'Estantería 3',
            'EST-04': 'Estantería 4',
            'EST-05': 'Estantería 5',
            'EST-06': 'Estantería 6',
            'EST-07': 'Estantería 7',
            'RACK-01': 'Rack 1',
            'RACK-02': 'Rack 2',
            'RACK-03': 'Rack 3',
            'RACK-04': 'Rack 4',
            'RACK-05': 'Rack 5',
            'RACK-06': 'Rack 6',
            'RACK-07': 'Rack 7',
            'RACK-08': 'Rack 8',
            'RACK-09': 'Rack 9',
            'RACK-10': 'Rack 10'
        };
        return nombres[codigo] || codigo;
    };

    return (
        <div className="flex-1 bg-white/80 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl p-6 overflow-hidden relative">
            {/* Título del plano */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📋 Plano del Almacén</h2>
            
            {/* Contenedor principal del plano */}
            <div className="relative w-full h-[calc(100%-80px)] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                
                {/* LÍNEA DIVISORIA VERTICAL EN EL CENTRO */}
                <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-gray-300"></div>
                
                {/* PARTE SUPERIOR (20% de altura) - NO TOCAR */}
                <div className="absolute top-0 left-0 w-full h-1/5 flex p-4 gap-4">
                    {/* MITAD IZQUIERDA SUPERIOR: E1 + C JUNTOS */}
                    <div className="w-1/2 h-full flex gap-4">
                        {/* E1 */}
                        <div className="w-1/2 h-full">
                            <div 
                                className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                onClick={() => onEstanteriaClick("EST-01")}
                            >
                                <span className="font-bold text-orange-800 text-xl">EST-01</span>
                                <span className="font-bold text-orange-700 text-sm">{getNombreEstanteria("EST-01")}</span>
                                <span className="text-xs text-orange-600 mt-1">
                                    {productosPorEstanteria("EST-01")} productos
                                </span>
                            </div>
                        </div>

                        {/* C */}
                        <div className="w-1/2 h-full">
                            <div 
                                className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                onClick={() => onEstanteriaClick("Zona de Computadores")}
                            >
                                <span className="font-bold text-blue-800 text-xl">C</span>
                                <span className="font-bold text-blue-700 text-sm">💻 Computadores</span>
                                <span className="text-xs text-blue-600 mt-1">Área de trabajo</span>
                            </div>
                        </div>
                    </div>

                    {/* MITAD DERECHA SUPERIOR: VACÍA */}
                    <div className="w-1/2 h-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-400 rounded-xl flex flex-col justify-center items-center">
                        <div className="text-center text-gray-500">
                            <div className="text-2xl mb-1">📭</div>
                            <p className="text-xs">ZONA DE EMPAQUETACIÓN</p>
                        </div>
                    </div>
                </div>

                {/* PARTE INFERIOR (80% de altura) - NO TOCAR */}
                <div className="absolute top-1/5 left-0 w-full h-4/5 flex p-4 gap-4">
                    {/* MITAD IZQUIERDA INFERIOR */}
                    <div className="w-1/2 h-full flex gap-4">
                        {/* RACK 09 (R09) - OCUPA TODA LA ALTURA */}
                        <div className="w-1/6 h-full">
                            <div 
                                className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                onClick={() => onEstanteriaClick("RACK-09")}
                            >
                                <span className="font-bold text-red-800 text-xl">R09</span>
                                <span className="font-bold text-red-700 text-sm">{getNombreEstanteria("RACK-09")}</span>
                                <span className="text-xs text-red-600 mt-1">
                                    {productosPorEstanteria("RACK-09")} productos
                                </span>
                            </div>
                        </div>

                        {/* ZONA DERECHA DE R09 */}
                        <div className="flex-1 h-full flex flex-col gap-4">

                            {/* ESPACIO VACÍO (7%) */}
                            <div className="h-[7%] flex justify-center items-center">
                                <p className="text-xs text-gray-500">Pasillo</p>
                            </div>

                            {/* E2 (12%) */}
                            <div className="h-[12%]">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("EST-02")}
                                >
                                    <span className="font-bold text-orange-800 text-xl">EST-02</span>
                                    <span className="font-bold text-orange-700 text-sm">{getNombreEstanteria("EST-02")}</span>
                                    <span className="text-xs text-orange-600 mt-1">
                                        {productosPorEstanteria("EST-02")} productos
                                    </span>
                                </div>
                            </div>

                            {/* E3 (12%) */}
                            <div className="h-[12%]">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("EST-03")}
                                >
                                    <span className="font-bold text-orange-800 text-xl">EST-03</span>
                                    <span className="font-bold text-orange-700 text-sm">{getNombreEstanteria("EST-03")}</span>
                                    <span className="text-xs text-orange-600 mt-1">
                                        {productosPorEstanteria("EST-03")} productos
                                    </span>
                                </div>
                            </div>

                            {/* ESPACIO VACÍO (7%) */}
                            <div className="h-[7%] flex justify-center items-center">
                                <p className="text-xs text-gray-500">Pasillo</p>
                            </div>

                            {/* E4 (12%) */}
                            <div className="h-[12%]">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("EST-04")}
                                >
                                    <span className="font-bold text-orange-800 text-xl">EST-04</span>
                                    <span className="font-bold text-orange-700 text-sm">{getNombreEstanteria("EST-04")}</span>
                                    <span className="text-xs text-orange-600 mt-1">
                                        {productosPorEstanteria("EST-04")} productos
                                    </span>
                                </div>
                            </div>

                            {/* E5 (12%) */}
                            <div className="h-[12%]">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("EST-05")}
                                >
                                    <span className="font-bold text-orange-800 text-xl">EST-05</span>
                                    <span className="font-bold text-orange-700 text-sm">{getNombreEstanteria("EST-05")}</span>
                                    <span className="text-xs text-orange-600 mt-1">
                                        {productosPorEstanteria("EST-05")} productos
                                    </span>
                                </div>
                            </div>

                            {/* ESPACIO VACÍO (7%) */}
                            <div className="h-[7%] flex justify-center items-center">
                                <p className="text-xs text-gray-500">Pasillo</p>
                            </div>

                            {/* E6 (resto de altura) */}
                            <div className="flex-1">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("EST-06")}
                                >
                                    <span className="font-bold text-orange-800 text-xl">EST-06</span>
                                    <span className="font-bold text-orange-700 text-sm">{getNombreEstanteria("EST-06")}</span>
                                    <span className="text-xs text-orange-600 mt-1">
                                        {productosPorEstanteria("EST-06")} productos
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MITAD DERECHA INFERIOR */}
                    <div className="w-1/2 h-full rounded-xl flex flex-col">
                        
                        {/* Zona superior de racks */}
                        <div className="flex flex-row h-[90%]">
                            
                            {/* Rack 8 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("RACK-08")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R08</span>
                                    <span className="font-bold text-red-700 text-sm">{getNombreEstanteria("RACK-08")}</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("RACK-08")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Espacio 5% */}
                            <div className="w-[5%] h-full"></div>

                            {/* Rack 7 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("RACK-07")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R07</span>
                                    <span className="font-bold text-red-700 text-sm">{getNombreEstanteria("RACK-07")}</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("RACK-07")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Rack 6 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("RACK-06")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R06</span>
                                    <span className="font-bold text-red-700 text-sm">{getNombreEstanteria("RACK-06")}</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("RACK-06")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Espacio 5% */}
                            <div className="w-[5%] h-full"></div>

                            {/* Rack 5 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("RACK-05")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R05</span>
                                    <span className="font-bold text-red-700 text-sm">{getNombreEstanteria("RACK-05")}</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("RACK-05")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Rack 4 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("RACK-04")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R04</span>
                                    <span className="font-bold text-red-700 text-sm">{getNombreEstanteria("RACK-04")}</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("RACK-04")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Espacio 5% */}
                            <div className="w-[5%] h-full"></div>

                            {/* Rack 3 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("RACK-03")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R03</span>
                                    <span className="font-bold text-red-700 text-sm">{getNombreEstanteria("RACK-03")}</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("RACK-03")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Rack 2 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("RACK-02")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R02</span>
                                    <span className="font-bold text-red-700 text-sm">{getNombreEstanteria("RACK-02")}</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("RACK-02")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Espacio 5% */}
                            <div className="w-[5%] h-full"></div>

                            {/* Rack 1 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("RACK-01")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R01</span>
                                    <span className="font-bold text-red-700 text-sm">{getNombreEstanteria("RACK-01")}</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("RACK-01")} productos
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Estantería 7 abajo */}
                        <div className="h-[10%]">
                            <div 
                                className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                onClick={() => onEstanteriaClick("EST-07")}
                            >
                                <span className="font-bold text-orange-800 text-xl">EST-07</span>
                                <span className="font-bold text-orange-700 text-sm">{getNombreEstanteria("EST-07")}</span>
                                <span className="text-xs text-orange-600 mt-1">
                                    {productosPorEstanteria("EST-07")} productos
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ÁREA SIN UBICACIÓN (ESQUINA INFERIOR DERECHA) */}
                {productos.some(p => !p.tiene_ubicacion) && (
                    <div 
                        className="absolute bottom-4 right-4 w-48 bg-gradient-to-r from-gray-300 to-gray-400 border-2 border-dashed border-gray-500 rounded-lg p-3 cursor-pointer hover:scale-105 transition-all duration-200"
                        onClick={() => onEstanteriaClick("Sin ubicación")}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800">📦 Sin ubicación</span>
                            <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">
                                {productos.filter(p => !p.tiene_ubicacion).length} productos
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanoAlmacen;