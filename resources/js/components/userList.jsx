// UsersList.jsx
// import { log } from "console";
import { TableCell, TableRow } from "flowbite-react";
import { Link } from '@inertiajs/react'
import { themeByProject } from "./utils/theme";
import {  usePage } from "@inertiajs/react";

export default function UsersList({ users, totalAreas }) {
  const { props } = usePage();
  const proyecto = props?.auth?.user?.proyecto || 'AZZU';
  const theme = themeByProject[proyecto];
  
  console.log(users);
  // console.log(totalAreas)
  return (
    <>
      {users.map(user => (
        <TableRow key={user.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            {user.name}
          </TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.rol || 'Sin rol'}</TableCell>
          <TableCell>
          {Array.isArray(user.areas) &&
          user.areas.length === totalAreas &&
          totalAreas > 0 ? (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-300"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="opacity-80">Asignado a</span>{" "}
                <span className="font-semibold">todas las áreas</span>
              </span>
            </div>
          ) : Array.isArray(user.areas) && user.areas.length > 0 ? (
            user.areas.map((area, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="opacity-80">Asignado a</span>{" "}
                  <span className="font-semibold">{area}</span>
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Sin áreas asignadas
              </span>
            </div>
          )}
        </TableCell>
          <TableCell>
            <Link href={route('users.edit', user.id)} className={`font-medium  hover:underline ${theme.text}`}>
                Editar
            </Link>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
