// resources/js/Pages/BLInventario/index.jsx
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ListaInventario from '@/components/BL/ListaInventario';
import PlanoAlmacen from '@/components/BL/PlanoAlmacen';
import { useDispositivo } from '@/components/BL/hooks/useDispositivo';
import { useFiltrosInventario } from '@/components/BL/hooks/useFiltrosInventario';

const breadcrumbs = [
    {
        title: 'Inventario',
        href: '/BLInventario',
    },
];

export default function PlanoInventario({ productos, estanterias }) {
    console.log('estanterias:',estanterias);
    
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

    // Vista móvil simplificada (solo lista)
    if (isMobile) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Inventario Buttons Lovers" />
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
                        estanterias={estanterias}
                    />
                </div>
            </AppLayout>
        );
    }

    // Vista desktop completa
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventario Buttons Lovers" />
            
            <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 gap-6">
                {/* Plano del almacén */}
                <PlanoAlmacen 
                    onEstanteriaClick={handleEstanteriaClick}
                    productos={productos}
                />
                
                {/* Lista de inventario */}
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
                    estanterias={estanterias}
                />
            </div>
        </AppLayout>
    );
}