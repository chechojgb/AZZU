// resources/js/components/BL/PlanoAlmacen.jsx
import React from 'react';

const PlanoAlmacen = ({ onEstanteriaClick, productos }) => {
    // Calcular productos por estantería
    const productosPorEstanteria = (nombreEstanteria) => {
        return productos.filter(p => p.estanteria === nombreEstanteria).length;
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
                                onClick={() => onEstanteriaClick("Estantería 1")}
                            >
                                <span className="font-bold text-orange-800 text-xl">E1</span>
                                <span className="font-bold text-orange-700 text-sm">Estantería 1</span>
                                <span className="text-xs text-orange-600 mt-1">
                                    {productosPorEstanteria("Estantería 1")} productos
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
                        {/* RACK 10 (R10) - OCUPA TODA LA ALTURA */}
                        <div className="w-1/6 h-full">
                            <div 
                                className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                onClick={() => onEstanteriaClick("Rack 10")}
                            >
                                <span className="font-bold text-red-800 text-xl">R10</span>
                                <span className="font-bold text-red-700 text-sm">Rack 10</span>
                                <span className="text-xs text-red-600 mt-1">
                                    {productosPorEstanteria("Rack 10")} productos
                                </span>
                            </div>
                        </div>

                        {/* ZONA DERECHA DE R10 */}
                        <div className="flex-1 h-full flex flex-col gap-4">

                            {/* ESPACIO VACÍO (7%) */}
                            <div className="h-[7%] flex justify-center items-center">
                                <p className="text-xs text-gray-500">Pasillo</p>
                            </div>

                            {/* E2 (12%) */}
                            <div className="h-[12%]">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("Estantería 2")}
                                >
                                    <span className="font-bold text-orange-800 text-xl">E2</span>
                                    <span className="font-bold text-orange-700 text-sm">Estantería 2</span>
                                    <span className="text-xs text-orange-600 mt-1">
                                        {productosPorEstanteria("Estantería 2")} productos
                                    </span>
                                </div>
                            </div>

                            {/* E3 (12%) */}
                            <div className="h-[12%]">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("Estantería 3")}
                                >
                                    <span className="font-bold text-orange-800 text-xl">E3</span>
                                    <span className="font-bold text-orange-700 text-sm">Estantería 3</span>
                                    <span className="text-xs text-orange-600 mt-1">
                                        {productosPorEstanteria("Estantería 3")} productos
                                    </span>
                                </div>
                            </div>

                            {/* ESPACIO VACÍO (7%) */}
                            <div className="h-[7%] flex justify-center items-center">
                                <p className="text-xs text-gray-500">Pasillo</p>
                            </div>

                            {/* E5 (12%) */}
                            <div className="h-[12%]">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("Estantería 5")}
                                >
                                    <span className="font-bold text-orange-800 text-xl">E5</span>
                                    <span className="font-bold text-orange-700 text-sm">Estantería 5</span>
                                    <span className="text-xs text-orange-600 mt-1">
                                        {productosPorEstanteria("Estantería 5")} productos
                                    </span>
                                </div>
                            </div>

                            {/* E4 (12%) */}
                            <div className="h-[12%]">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("Estantería 4")}
                                >
                                    <span className="font-bold text-orange-800 text-xl">E4</span>
                                    <span className="font-bold text-orange-700 text-sm">Estantería 4</span>
                                    <span className="text-xs text-orange-600 mt-1">
                                        {productosPorEstanteria("Estantería 4")} productos
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
                                    onClick={() => onEstanteriaClick("Estantería 6")}
                                >
                                    <span className="font-bold text-orange-800 text-xl">E6</span>
                                    <span className="font-bold text-orange-700 text-sm">Estantería 6</span>
                                    <span className="text-xs text-orange-600 mt-1">
                                        {productosPorEstanteria("Estantería 6")} productos
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MITAD DERECHA INFERIOR: VACÍA */}
                    {/* MITAD DERECHA INFERIOR */}
                    <div className="w-1/2 h-full   rounded-xl flex flex-col">
                        
                        {/* Zona superior de racks */}
                        <div className="flex flex-row h-[90%]">
                            
                            {/* Rack 9 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("Rack 9")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R9</span>
                                    <span className="font-bold text-red-700 text-sm">Rack 9</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("Rack 9")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Espacio 5% */}
                            <div className="w-[5%] h-full"></div>

                            {/* Rack 8 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("Rack 8")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R8</span>
                                    <span className="font-bold text-red-700 text-sm">Rack 8</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("Rack 8")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Rack 7 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("Rack 7")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R7</span>
                                    <span className="font-bold text-red-700 text-sm">Rack 7</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("Rack 7")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Espacio 5% */}
                            <div className="w-[5%] h-full"></div>

                            {/* Rack 6 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("Rack 6")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R6</span>
                                    <span className="font-bold text-red-700 text-sm">Rack 6</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("Rack 6")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Rack 5 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("Rack 5")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R5</span>
                                    <span className="font-bold text-red-700 text-sm">Rack 5</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("Rack 5")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Espacio 5% */}
                            <div className="w-[5%] h-full"></div>

                            {/* Rack 4 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("Rack 4")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R4</span>
                                    <span className="font-bold text-red-700 text-sm">Rack 4</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("Rack 4")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Rack 3 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("Rack 3")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R3</span>
                                    <span className="font-bold text-red-700 text-sm">Rack 3</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("Rack 3")} productos
                                    </span>
                                </div>
                            </div>

                            {/* Espacio 5% */}
                            <div className="w-[5%] h-full"></div>

                            {/* Rack 2 */}
                            <div className="w-[10%] h-full">
                                <div 
                                    className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                    onClick={() => onEstanteriaClick("Rack 2")}
                                >
                                    <span className="font-bold text-red-800 text-xl">R2</span>
                                    <span className="font-bold text-red-700 text-sm">Rack 2</span>
                                    <span className="text-xs text-red-600 mt-1">
                                        {productosPorEstanteria("Rack 2")} productos
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Estantería 7 abajo */}
                        <div className="h-[10%]">
                            <div 
                                className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                                onClick={() => onEstanteriaClick("Estantería 7")}
                            >
                                <span className="font-bold text-orange-800 text-xl">E7</span>
                                <span className="font-bold text-orange-700 text-sm">Estantería 7</span>
                                <span className="text-xs text-orange-600 mt-1">
                                    {productosPorEstanteria("Estantería 7")} productos
                                </span>
                            </div>
                        </div>
                    </div>

                </div>


                {/* ÁREA SIN UBICACIÓN (ESQUINA INFERIOR DERECHA) */}
                {productos.some(p => p.estanteria === "Sin ubicación") && (
                    <div 
                        className="absolute bottom-4 right-4 w-48 bg-gradient-to-r from-gray-300 to-gray-400 border-2 border-dashed border-gray-500 rounded-lg p-3 cursor-pointer hover:scale-105 transition-all duration-200"
                        onClick={() => onEstanteriaClick("Sin ubicación")}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800">📦 Sin ubicación</span>
                            <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">
                                {productosPorEstanteria("Sin ubicación")} productos
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanoAlmacen;