// resources/js/Hooks/useFiltrosInventario.js
import { useState, useEffect } from 'react';

export const useFiltrosInventario = (productos) => {
    const [filtro, setFiltro] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
    const [productosFiltrados, setProductosFiltrados] = useState([]);

    // Extraer categorías únicas
    const categorias = ["Todos", ...new Set(productos.map(p => p.tipo_producto))];
    
    // Extraer estanterías únicas
    const estanteriasUnicas = [...new Set(productos.map(p => p.estanteria))];

    // Filtrar productos
    useEffect(() => {
        let resultado = productos;

        if (filtro) {
            resultado = resultado.filter(p => p.estanteria === filtro);
        }

        if (busqueda) {
            const busquedaLower = busqueda.toLowerCase();
            resultado = resultado.filter(p => 
                p.descripcion?.toLowerCase().includes(busquedaLower) || 
                p.tipo_producto?.toLowerCase().includes(busquedaLower) ||
                p.color_nombre?.toLowerCase().includes(busquedaLower) ||
                p.estanteria?.toLowerCase().includes(busquedaLower)
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