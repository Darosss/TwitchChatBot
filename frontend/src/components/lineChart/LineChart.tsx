import "./style.css";
import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartOptions {
  title: string;
  label: string;
}

export default function LineChart({
  data,
  chartOptions,
}: {
  data: Map<string, number>;
  chartOptions: ChartOptions;
}) {
  const { title, label: labelName } = chartOptions;

  const mapData = new Map(Object.entries(data));
  let labels = [];
  let dataLabel = [];
  for (const [key, value] of mapData) {
    labels.push(new Date(Number(key)).toLocaleTimeString());
    dataLabel.push(value);
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  const dataChart = {
    labels,
    datasets: [
      {
        label: labelName,
        data: dataLabel,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return <Line options={options} data={dataChart} />;
}
