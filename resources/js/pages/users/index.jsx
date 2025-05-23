import { useEffect, useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import UsersList from '@/components/userList';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import UserInfoList from '@/components/userInfoList';

const breadcrumbs = [
  { title: 'Usuarios activos', href: '/users' },
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [totalAreas, setTotalAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('users/index')
      .then(res => {
        setUsers(res.data.users);
        setTotalAreas(res.data.totalAreas)
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar usuarios:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Cargando usuarios...</p>;

  // console.log(users);
  
  console.log(totalAreas)


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        
        <UserInfoList data={users}/>
        <div className="min-h-[100vh] md:min-h-min">
          <div className="border relative overflow-hidden rounded-xl border">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Nombre</TableHeadCell>
                    <TableHeadCell>Correo</TableHeadCell>
                    <TableHeadCell>Rol</TableHeadCell>
                    <TableHeadCell>Operaciones</TableHeadCell>
                    <TableHeadCell>Editar usuario</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                  <UsersList users={users} totalAreas={totalAreas}/>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
