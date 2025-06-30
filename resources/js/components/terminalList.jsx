// UsersList.jsx
// import { log } from "console";
import { TableCell, TableRow } from "flowbite-react";
import { Link, usePage  } from '@inertiajs/react'
import { useLoadStatus } from "./context/loadContext";
import { themeByProject } from "./utils/theme";
export default function TerminalList({ terminales, openModal }) {
  const { props } = usePage();
  const proyecto = props?.auth?.user?.proyecto || 'AZZU';
  const theme = themeByProject[proyecto];
  
  console.log(terminales);
  // console.log(totalAreas)
  return (
    <>
      {terminales.map(terminal => (
        <TableRow key={terminal.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            {terminal.name}
          </TableCell>
          <TableCell>{terminal.host}</TableCell>
          <TableCell>{terminal.username || 'Sin rol'}</TableCell>
          <TableCell>{terminal.description || 'Sin descripcion'}</TableCell>
          <TableCell>
            <button className={`${theme.text} font-medium hover:underline cursor-pointer `}  onClick={()=> openModal(terminal.id)}>
                Editar
            </button>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
