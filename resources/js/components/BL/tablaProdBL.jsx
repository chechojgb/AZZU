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

export default function TablaProductosBL({ productos, openModal, search }) {
  const { props } = usePage();
  const proyecto = props?.auth?.user?.proyecto || 'AZZU';
  const theme = themeByProject[proyecto];

  const columns = [
    { accessorKey: 'tipo_producto', header: 'Tipo de producto' },
    { accessorKey: 'tamanio', header: 'Tamaño' },
    { accessorKey: 'color_nombre', header: 'Colores' },
    { accessorKey: 'stock_total', header: 'Cantidades' },
    { accessorKey: 'descripcion', header: 'Descripción' },
    {
      id: 'acciones',
      header: 'Editar Producto',
      cell: ({ row }) => (
        <button
          className={`${theme.text} font-medium hover:underline cursor-pointer`}
          onClick={() => openModal(row.original.id)}
        >
          Editar
        </button>
      ),
    },
  ];

  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: productos,
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
    <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
  );
}
