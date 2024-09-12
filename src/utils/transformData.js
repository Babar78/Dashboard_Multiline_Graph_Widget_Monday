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
      console.log("Called");
      // check if the items object already has the key
      if (!graphData[group].items[itemData.column.title]) {
        graphData[group].items[itemData.column.title] = {
          title: itemData.column.title,
          value: Number(itemData.text),
        };
      } else {
        // plus the itemData.text to the respective key's value
        graphData[group].items[itemData.column.title].value += Number(
          itemData.text
        );
      }
    });
  });

  return {
    graphData,
  };
};
