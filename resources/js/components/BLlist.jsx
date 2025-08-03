// UsersList.jsx
// import { log } from "console";
import { TableCell, TableRow } from "flowbite-react";
import { Link, usePage  } from '@inertiajs/react'
import { useLoadStatus } from "./context/loadContext";
import { themeByProject } from "./utils/theme";
export default function BTOList({ productos, openModal }) {
  const { props } = usePage();
  const proyecto = props?.auth?.user?.proyecto || 'AZZU';
  const theme = themeByProject[proyecto];
  
  // console.log(productos);
  // console.log(totalAreas)
  return (
    <>
      {productos.map(producto => (
        <TableRow key={producto.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            {producto.tipo_producto}
          </TableCell>
          <TableCell>{producto.tamanio}</TableCell>
          <TableCell>{producto.color_nombre || 'Sin color'}</TableCell>
          <TableCell>{producto.stock_total || 'Sin cantidades'}</TableCell>
          <TableCell>{producto.descripcion || 'Sin descripcion'}</TableCell>
          <TableCell>
            <button className={`${theme.text} font-medium hover:underline cursor-pointer `}  onClick={()=> openModal(producto.id)}>
                Editar
            </button>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
