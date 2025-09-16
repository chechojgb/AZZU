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
import { HiCheck, HiX } from "react-icons/hi";

export default function TablaMarcacionBL({itemsPedidos, search}) {
  const { props } = usePage();
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

  const columns = [
    { accessorKey: 'pedido.cliente.nombre', header: 'cliente' },
    {
      header: 'pedido',
      accessorFn: (row) => 'PED #' + (row.pedido_id ? row.pedido_id : '') +' - ' + (row.empaque?.producto?.descripcion ?? '—') ?? '—'
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
            <option value="en proceso">En proceso</option>
            <option value="completado">Completado</option>
          </select>
        );
      }
    },
    {
      header: 'Completado por',
      accessorFn: row => row.marcaciones?.[0]?.trabajador?.name ?? 'Sin asignar'
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
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-8">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
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
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={`${
                index % 2 === 0
                  ? 'bg-white dark:bg-gray-800'
                  : 'bg-gray-50 dark:bg-gray-700'
              } hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
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
    </>
  );
}
