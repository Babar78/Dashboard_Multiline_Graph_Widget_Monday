import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";
import { transformData } from "./utils/transformData";
import Loader from "./components/loader/Loader";
import Graph from "./components/graph/Graph";

const monday = mondaySdk();

const App = () => {
  const [context, setContext] = useState();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState();

  // Fetch all items with cursor-based pagination
  const fetchAllItems = async (boardId, items = [], cursor = null) => {
    const query = `
      query {
        boards(ids: ${boardId}) {
          groups {
            id
            title
          }
          items_page(limit: 50 ${cursor ? `, cursor: "${cursor}"` : ""}) {
            cursor
            items {
              group {
                id
                title
              }
              id
              column_values(ids: ["numbers__1","numbers_3__1", "numbers_2__1", "numbers_1__1", "numbers7__1", "numbers8__1"]) {
                column {
                  title
                }
                id
                text
              }
            }
          }
        }
      }
    `;

    const res = await monday.api(query);
    let newItems = res.data.boards[0].items_page.items;

    let nextCursor = res.data.boards[0].items_page.cursor;

    while (nextCursor) {
      const nextQuery = `
      query {
        boards(ids: ${boardId}) {
          groups {
            id
            title
          }
          items_page(limit: 50 ${
            nextCursor ? `, cursor: "${nextCursor}"` : ""
          }) {
            cursor
            items {
              group {
                id
                title
              }
              id
              column_values(ids: ["numbers__1","numbers_3__1", "numbers_2__1", "numbers_1__1", "numbers7__1", "numbers8__1"]) {
                column {
                  title
                }
                id
                text
              }
            }
          }
        }
      }
    `;

      const nextRes = await monday.api(nextQuery);

      newItems.push(...nextRes.data.boards[0].items_page.items);

      nextCursor = nextRes.data.boards[0].items_page.cursor;
    }

    const groups = res.data.boards[0].groups;

    // // Return all the items once all pages are fetched
    return { allItems: newItems, groups };
  };

  useEffect(() => {
    monday.execute("valueCreatedForUser");

    monday.listen("context", async (res) => {
      setContext(res.data);

      const boardId = res.data.boardIds[0]; // Assuming you're dealing with the first board

      // Fetch all items from the board with pagination
      const { allItems, groups } = await fetchAllItems(boardId);

      // // Update the response data object structure to include all items
      const fullData = {
        boards: [
          {
            groups: groups,
            items_page: {
              items: allItems, // Make sure items are in a single array
            },
          },
        ],
      };

      // // Call transformData with all items
      const transformedData = transformData(fullData);
      setData(transformedData);
      setLoading(false);
    });
  }, []);

  return (
    <div className="App">{loading ? <Loader /> : <Graph data={data} />}</div>
  );
};

export default App;
