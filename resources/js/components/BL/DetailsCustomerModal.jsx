import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Progress
} from 'flowbite-react';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineShoppingBag,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineStar
} from 'react-icons/hi';

const CustomerDetailsContainer = ({clienteDetails}) => {
  const orders = clienteDetails.pedidos;
  const cantidadOrders = orders.length;
  console.log('detalles del cliente:',clienteDetails, orders);
  
  const [customer] = useState({
    id: 'CUST-78945',
    name: 'María González',
    email: 'maria.gonzalez@example.com',
    phone: '+34 612 345 678',
    address: 'Calle Principal 123, Madrid, España',
    joinDate: '15/03/2021',
    status: 'active',
    totalOrders: 24,
    totalSpent: 3425.5,
    avgOrderValue: 142.73,
    lastOrder: '12/05/2023',
    favoriteCategory: 'Electrónica',
    satisfaction: 4.5
  });
  

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Detalles del Cliente
        </h1>
      </div>

      {/* Información y estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info cliente */}
        <Card className="bg-white dark:bg-gray-950 shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <div className="flex flex-col items-center pb-6 text-center">
            <div className="mb-3 h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 dark:from-blue-800 dark:to-blue-600 flex items-center justify-center text-4xl text-blue-600 dark:text-blue-200 shadow-md">
              <HiOutlineUser />
            </div>
            <h5 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">{clienteDetails?.nombre}</h5>
            <Badge color={customer.status === 'active' ? 'success' : 'failure'} className="mb-3 px-3 py-1 rounded-full">
              {customer.status === 'active' ? 'Activo' : 'Inactivo'}
            </Badge>

          </div>

          <div className="space-y-3 text-sm sm:text-base divide-y divide-gray-200 dark:divide-gray-700">
            <InfoRow icon={<HiOutlineMail />} text={clienteDetails.email} />
            <InfoRow icon={<HiOutlinePhone />} text={clienteDetails?.telefono} />
            <InfoRow icon={<HiOutlineLocationMarker />} text={clienteDetails?.direccion} />
            <InfoRow icon={<HiOutlineCalendar />} text={`Cliente desde: ${clienteDetails.created_at}`} />
          </div>
        </Card>

        {/* Estadísticas */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-950 shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h5 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Estadísticas del Cliente</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard icon={<HiOutlineShoppingBag />} label="Pedidos totales" value={cantidadOrders} color="text-blue-500" />
            <StatCard icon={<HiOutlineCurrencyDollar />} label="Total gastado" value={`$${customer.totalSpent.toFixed(2)}`} color="text-green-500" />
            <StatCard icon={<HiOutlineClock />} label="Último pedido" value={customer.lastOrder} color="text-purple-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard icon={<HiOutlineCurrencyDollar />} label="Valor promedio por pedido" value={`$${customer.avgOrderValue.toFixed(2)}`} color="text-yellow-500" />
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <HiOutlineStar className="mr-2 h-5 w-5 text-orange-500" />
                <span className="text-gray-600 dark:text-gray-300">Satisfacción</span>
              </div>
              <div className="flex items-center">
                <Progress progress={customer.satisfaction * 20} color="yellow" className="mr-2 flex-1" />
                <span className="text-gray-800 dark:text-white font-bold">{customer.satisfaction}/5</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Historial pedidos */}
      <Card className="bg-white dark:bg-gray-950 shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h5 className="text-xl font-bold text-gray-900 dark:text-white">Pedidos Recientes</h5>
        </div>

        <div className="overflow-x-auto">
          <Table hoverable={true}>
            <TableHead>
              <TableRow>
                <TableHeadCell>ID Pedido</TableHeadCell>
                <TableHeadCell>Fecha</TableHeadCell>
                <TableHeadCell>Artículos</TableHeadCell>
                <TableHeadCell>Total</TableHeadCell>
                <TableHeadCell>Estado</TableHeadCell>
                <TableHeadCell><span className="sr-only">Acciones</span></TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                
                <TableRow key={order.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{order.id}</TableCell>
                  <TableCell>{order.fecha_pedido}</TableCell>
                  <TableCell>
                    <ul>
                      {order.items.map(item => (
                        <li key={item.id}>
                          Empaque: {item?.empaque?.codigo_unico}, {item?.empaque?.producto?.descripcion}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>$</TableCell>
                  <TableCell>
                    <Badge color={order.estado === 'entregado' ? 'success' : order.status === 'cancelado' ? 'failure' : 'warning'} className="px-2 py-1 rounded-full">
                      {order?.estado}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition">
    <div className="flex items-center mb-2">
      <span className={`mr-2 h-5 w-5 ${color}`}>{icon}</span>
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

const InfoRow = ({ icon, text }) => (
  <div className="flex items-center py-2">
    <span className="mr-2 h-5 w-5 text-gray-500">{icon}</span>
    <span className="text-gray-600 dark:text-gray-300 break-all">{text}</span>
  </div>
);

export default CustomerDetailsContainer;
