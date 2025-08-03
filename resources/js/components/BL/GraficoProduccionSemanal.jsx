import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useEffect, useState } from 'react';

const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const generarDatosAleatorios = () =>
  dias.map((dia) => ({
    dia,
    produccion: Math.floor(Math.random() * 150) + 50, // entre 50 y 200
  }));

export default function GraficoProduccionSemanalBL() {
  const [datos, setDatos] = useState(generarDatosAleatorios());

  // Simula actualización de datos cada 5 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setDatos(generarDatosAleatorios());
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="p-5 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Producción semanal
      </h3>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datos} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis dataKey="dia" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="produccion"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
