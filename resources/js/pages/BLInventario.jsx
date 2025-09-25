import React, { useState, useEffect, useRef } from "react";
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: 'Inventario',
        href: '/BLInventario',
    },
];

export default function PlanoInventario({ productos }) {
  console.log('Productos desde Laravel:', productos);
  
  // Estados
  const [filtro, setFiltro] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showPlano, setShowPlano] = useState(true);
  
  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Extraer categorías únicas de los productos reales
  const categorias = ["Todos", ...new Set(productos.map(p => p.tipo_producto))];
  
  // Extraer estanterías únicas de los productos reales
  const estanteriasUnicas = [...new Set(productos.map(p => p.estanteria))];

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
        p.descripcion?.toLowerCase().includes(busquedaLower) || 
        p.tipo_producto?.toLowerCase().includes(busquedaLower) ||
        p.color_nombre?.toLowerCase().includes(busquedaLower) ||
        p.estanteria?.toLowerCase().includes(busquedaLower)
      );
    }

    // Filtrar por categoría (tipo_producto)
    if (categoriaFiltro !== "Todos") {
      resultado = resultado.filter(p => p.tipo_producto === categoriaFiltro);
    }

    setProductosFiltrados(resultado);
  }, [filtro, busqueda, categoriaFiltro, productos]);

  // Función para manejar el click en estantería
  const handleEstanteriaClick = (estanteria) => {
    setFiltro(filtro === estanteria ? null : estanteria);
    
    if (isMobile) {
      setShowPlano(false);
    }
  };

  // Función para obtener color según la estantería
  const getEstanteriaColor = (estanteria) => {
    const colores = {
      "Estantería Principal": "from-orange-100 to-orange-200 border-orange-400 text-orange-700",
      "Estantería Secundaria": "from-blue-100 to-blue-200 border-blue-400 text-blue-700",
      "Estantería de Bodega": "from-red-100 to-red-200 border-red-400 text-red-700",
      "Estantería 4 y 5": "from-indigo-100 to-indigo-200 border-indigo-400 text-indigo-700",
      "Rack Superior": "from-green-100 to-green-200 border-green-400 text-green-700",
      "Rack Inferior": "from-purple-100 to-purple-200 border-purple-400 text-purple-700",
      "Rack de Emergencia": "from-yellow-100 to-yellow-200 border-yellow-400 text-yellow-700",
      "Rack de Reserva": "from-pink-100 to-pink-200 border-pink-400 text-pink-700",
      "Sin ubicación": "from-gray-300 to-gray-400 border-gray-500 border-dashed text-gray-800",
    };
    
    return colores[estanteria] || "from-gray-100 to-gray-200 border-gray-400 text-gray-700";
  };

  // Renderizar lista de productos (SIMPLIFICADA - solo lista por ahora)
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
            placeholder="Buscar producto, color, tipo o ubicación..."
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
        {productosFiltrados.some(p => !p.tiene_ubicacion) && (
          <span className="text-red-500 ml-2">⚠️ Algunos sin ubicación</span>
        )}
      </div>
      
      {/* Lista de productos */}
      <div className="flex-1 overflow-y-auto pr-1 md:pr-2">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((p) => (
            <div
              key={p.id}
              className={`border-b border-gray-200 py-2 md:py-3 px-2 hover:bg-blue-50 rounded-lg transition cursor-pointer flex justify-between items-center ${
                !p.tiene_ubicacion ? 'bg-red-50 border-l-4 border-l-red-400' : ''
              }`}
              onClick={() => setFiltro(p.estanteria)}
            >
              <div className="max-w-[60%]">
                <div className="font-medium text-gray-800 text-sm md:text-base truncate">
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
                <div className={`text-xs md:text-sm font-medium truncate ${
                  !p.tiene_ubicacion ? 'text-red-700' : 'text-gray-700'
                }`}>
                  {p.estanteria}
                </div>
                <div className="text-xs text-gray-500">{p.stock_total} unidades</div>
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

  // Por ahora, mostremos solo la lista hasta que definamos el plano
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Inventario Buttons Lovers" />
      
      {/* Versión Desktop - Solo lista por ahora */}
      {!isMobile && (
        <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6 gap-4 md:gap-6">
          <div className="flex-1 bg-white/80 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl p-6 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-bold mb-2">Plano en construcción</h3>
              <p>El plano visual del almacén estará disponible pronto</p>
            </div>
          </div>
          {renderListaProductos()}
        </div>
      )}
      
      {/* Versión Móvil - Solo lista por ahora */}
      {isMobile && (
        <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col gap-4">
          {renderListaProductos()}
        </div>
      )}
    </AppLayout>
  );
}