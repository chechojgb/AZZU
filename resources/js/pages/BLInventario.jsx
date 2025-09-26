// resources/js/Pages/BLInventario/index.jsx
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ListaInventario from '@/components/BL/ListaInventario';
// import { useFiltrosInventario } from '@/Hooks/useFiltrosInventario';
import { useDispositivo } from '@/components/BL/Hooks/useDispositivo';
import { useFiltrosInventario } from '@/components/BL/Hooks/useFiltrosInventario';

const breadcrumbs = [
    {
        title: 'Inventario',
        href: '/BLInventario',
    },
];

export default function PlanoInventario({ productos }) {
    const { isMobile } = useDispositivo();
    
    const {
        filtro,
        setFiltro,
        busqueda,
        setBusqueda,
        categoriaFiltro,
        setCategoriaFiltro,
        productosFiltrados,
        categorias,
        limpiarFiltros
    } = useFiltrosInventario(productos);

    const handleEstanteriaClick = (estanteria) => {
        setFiltro(filtro === estanteria ? null : estanteria);
    };

    // Componente de placeholder para el plano (por ahora)
    const PlanoPlaceholder = () => (
        <div className="flex-1 bg-white/80 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl p-6 flex items-center justify-center">
            <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="text-xl font-bold mb-2">Plano en construcción</h3>
                <p>El plano visual del almacén estará disponible pronto</p>
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventario Buttons Lovers" />
            
            {!isMobile ? (
                // Vista Desktop
                <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 gap-6">
                    <PlanoPlaceholder />
                    <ListaInventario 
                        productos={productos}
                        productosFiltrados={productosFiltrados}
                        filtro={filtro}
                        busqueda={busqueda}
                        categoriaFiltro={categoriaFiltro}
                        categorias={categorias}
                        onFiltroChange={setFiltro}
                        onBusquedaChange={setBusqueda}
                        onCategoriaChange={setCategoriaFiltro}
                        onLimpiarFiltros={limpiarFiltros}
                        onEstanteriaClick={handleEstanteriaClick}
                    />
                </div>
            ) : (
                // Vista Móvil (solo lista)
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                    <ListaInventario 
                        productos={productos}
                        productosFiltrados={productosFiltrados}
                        filtro={filtro}
                        busqueda={busqueda}
                        categoriaFiltro={categoriaFiltro}
                        categorias={categorias}
                        onFiltroChange={setFiltro}
                        onBusquedaChange={setBusqueda}
                        onCategoriaChange={setCategoriaFiltro}
                        onLimpiarFiltros={limpiarFiltros}
                        onEstanteriaClick={handleEstanteriaClick}
                    />
                </div>
            )}
        </AppLayout>
    );
}