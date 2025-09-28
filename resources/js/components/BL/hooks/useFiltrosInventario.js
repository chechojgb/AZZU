// resources/js/Hooks/useFiltrosInventario.js
import { useState, useEffect } from 'react';

export const useFiltrosInventario = (productos) => {
    const [filtro, setFiltro] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
    const [productosFiltrados, setProductosFiltrados] = useState([]);

    // Extraer categorías únicas
    const categorias = ["Todos", ...new Set(productos.map(p => p.tipo_producto))];
    
    // Extraer estanterías únicas para el filtro (usando estanterias_codigos)
    const estanteriasUnicas = [...new Set(
        productos.flatMap(p => p.estanterias_codigos || [p.estanteria])
    )].filter(Boolean);

    // Filtrar productos
    useEffect(() => {
        let resultado = productos;

        if (filtro) {
            resultado = resultado.filter(p => {
                // Buscar en estanterias_codigos (nuevo array)
                if (p.estanterias_codigos && p.estanterias_codigos.length > 0) {
                    return p.estanterias_codigos.includes(filtro);
                }
                // Fallback: buscar en la cadena de estantería
                return p.estanteria.includes(filtro);
            });
        }

        if (busqueda) {
            const busquedaLower = busqueda.toLowerCase();
            resultado = resultado.filter(p => 
                p.descripcion?.toLowerCase().includes(busquedaLower) || 
                p.tipo_producto?.toLowerCase().includes(busquedaLower) ||
                p.color_nombre?.toLowerCase().includes(busquedaLower) ||
                p.estanteria?.toLowerCase().includes(busquedaLower) ||
                // También buscar en códigos de estantería
                (p.estanterias_codigos && p.estanterias_codigos.some(codigo => 
                    codigo.toLowerCase().includes(busquedaLower)
                ))
            );
        }

        if (categoriaFiltro !== "Todos") {
            resultado = resultado.filter(p => p.tipo_producto === categoriaFiltro);
        }

        setProductosFiltrados(resultado);
    }, [filtro, busqueda, categoriaFiltro, productos]);

    const limpiarFiltros = () => {
        setFiltro(null);
        setBusqueda("");
        setCategoriaFiltro("Todos");
    };

    return {
        filtro,
        setFiltro,
        busqueda,
        setBusqueda,
        categoriaFiltro,
        setCategoriaFiltro,
        productosFiltrados,
        categorias,
        estanteriasUnicas,
        limpiarFiltros
    };
};