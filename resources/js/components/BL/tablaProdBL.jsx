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

export default function TablaProductosBL({ productos, openModal, search }) {
  const { props } = usePage();
  const proyecto = props?.auth?.user?.proyecto || 'AZZU';
  const theme = themeByProject[proyecto];
  const [productDetail, setProductDetail] = useState(null);
  const [colores, setColores] = useState(null);
  const [modalOpenProductEdit, setModalOpenProductEdit] = useState(false);
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
  const handleEditarProducto = (clientData) => {
    console.log('datos producto',clientData);
    router.post(route(`clientesBL.update`, clientData.id), clientData, {
      preserveState: true,
      onSuccess: () => {
        setToast({
          show: true,
          success: true,
          message: "cliente editado correctamente"
        });
        // Refrescar la lista de clientes
        // router.visit(route('clientes.index'));
      },
      onError: (errors) => {
      const primerError = Object.values(errors)[0];
      setToast({
        show: true,
        success: false,
        message: primerError || "Error al editar el cliente"
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
    </>
  );
}
