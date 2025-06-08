import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import ButtonPurple from './buttonPurple';

function ContentTableAgents({ data, search, openModal, getStatusClass }) {
  const [sorting, setSorting] = useState([]);

    const columns = useMemo(() => [
        {
        accessorKey: 'extension',
        header: 'Extension',
        cell: info => info.getValue(),
        },
        {
          accessorKey: 'member.nombre',
          header: 'Agente',
          cell: info => {
            const rowData = info.row.original;
            const nombre = rowData.member?.nombre ?? 'Sin nombre';
            const enPausa = typeof rowData.member2?.pausa === 'string' && rowData.member2.pausa.toLowerCase().includes('paused');

            return (
              <span className={`font-semibold ${enPausa ? 'text-yellow-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {nombre}
              </span>
            );
          },
        },
        {
        accessorKey: 'member.estado',
        header: 'Estado',
        cell: info => (
            <span className={getStatusClass(info.getValue())}>
            {info.getValue()}
            </span>
        ),
        },
        {
            accessorKey: 'accountcode',
            header: () => <button>TIEMPOS</button>,
            sortingFn: (rowA, rowB, columnId) => {
            const a = rowA.getValue(columnId);
            const b = rowB.getValue(columnId);
        
            if (a == null && b == null) return 0;
            if (a == null) return 1; // `a` va después
            if (b == null) return -1; // `b` va después
        
            return a > b ? 1 : a < b ? -1 : 0;
            },
            cell: info => info.getValue() ?? '---',
        },
        {
        id: 'admin',
        header: 'Administrar',
        cell: info => (
            <ButtonPurple content="Acciones" onClick={() => openModal(info.row.original)}/>  
        ),
        },
    ], [getStatusClass, openModal]);

    const globalFilterFn = (row, columnId, filterValue) => {
        return String(row.getValue(columnId))
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    };
  

    const table = useReactTable({
        data,
        columns,
        state: {
        sorting,
        globalFilter: search
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        debugTable: false,
    });

  return (
    <div className="overflow-x-auto">

      <table className="min-w-[600px] w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-6 py-3 cursor-pointer" onClick={header.column.getToggleSortingHandler()}>
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
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="bg-white dark:bg-[#011111]  border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContentTableAgents;
