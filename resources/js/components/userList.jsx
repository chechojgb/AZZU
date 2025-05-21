// UsersList.jsx
import { TableCell, TableRow } from "flowbite-react";

export default function UsersList({ users }) {
  return (
    <>
      {users.map(user => (
        <TableRow key={user.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            {user.name}
          </TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>Soporte</TableCell>
          <TableCell>Todas</TableCell>
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
