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
import axios from 'axios';
import EditarProductForm from './EditProductModal';
import AgentModalWrapper from '../agentsModalWrapper';
import { router } from '@inertiajs/react';
import { Toast } from "flowbite-react";
import { useEffect } from 'react';
import { HiCheck, HiX } from "react-icons/hi";

export default function TablaProductosBL() {
  const { props } = usePage();
  const proyecto = props?.auth?.user?.proyecto || 'AZZU';
  const theme = themeByProject[proyecto];
  const [productDetail, setProductDetail] = useState(null);
  const [colores, setColores] = useState(null);
  const [modalOpenProductEdit, setModalOpenProductEdit] = useState(false);
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

  const openModalEditProduct = async(id) => {
    try {
      const response = await axios.get(`BLProductShow/${id}`); 
      setProductDetail(response.data.productDetails);
      setColores(response.data.colores);
      setModalOpenProductEdit(true);
    } catch (error) {
      console.error("Error al cargar el producto", error);
    }
  }
  const closeModal = () => {
    setModalOpenProductEdit(false);
  };
  const handleEditarProducto = (productData) => {
    console.log("➡️ productData recibido:", productData);
    console.log("➡️ id:", productData?.id);
    router.put(route(`productBL.update`, {producto: productData.id}), productData, {
      preserveState: true,
      onSuccess: () => {
        setToast({
          show: true,
          success: true,
          message: "producto editado correctamente"
        });
        // closeModal();
        // Refrescar la lista de clientes
        // router.visit(route('clientes.index'));
      },
      onError: (errors) => {
      const primerError = Object.values(errors)[0];
      setToast({
        show: true,
        success: false,
        message: primerError || "Error al editar el producto"
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

  // <th className="px-2 sm:px-4 py-2 sm:py-3">Cliente</th>
  //             <th className="px-2 sm:px-4 py-2 sm:py-3">Pedido</th>
  //             <th className="px-2 sm:px-4 py-2 sm:py-3">Referencia</th>
  //             <th className="px-2 sm:px-4 py-2 sm:py-3">Cantidad</th>
  //             <th className="px-2 sm:px-4 py-2 sm:py-3">Nota</th>
  //             <th className="px-2 sm:px-4 py-2 sm:py-3">Estado</th>
  const columns = [
    { accessorKey: 'cliente', header: 'cliente' },
    { accessorKey: 'pedido', header: 'pedido' },
    { accessorKey: 'cantidad', header: 'cantidad' },
    { accessorKey: 'nota', header: 'nota' },
    { accessorKey: 'estado', header: 'estado' },
    {
      id: 'acciones',
      header: 'Editar Producto',
      cell: ({ row }) => (
        <button
          className={`${theme.text} font-medium hover:underline cursor-pointer`}
          onClick={() => openModalEditProduct(row.original.id)}
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
    <>
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
      {modalOpenProductEdit && (
          <AgentModalWrapper closeModal={closeModal}>
              <EditarProductForm onClose={closeModal} productDetail={productDetail} onSave={handleEditarProducto} colores={colores} />
          </AgentModalWrapper>
        )
      }
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
