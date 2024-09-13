export const generateDataset = (data) => {
  // Extract the weeks from the data
  const weeks = Object.keys(data.graphData);

  // Generalized extraction of items for each week
  const weekItems = weeks.map((week) => {
    return Object.values(data.graphData[week].items);
  });

  // update the weekItems to remove the "Balance" item
  const updatedWeekItems = weekItems.map((items) =>
    items.filter((item) => item.title !== "Balance")
  );

  // Matching items by title and forming the datasets, also make sure to handle all the week items and not just 2 weeks
  const dynamicMergedData = updatedWeekItems[0].map((item, index) => {
    const matchingItems = updatedWeekItems.map((items) =>
      items.find((i) => i.title === item.title)
    );
    return {
      title: item.title,
      values: matchingItems.map((i) => (i ? i.value : 0)),
    };
  });

  // Define vibrant colors for the datasets
  const vibrantColors = [
    "rgba(255, 99, 132, 1)", // Red
    "rgba(54, 162, 235, 1)", // Blue
  ];

  // Generate datasets with vibrant colors and no border color
  const datasets = dynamicMergedData.map((item, index) => ({
    label: `${item.title}`,
    data: item.values, // [value from week37, value from week38]
    backgroundColor: vibrantColors[index % vibrantColors.length], // Cycle through vibrant colors
    borderColor: vibrantColors[index % vibrantColors.length], // No border color
    borderJoinStyle: "round",
    borderWidth: 2, // No border color, only a small border width to separate bars if needed
    yAxisID: index === 0 ? "y" : "y1", // Assign y-axis based on index
  }));

  return datasets;
};
