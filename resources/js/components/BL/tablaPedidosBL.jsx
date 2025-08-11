import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { themeByProject } from "../utils/theme";
import { usePage } from "@inertiajs/react";
import AgentModalWrapper from '@/components/agentsModalWrapper';
import { ModalViewPedidosBL } from "./modalesBL";
import { Inertia } from '@inertiajs/inertia';
import axios from "axios";

export default function TablaPedidosBL({ pedidos, search }) {
  const { props } = usePage();
  const proyecto = props?.auth?.user?.proyecto || "AZZU";
  const theme = themeByProject[proyecto];
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);

  const openModal = async (id) => {
    try {
      const response = await axios.get(`BLPedidosShow/${id}`); 
      setPedidoId(response.data.pedido);
      setModalOpen(true);
    } catch (error) {
      console.error("Error al cargar pedido", error);
    }
    console.log(pedidoId);
  };
  const closeModal = () => {
    setModalOpen(false);
    setPedidoId(null);
  };

  const estadosStyle = {
    pendiente: "text-yellow-800 bg-yellow-100",
    entregado: "text-green-800 bg-green-100",
    cancelado: "text-red-800 bg-red-100",
  };

  // Preparamos los datos antes de pasarlos a la tabla
  const data = useMemo(() => {
    return pedidos.map((pedido) => {
      // Agrupamos productos
      const productosAgrupados = pedido.items.reduce((acc, item) => {
      const productoId = item.empaque.producto.id;
      const nombreProducto = item.empaque.producto.descripcion;

      if (!acc[productoId]) {
        acc[productoId] = {
          nombre: nombreProducto,
          cantidad: 0,
        };
      }
        acc[productoId].cantidad += item.cantidad_empaques;
        return acc;
      }, {});
      const listaProductos = Object.values(productosAgrupados);

      return {
        id: pedido.id,
        cliente: pedido.cliente.nombre,
        productos: listaProductos,
        fecha: pedido.fecha_pedido,
        estado: pedido.estado,
      };
    });
  }, [pedidos]);

  // Definimos columnas
  const columns = [
    { accessorKey: "cliente", header: "Cliente" },
    {
      accessorKey: "productos",
      header: "Productos",
      cell: ({ row }) => (
        <div className="space-y-1">
          {row.original.productos.map((prod, idx) => (
            <div key={idx}>
              {prod.nombre}{" "}
              <span className="text-gray-500">x{prod.cantidad}</span>
            </div>
          ))}
        </div>
      ),
    },
    { accessorKey: "fecha", header: "Fecha acordada" },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            estadosStyle[row.original.estado] ||
            "text-gray-800 bg-gray-100"
          }`}
        >
          {row.original.estado}
        </span>
      ),
    },
    {
      id: "detalles",
      header: "Detalles",
      cell: ({ row }) => (
        <button
          className={`${theme.text} font-medium hover:underline cursor-pointer`}
          onClick={() => openModal(row.original.id)}
        >
          Detalles
        </button>
      ),
    },
  ];

  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
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
      const cellValue = String(row.getValue(columnId) ?? "").toLowerCase();
      return cellValue.includes(value.toLowerCase());
    },
  });

  // 3️⃣ Render
  return (
    <>
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 border">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
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
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-50 dark:bg-gray-700"
              } hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <AgentModalWrapper closeModal={closeModal}>
          <ModalViewPedidosBL  onClose={closeModal} pedido={pedidoId}/> 
        </AgentModalWrapper>
      )}
    </>
  );
}
