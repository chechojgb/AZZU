// UsersList.jsx
// import { log } from "console";
import { TableCell, TableRow } from "flowbite-react";
import { Link } from '@inertiajs/react'
export default function AreaList({ areas, openModal }) {
  
  console.log(areas);
  // console.log(totalAreas)
  return (
    <>
      {areas.map(area => (
        <TableRow key={area.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            {area.name}
          </TableCell>
          <TableCell>{area.created_at}</TableCell>
          <TableCell>{area.updated_at || 'Sin rol'}</TableCell>
          <TableCell>
            <button  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer" onClick={()=> openModal(area.id)}>
                Editar
            </button>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
