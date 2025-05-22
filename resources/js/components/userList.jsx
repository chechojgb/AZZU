// UsersList.jsx
// import { log } from "console";
import { TableCell, TableRow } from "flowbite-react";

export default function UsersList({ users }) {
  
  console.log(users);
  return (
    <>
      {users.map(user => (
        <TableRow key={user.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            {user.name}
          </TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.rol || 'Sin rol'}</TableCell>
          <TableCell>{user.areas}</TableCell>
          <TableCell>
          {user.areas.length > 0 ? (
            user.areas.map((area, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {area.rol ?? 'Area desconocida'}{" "}
                  <span className="opacity-80">en</span>{" "}
                  <span className="font-semibold">{area.nombre}</span>
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user.rol ?? 'Rol desconocido'}
              </span>
            </div>
          )}
        </TableCell>
          <TableCell>
            <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
              Editar
            </a>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
