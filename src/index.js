import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import queryNAICSTerm from "./helpers/queryNAICSTerm";
import queryNAICSCode from "./helpers/queryNAICSCode";
import queryBusinessPatterns from "./helpers/queryBusinessPatterns";

import TimelineChart from "./components/timelineChart";

import "./styles.css";
import { func } from "prop-types";

//TODO:
// add search box
// add default screen
// filter by lower digit ids
// update CodeForAmerica
// link up map data

function App() {
  const [types, setTypes] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [selectedCodeInfo, setSelectCodeInfo] = useState(null);

  useEffect(() => {
    queryNAICSTerm("Grocery Stores").then(result => setTypes(result));
  }, []);

  async function updateInfo() {
    const { name, count } = await queryNAICSCode(selectedCode);
    const timeline = await queryBusinessPatterns("11379", "zcta", selectedCode);
    setSelectCodeInfo({
      name,
      count,
      timeline
    });
  }

  useEffect(() => {
    if (selectedCode) {
      updateInfo();
    }
  }, [selectedCode]);

  return (
    <div className="App">
      {types
        ? types.map(type => (
            <li
              key={type.attributes.ID}
              onClick={() => setSelectedCode(type.attributes.ID)}
            >
              {type.attributes.Name}
            </li>
          ))
        : null}

      {selectedCode ? <h3>{selectedCode}</h3> : null}
      {selectedCodeInfo ? (
        <div>
          <p>You selected: {selectedCodeInfo.name}</p>
          <p>Number of Establishments: {selectedCodeInfo.count}</p>
          <TimelineChart
            data={selectedCodeInfo.timeline}
            keyVar="ESTAB"
            currentId="11355"
          />
        </div>
      ) : null}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
