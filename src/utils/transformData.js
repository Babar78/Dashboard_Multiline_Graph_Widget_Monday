export const transformData = (mondayResData) => {
  const groups = mondayResData.boards[0].groups;

  var graphData = {};

  groups.forEach((group) => {
    graphData[group.title] = {
      id: group.id,
      title: group.title,
      items: {},
    };
  });

  mondayResData.boards[0].items_page.items.forEach((item) => {
    const group = item.group.title;

    item.column_values.forEach((itemData) => {
      // check if the items object already has the key
      if (!graphData[group].items[itemData.column.title]) {
        graphData[group].items[itemData.column.title] = {
          title: itemData.column.title,
          value: itemData.text ? Number(itemData.text) : 0,
        };
      } else {
        // plus the itemData.text to the respective key's value
        graphData[group].items[itemData.column.title].value += itemData.text
          ? Number(itemData.text)
          : 0;
      }
    });
  });

  // Function to calculate and add "91 and Up %" to both weeks
  const calculateAndAddPercentage = (data) => {
    // Loop through each week in the data object
    Object.keys(data).forEach((week) => {
      const weekData = data[week];

      const { "91 and Up": up91, "Total A/R": Balance } = weekData.items;

      // Calculate the percentage
      const percentage = (up91.value * 100) / Balance.value;

      // Add the new key "91 and Up %" with the calculated value
      weekData.items["91 and Up %"] = {
        title: "91 and Up %",
        value: Number(percentage.toFixed(2)), // Keeping two decimal places for clarity
      };
    });
  };

  // Call the function to add the percentage to the graph data
  calculateAndAddPercentage(graphData);

  return {
    graphData,
  };
};
