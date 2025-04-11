import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const RevenueChart = ({ chartData, selected }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 capitalize">
        {selected} Revenue vs Cost
      </h2>
      <Line
        data={{
          labels: chartData.map((d) => d.label),
          datasets: [
            {
              label: "Revenue",
              data: chartData.map((d) => d.revenue),
              backgroundColor: "#4F46E5",
              borderColor: "#4F46E5",
              tension: 0.4,
            },
            {
              label: "Cost",
              data: chartData.map((d) => d.cost),
              backgroundColor: "#F87171",
              borderColor: "#F87171",
              tension: 0.4,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 800,
            easing: "easeInOutQuart",
          },
          plugins: {
            legend: {
              labels: {
                color: "#333",
              },
            },
          },
          scales: {
            x: {
              ticks: { color: "#666" },
              grid: { display: false },
            },
            y: {
              ticks: { color: "#666" },
              grid: { color: "#eee" },
            },
          },
        }}
        height={300}
      />
    </div>
  );
};

export default RevenueChart;
