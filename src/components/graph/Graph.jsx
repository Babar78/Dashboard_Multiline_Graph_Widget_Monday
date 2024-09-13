import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { generateDataset } from "../../utils/generateDataset";

const Graph = ({ data }) => {
  // Extract titles and weeks from the data
  const titles = Object.keys(data.graphData).map(
    (key) => data.graphData[key].title
  );

  // Generate the Dateset for the graph
  const datasets = generateDataset(data);

  // Create a reference to the canvas element
  const chartRef = useRef(null);

  // Create the chart when the component mounts
  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Define the chart data and configuration
    const chartData = {
      labels: titles, // Titles for the x-axis
      datasets: datasets, // Use dynamic datasets
    };

    // Define the chart configuration
    const config = {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: "Multiple Y-Axis Line Chart",
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",

            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
        },
      },
    };

    const chartInstance = new Chart(ctx, config);

    return () => {
      chartInstance.destroy();
    };
  }, [data]);

  return (
    <div style={{ width: "70vw", margin: "0 auto", backgroundColor: "white" }}>
      <canvas
        ref={chartRef}
        style={{ width: "100%", height: "500px" }}
      ></canvas>
    </div>
  );
};

export default Graph;
