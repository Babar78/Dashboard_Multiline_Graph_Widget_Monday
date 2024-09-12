import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const Graph = ({ data }) => {
  const titles = Object.keys(data.graphData).map(
    (key) => data.graphData[key].title
  );

  // Extracting titles and values for both weeks
  const week37Items = Object.values(data.graphData["WEEK 37"].items);
  const week38Items = Object.values(data.graphData["WEEK 38"].items);

  const updatedWeek37Items = week37Items.sort((a, b) => a.value - b.value);
  const updatedWeek38Items = week38Items.sort((a, b) => a.value - b.value);

  // Matching items by title and forming the datasets
  const mergedData = updatedWeek37Items.map((item37) => {
    const matchingItem38 = updatedWeek38Items.find(
      (item38) => item38.title === item37.title
    );
    return {
      title: item37.title,
      values: [item37.value, matchingItem38 ? matchingItem38.value : 0],
    };
  });

  const vibrantColors = [
    "rgba(255, 99, 132, 1)", // Red
    "rgba(54, 162, 235, 1)", // Blue
    "rgba(255, 206, 86, 1)", // Yellow
    "rgba(75, 192, 192, 1)", // Green
    "rgba(153, 102, 255, 1)", // Purple
    "rgba(255, 159, 64, 1)", // Orange
  ];

  // Generate datasets with vibrant colors and no border color
  const datasets = mergedData.map((item, index) => ({
    label: `${item.title}`,
    data: item.values, // [value from week37, value from week38]
    backgroundColor: vibrantColors[index % vibrantColors.length], // Cycle through vibrant colors
    borderWidth: 1, // No border color, only a small border width to separate bars if needed
  }));

  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Define the chart data and configuration
    const chartData = {
      labels: titles, // Titles for the x-axis
      datasets: datasets, // Use dynamic datasets
    };

    const config = {
      type: "bar",
      data: chartData,
      options: {
        scales: {
          x: {
            stacked: true,
          },
          y: {
            beginAtZero: true,
          },
        },
        responsive: true,
      },
    };

    const chartInstance = new Chart(ctx, config);

    return () => {
      chartInstance.destroy();
    };
  }, [data]);

  return (
    <div style={{ width: "70vw", margin: "0 auto" }}>
      <canvas
        ref={chartRef}
        style={{ width: "100%", height: "500px" }}
      ></canvas>
    </div>
  );
};

export default Graph;
