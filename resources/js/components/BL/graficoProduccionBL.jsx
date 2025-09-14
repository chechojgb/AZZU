import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useState } from 'react';

export default function GraficoProduccionBL({ semanal, mensual, trimestral }) {
    console.log('trimestral:', trimestral);
    
  const [tipo, setTipo] = useState('semanal');

  const renderGrafico = () => {
    if (tipo === 'semanal') {
      return (
        <LineChart data={semanal} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
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
      );
    }

    if (tipo === 'mensual') {
      return (
        <BarChart data={mensual} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis dataKey="dia" stroke="#888888" /> {/* usa 'dia' del mes */}
          <YAxis stroke="#888888" />
          <Tooltip />
          <Bar dataKey="produccion" fill="#3b82f6" barSize={40} />
        </BarChart>
      );
    }

    if (tipo === 'trimestral') {
      return (
        <AreaChart data={trimestral} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis dataKey="mes" stroke="#888888" /> {/* usa 'mes' abreviado */}
          <YAxis stroke="#888888" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="produccion"
            stroke="#3b82f6"
            fill="#4e90f9ff"
            fillOpacity={0.4}
          />
        </AreaChart>
      );
    }
  };

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Producción
        </h3>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="rounded-lg border px-2 py-1 text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="semanal">Semanal</option>
          <option value="mensual">Mensual</option>
          <option value="trimestral">Trimestral</option>
        </select>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {renderGrafico()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
