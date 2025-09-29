import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useState } from 'react';
import { themeByProject } from '../utils/theme';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Toast } from "flowbite-react";
import { useEffect } from 'react';
import { HiCheck, HiX, HiDownload } from "react-icons/hi";
import * as XLSX from 'xlsx';
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function TablaMarcacionBL({itemsPedidos, search}) {
  console.log(itemsPedidos);
  
  const [openModal, setOpenModal] = useState(false);
  const { props } = usePage();
  const [selectedItems, setSelectedItems] = useState([]);
  const proyecto = props?.auth?.user?.proyecto || 'AZZU';
  const theme = themeByProject[proyecto];
  const [toast, setToast] = useState({
        show: false,
        success: false,
        message: "",
  });
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, success: false, message: '' });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  const exportToExcel = () => {
    if (itemsPedidos.length === 0) {
      setToast({ show: true, success: false, message: "No hay datos para exportar" });
      return;
    }
    
    const dataForExcel = itemsPedidos.map(item => ({
      'Cliente': item.pedido?.cliente?.nombre || '',
      'Pedido': `PED #${item.pedido_id || ''} - ${item.empaque?.producto?.descripcion || '—'}`,
      'Cantidad': item.cantidad_empaques,
      'Nota': item.nota || '',
      'Estado': item.estado,
      'Completado por': item.marcaciones?.[0]?.trabajador?.name || 'Sin asignar',
      'Fecha de creacion': item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
      'Fecha de ultima actualizacion': item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '',
      'estado': item.marcaciones?.[0]?.pagado === 1 ? 'pagado' : 'pendiente',
      'costo': item.marcaciones?.[0]?.costo_total || 'Sin costo',
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    XLSX.utils.book_append_sheet(wb, ws, "Pedidos");
    XLSX.writeFile(wb, `Pedidos_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    setToast({ show: true, success: true, message: "Datos exportados correctamente" });
  };

  const columns = [
    { accessorKey: 'pedido.cliente.nombre', header: 'cliente' },
    {
      header: 'pedido',
      accessorFn: (row) =>
        `PED #${row.pedido_id ?? ''} - ${row.empaque?.producto?.descripcion ?? '—'}`
    },
    { accessorKey: 'cantidad_empaques', header: 'cantidad' },
    { accessorKey: 'nota', header: 'nota' },
    {
      header: 'Estado',
      accessorKey: 'estado',
      cell: ({ row }) => {
        const value = row.getValue("estado"); // estado actual
        const itemId = row.original.id;       // ID del item
        const handleChange = (nuevoEstado) => {
          if (value === "completado") {
            setToast({
              show: true,
              success: false,
              message: "Este item ya está completado y no se puede modificar."
            });
            return; // salir sin ejecutar el patch
          }
          router.patch(route('bl-historicos.actualizar-estado', itemId), { estado: nuevoEstado }, {
            preserveState: true,
            onSuccess: () => {
              setToast({
                show: true,
                success: true,
                message: "Item actualizado correctamente"
              });
              // Refrescar la lista de productos
              // router.visit(route('productos.index'));
            },
            onError: (errors) => {
            const primerError = Object.values(errors)[0];
            setToast({
              show: true,
              success: false,
              message: primerError || "Error al guardar el estado del item"
            });
            },
            onFinish: (visit) => {
              // Si hubo error de servidor (status 500 o más)
              if (visit.response?.status >= 500) {
                const msg = visit.response?.data?.message || "Error interno del servidor";
                setToast({
                  show: true,
                  success: false,
                  message: msg
                });
              }
            }
          });
        };


        return (
          <select
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className={`px-2 py-1 rounded text-xs font-semibold border
              ${value === "completado" ? "bg-green-100 text-green-800" :
                value === "pendiente" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"}
            `}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="completado">Completado</option>
          </select>
        );
      }
    },
    {
      header: 'Completado por',
      accessorFn: row => row.marcaciones?.[0]?.trabajador?.name ?? 'Sin asignar'
    },
    {
      accessorKey: 'updated_at',
      header: 'Fecha',
      cell: ({ row }) => {
        const fechaRaw = row.original.updated_at; // viene como 2025-09-17T18:42:53.000000Z
        const fechaObj = new Date(fechaRaw);

        // Lo mostramos en formato local
        return fechaObj.toLocaleDateString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      }
    },
    {
      id: "select",
      header: "✔",
      cell: ({ row }) => {
        const marcacion = row.original.marcaciones?.[0];
        const tieneUsuario = marcacion?.trabajador;
        const esCompletado = row.original.estado === "completado";
        const noEsPagado = !marcacion?.pagado;
        const esElegible = tieneUsuario && esCompletado && noEsPagado;

        return (
          <div className={`flex items-center gap-2 ${!esElegible ? "text-gray-400 line-through" : ""}`}>
            <input
              type="checkbox"
              className={`${!esElegible ? "cursor-not-allowed" : ""}`}
              disabled={!esElegible}
              checked={selectedItems.some(sel => sel.id === row.original.id)}
              onChange={(e) => {
                const userId = marcacion?.trabajador?.id;
                const itemData = {
                  id: row.original.id,
                  user_id: userId,
                  total: marcacion?.costo_total || 0,
                  marcacion_id: marcacion?.id,
                  nombre_trabajador: marcacion?.trabajador?.name,
                };
                if (e.target.checked) {
                  // Si ya hay items seleccionados, validamos que sea el mismo trabajador
                  if (
                    selectedItems.length > 0 &&
                    selectedItems[0].user_id !== userId
                  ) {
                    setToast({
                      show: true,
                      success: false,
                      message: "❌ Solo puedes seleccionar items del mismo trabajador",
                    });
                    return;
                  }
  
                  setSelectedItems([...selectedItems, itemData]);
                } else {
                  // Deseleccionar
                  setSelectedItems(selectedItems.filter(sel => sel.id !== row.original.id));
                }
              }}
            />
          </div>
        );
      }
    }
  ];

  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: itemsPedidos,
    columns,
    state: {
      sorting,
      globalFilter: search,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, value) => {
      const cellValue = String(row.getValue(columnId) ?? '').toLowerCase();
      return cellValue.includes(value.toLowerCase());
    },
  });

  return (
    <>
      <div className="p-4 flex md:justify-end sm:items-center bg-gray-50 dark:bg-gray-800">
        <button
          onClick={exportToExcel}
          disabled={itemsPedidos.length === 0}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50 mr-8"
        >
          <HiDownload className="h-4 w-4" />
          Exportar a Excel
        </button>
        <button
          onClick={() => {
            if (selectedItems.length === 0) {
              setToast({ show: true, success: false, message: "No hay items seleccionados" });
              return;
            }
            setOpenModal(true)
          }}
          disabled={selectedItems.length === 0} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50 mr-2"> Pasar a Pagados
        </button>
      </div>
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-8">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800/50 dark:text-gray-400">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => {
            const marcacion = row.original.marcaciones?.[0]; // accede al primer elemento
            const estaPagado = marcacion?.pagado === true || marcacion?.pagado === 1;

            return (
              <tr
                key={row.id}
                className={`
                  ${estaPagado
                    ? ' border-l-4 border-green-400    dark:border-l-4 dark:border-green-700' 
                    : !estaPagado ? ' border-l-4 border-red-400 dark:border-l-4 dark:border-red-700' : index % 2 === 0 
                      ? '' 
                      : ''
                  }
                  hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors
                `}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>

      </table>
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-51">
        <Toast>
            <div
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                toast.success ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
            }`}
            >
            {toast.success ? <HiCheck className="h-5 w-5" /> : <HiX className="h-5 w-5" />}
            </div>
            <div className="ml-3 text-sm font-normal">{toast.message}</div>
        </Toast>
        </div>
      )}
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Estás seguro de ejecutar esta acción para el trabajador: <strong>{selectedItems.map(item => item.nombre_trabajador)}</strong>?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={() => {
                router.post(route("bl-cuentas-cobro.pasar-pagados"), { items: selectedItems}, {
                  onSuccess: () => {
                    setToast({ show: true, success: true, message: "Items pasados a pagados" });
                    setSelectedItems([]); 
                  },
                  onError: (errors) => {
                    const primerError = Object.values(errors)[0];
                    setToast({ show: true, success: false, message: primerError || "Error al marcar items" });
                  }
                });
                setOpenModal(false);
              }}>
                
                Si, Estoy seguro
              </Button>
              <Button color="alternative" onClick={() => setOpenModal(false)}>
                No, cancelar
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
