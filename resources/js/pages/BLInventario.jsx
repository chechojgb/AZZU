import React, { useState, useEffect, useRef } from "react";
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: 'Inventario',
        href: '/BLInventario',
    },
];

export default function PlanoInventario() {
  // Productos de ejemplo (simulan lo que vendría de Laravel/DB)
  const productos = [
    { id: 1, nombre: "Botón Azul", estanteria: "Estantería 1", cantidad: 15, categoria: "Electrónicos" },
    { id: 2, nombre: "Botón Rojo", estanteria: "Estantería 2", cantidad: 8, categoria: "Electrónicos" },
    { id: 3, nombre: "Botón Verde", estanteria: "Estantería 3", cantidad: 22, categoria: "Electrónicos" },
    { id: 4, nombre: "Botón Amarillo", estanteria: "Estantería 4 y 5", cantidad: 12, categoria: "Electrónicos" },
    { id: 5, nombre: "Botón Negro", estanteria: "Rack 1", cantidad: 30, categoria: "Electrónicos" },
    { id: 6, nombre: "Botón Blanco", estanteria: "Rack 2", cantidad: 5, categoria: "Electrónicos" },
    { id: 7, nombre: "Cable USB", estanteria: "Estantería 2", cantidad: 18, categoria: "Cables" },
    { id: 8, nombre: "Adaptador HDMI", estanteria: "Estantería 3", cantidad: 7, categoria: "Accesorios" },
    { id: 9, nombre: "Batería AA", estanteria: "Estantería 4 y 5", cantidad: 50, categoria: "Baterías" },
    { id: 10, nombre: "Cargador Inalámbrico", estanteria: "Rack 1", cantidad: 9, categoria: "Electrónicos" },
  ];

  const [filtro, setFiltro] = useState(null);
  const [hoverInfo, setHoverInfo] = useState({ 
    visible: false, 
    x: 0, 
    y: 0, 
    estanteria: null, 
    productos: [],
    elementRect: null 
  });
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [estanterias, setEstanterias] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [tooltipTimeout, setTooltipTimeout] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showPlano, setShowPlano] = useState(true); // Para alternar entre plano y lista en móviles
  
  const tooltipRef = useRef(null);
  const planoRef = useRef(null);

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Extraer categorías únicas
  const categorias = ["Todos", ...new Set(productos.map(p => p.categoria))];

  // Extraer estanterías únicas
  useEffect(() => {
    const estanteriasUnicas = [...new Set(productos.map(p => p.estanteria))];
    setEstanterias(estanteriasUnicas);
  }, []);

  // Filtrar productos según múltiples criterios
  useEffect(() => {
    let resultado = productos;

    // Filtrar por estantería
    if (filtro) {
      resultado = resultado.filter(p => p.estanteria === filtro);
    }

    // Filtrar por búsqueda
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(busquedaLower) || 
        p.estanteria.toLowerCase().includes(busquedaLower)
      );
    }

    // Filtrar por categoría
    if (categoriaFiltro !== "Todos") {
      resultado = resultado.filter(p => p.categoria === categoriaFiltro);
    }

    setProductosFiltrados(resultado);
  }, [filtro, busqueda, categoriaFiltro]);

  // Función para tooltip mejorada (solo desktop)
  const handleMouseEnter = (e, estanteria) => {
    if (isMobile) return;
    
    // Limpiar timeout anterior si existe
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
    
    const productosEnEstanteria = productos.filter(p => p.estanteria === estanteria);
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Pequeño delay para evitar titileo
    const timeout = setTimeout(() => {
      setHoverInfo({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top,
        estanteria,
        productos: productosEnEstanteria,
        elementRect: rect
      });
    }, 100);
    
    setTooltipTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    
    // Limpiar timeout si el mouse sale antes de que se muestre el tooltip
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
    
    // Pequeño delay para evitar titileo al mover entre elementos
    const timeout = setTimeout(() => {
      setHoverInfo({ 
        visible: false, 
        x: 0, 
        y: 0, 
        estanteria: null, 
        productos: [],
        elementRect: null 
      });
    }, 50);
    
    setTooltipTimeout(timeout);
  };

  // Función para manejar el click en estantería
  const handleEstanteriaClick = (estanteria) => {
    setFiltro(filtro === estanteria ? null : estanteria);
    
    // En móvil, al hacer click mostrar la lista de productos
    if (isMobile) {
      setShowPlano(false);
    }
    
    // Ocultar tooltip inmediatamente al hacer click
    setHoverInfo({ 
      visible: false, 
      x: 0, 
      y: 0, 
      estanteria: null, 
      productos: [],
      elementRect: null 
    });
  };

  // Función para obtener color según la estantería
  const getEstanteriaColor = (estanteria) => {
    const colores = {
      "Estantería 1": "from-orange-100 to-orange-200 border-orange-400 text-orange-700",
      "Estantería 2": "from-blue-100 to-blue-200 border-blue-400 text-blue-700",
      "Estantería 3": "from-red-100 to-red-200 border-red-400 text-red-700",
      "Estantería 4 y 5": "from-indigo-100 to-indigo-200 border-indigo-400 text-indigo-700",
      "Rack 1": "from-green-100 to-green-200 border-green-400 text-green-700",
      "Rack 2": "from-purple-100 to-purple-200 border-purple-400 text-purple-700",
      "Rack 3": "from-yellow-100 to-yellow-200 border-yellow-400 text-yellow-700",
      "Rack 4": "from-pink-100 to-pink-200 border-pink-400 text-pink-700",
    };
    
    return colores[estanteria] || "from-gray-100 to-gray-200 border-gray-400 text-gray-700";
  };

  // Calcular posición del tooltip para evitar superposición (solo desktop)
  const calcularPosicionTooltip = (rect, tooltipWidth = 200, tooltipHeight = 150) => {
    const margin = 10;
    let x = rect.left + rect.width / 2 - tooltipWidth / 2;
    let y = rect.top - tooltipHeight - margin;
    
    // Ajustar si el tooltip se sale por la parte superior
    if (y < margin) {
      y = rect.bottom + margin;
    }
    
    // Ajustar si el tooltip se sale por la izquierda
    if (x < margin) {
      x = margin;
    }
    
    // Ajustar si el tooltip se sale por la derecha
    const maxX = window.innerWidth - tooltipWidth - margin;
    if (x > maxX) {
      x = maxX;
    }
    
    return { x, y };
  };

  // Renderizar el plano para desktop
  const renderPlanoDesktop = () => (
    <div className="relative flex-1 bg-white/80 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl p-6 overflow-hidden">
      {/* Título del plano */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">📋 Plano del Almacén</h2>
      
      {/* Estantería 1 */}
      <div
        className={`absolute top-6 left-6 w-36 h-20 bg-gradient-to-br ${getEstanteriaColor("Estantería 1")} border-2 rounded-xl flex justify-center items-center shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl z-10`}
        onClick={() => handleEstanteriaClick("Estantería 1")}
        onMouseEnter={(e) => handleMouseEnter(e, "Estantería 1")}
        onMouseLeave={handleMouseLeave}
      >
        <span className="font-bold">Estantería 1</span>
      </div>

      {/* Estantería 2 */}
      <div
        className={`absolute top-40 left-6 w-[380px] h-16 bg-gradient-to-br ${getEstanteriaColor("Estantería 2")} border-2 rounded-xl flex justify-center items-center shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl z-10`}
        onClick={() => handleEstanteriaClick("Estantería 2")}
        onMouseEnter={(e) => handleMouseEnter(e, "Estantería 2")}
        onMouseLeave={handleMouseLeave}
      >
        <span className="font-bold">Estantería 2</span>
      </div>

      {/* Estantería 3 */}
      <div
        className={`absolute top-64 left-6 w-[380px] h-16 bg-gradient-to-br ${getEstanteriaColor("Estantería 3")} border-2 rounded-xl flex justify-center items-center shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl z-10`}
        onClick={() => handleEstanteriaClick("Estantería 3")}
        onMouseEnter={(e) => handleMouseEnter(e, "Estantería 3")}
        onMouseLeave={handleMouseLeave}
      >
        <span className="font-bold">Estantería 3</span>
      </div>

      {/* Estantería 4 y 5 */}
      <div
        className={`absolute bottom-12 left-6 w-[450px] h-24 bg-gradient-to-br ${getEstanteriaColor("Estantería 4 y 5")} border-2 rounded-xl flex justify-center items-center shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl z-10`}
        onClick={() => handleEstanteriaClick("Estantería 4 y 5")}
        onMouseEnter={(e) => handleMouseEnter(e, "Estantería 4 y 5")}
        onMouseLeave={handleMouseLeave}
      >
        <span className="font-bold">Estantería 4 y 5</span>
      </div>

      {/* Racks (zona derecha) */}
      <div className="absolute top-32 right-10 flex gap-8 z-10">
        {["Rack 1", "Rack 2", "Rack 3", "Rack 4"].map((rack) => (
          <div
            key={rack}
            className={`w-28 h-[400px] bg-gradient-to-b ${getEstanteriaColor(rack)} border-2 rounded-2xl shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl`}
            onClick={() => handleEstanteriaClick(rack)}
            onMouseEnter={(e) => handleMouseEnter(e, rack)}
            onMouseLeave={handleMouseLeave}
          >
            <span className="font-semibold rotate-90 whitespace-nowrap">{rack}</span>
          </div>
        ))}
      </div>

      {/* Tooltip flotante mejorado (solo desktop) */}
      {hoverInfo.visible && hoverInfo.elementRect && (
        <div
          ref={tooltipRef}
          className="absolute bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-xl p-3 z-50 max-w-xs"
          style={{
            top: calcularPosicionTooltip(hoverInfo.elementRect).y,
            left: calcularPosicionTooltip(hoverInfo.elementRect).x
          }}
          onMouseEnter={() => {
            // Cancelar el ocultamiento si el mouse entra al tooltip
            if (tooltipTimeout) {
              clearTimeout(tooltipTimeout);
              setTooltipTimeout(null);
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="font-bold text-lg mb-2 text-gray-800">{hoverInfo.estanteria}</div>
          <div className="text-sm text-gray-600 mb-2">
            {hoverInfo.productos.length} producto(s) en esta ubicación
          </div>
          <ul className="max-h-40 overflow-y-auto">
            {hoverInfo.productos.map((p) => (
              <li key={p.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                <span className="truncate">{p.nombre}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {p.cantidad} unidades
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // Renderizar el plano para móvil (versión simplificada)
  const renderPlanoMobile = () => (
    <div className="relative w-full h-full bg-white/80 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl p-4 overflow-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">📋 Plano del Almacén</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Estanterías como botones grandes */}
        {estanterias.map((estanteria) => (
          <div
            key={estanteria}
            className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${filtro === estanteria ? 'ring-4 ring-blue-400 scale-105' : ''}`}
            onClick={() => handleEstanteriaClick(estanteria)}
          >
            <div className={`w-full h-16 rounded-lg flex items-center justify-center mb-2 ${getEstanteriaColor(estanteria).split(' ')[0]} ${getEstanteriaColor(estanteria).split(' ')[1]}`}>
              <span className="font-bold text-sm text-center">{estanteria}</span>
            </div>
            <span className="text-xs text-gray-600">
              {productos.filter(p => p.estanteria === estanteria).length} productos
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizar lista de productos
  const renderListaProductos = () => (
    <div className={`${isMobile ? 'w-full' : 'w-[450px]'} bg-white/80 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl p-4 md:p-6 overflow-hidden flex flex-col`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">📦 Inventario</h2>
        {isMobile && (
          <button 
            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
            onClick={() => setShowPlano(true)}
          >
            Volver al plano
          </button>
        )}
      </div>
      
      {/* Filtros y búsqueda */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar producto o estantería..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm md:text-base"
            onClick={() => {
              setFiltro(null);
              setBusqueda("");
              setCategoriaFiltro("Todos");
            }}
          >
            Limpiar
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium text-sm md:text-base">Categoría:</span>
          <select 
            className="border border-gray-300 rounded-lg px-2 md:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
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
          <span className="text-blue-700 text-sm md:text-base">
            Filtrado por: <strong>{filtro}</strong>
          </span>
          <button 
            className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium"
            onClick={() => setFiltro(null)}
          >
            Quitar filtro
          </button>
        </div>
      )}
      
      {/* Contador de resultados */}
      <div className="mb-3 text-xs md:text-sm text-gray-600">
        Mostrando {productosFiltrados.length} de {productos.length} productos
      </div>
      
      {/* Lista de productos */}
      <div className="flex-1 overflow-y-auto pr-1 md:pr-2">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((p) => (
            <div
              key={p.id}
              className="border-b border-gray-200 py-2 md:py-3 px-2 hover:bg-blue-50 rounded-lg transition cursor-pointer flex justify-between items-center"
              onClick={() => setFiltro(p.estanteria)}
            >
              <div className="max-w-[60%]">
                <div className="font-medium text-gray-800 text-sm md:text-base truncate">{p.nombre}</div>
                <div className="text-xs text-gray-500">{p.categoria}</div>
              </div>
              <div className="text-right max-w-[40%]">
                <div className="text-xs md:text-sm font-medium text-gray-700 truncate">{p.estanteria}</div>
                <div className="text-xs text-gray-500">{p.cantidad} unidades</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm md:text-base">
            No se encontraron productos con los filtros aplicados
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Inventario Buttons Lovers" />
      
      {/* Versión Desktop */}
      {!isMobile && (
        <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6 gap-4 md:gap-6">
          {renderPlanoDesktop()}
          {renderListaProductos()}
        </div>
      )}
      
      {/* Versión Móvil */}
      {isMobile && (
        <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col gap-4">
          {showPlano ? renderPlanoMobile() : renderListaProductos()}
        </div>
      )}
    </AppLayout>
  );
}