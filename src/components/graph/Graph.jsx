import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const Graph = ({ data }) => {
  const titles = Object.keys(data.graphData).map(
    (key) => data.graphData[key].title
  );

  // Extracting titles and values for both weeks
  const week37Items = Object.values(data.graphData["WEEK 37"].items);
  const week38Items = Object.values(data.graphData["WEEK 38"].items);

  // remove the "Balance" item from the lists
  const updatedWeek37Items = week37Items.filter(
    (item) => item.title !== "Balance"
  );

  const updatedWeek38Items = week38Items.filter(
    (item) => item.title !== "Balance"
  );

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
    "rgba(54, 162, 235, 1)",
  ];

  // Generate datasets with vibrant colors and no border color
  const datasets = mergedData.map((item, index) => ({
    label: `${item.title}`,
    data: item.values, // [value from week37, value from week38]
    backgroundColor: vibrantColors[index % vibrantColors.length], // Cycle through vibrant colors
    borderColor: vibrantColors[index % vibrantColors.length], // No border color
    borderJoinStyle: "round",
    borderWidth: 2, // No border color, only a small border width to separate bars if needed
    yAxisID: index === 0 ? "y" : "y1", // Assign y-axis based on index
  }));

  console.log("Dataset", datasets);

  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Define the chart data and configuration
    const chartData = {
      labels: titles, // Titles for the x-axis
      datasets: datasets, // Use dynamic datasets
    };

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
