import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";

const RevenueCostGraph = () => {
  const [view, setView] = useState("daily");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchChartData();
  }, [view]);

  const fetchChartData = async () => {
    const res = await axios.get(`/api/invoices/summary?view=${view}`);
    setChartData(res.data);
  };

  const data = {
    labels: chartData.map((item) => item.date),
    datasets: [
      {
        label: "Revenue",
        data: chartData.map((item) => item.revenue),
        borderColor: "green",
        fill: false,
      },
      {
        label: "Cost",
        data: chartData.map((item) => item.cost),
        borderColor: "red",
        fill: false,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Revenue vs Cost</h2>
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <Line data={data} />
    </div>
  );
};

export default RevenueCostGraph;
