import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const colores = ["#4ade80", "#60a5fa", "#facc15", "#fb923c", "#f87171"];

export default function StockActualProductosBL({ productosStock }) {
  // console.log(productosStock);
  const productosStockArray = Object.values(productosStock);
  const data = {
    labels: productosStockArray.map((p) => p.descripcion),
    datasets: [
      {
        data: productosStockArray.map((p) => p.stock_total),
        backgroundColor: colores,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: { size: 10 },
          color: "#374151",
        },
      },
    },
  };

  return (
    <div className="relative flex flex-col h-full p-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
        Stock actual de productos
      </h3>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-70 h-70">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
