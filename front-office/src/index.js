import React from 'react';
import { render } from "react-dom";
import { ChimpWidget } from "./lib";

const App = () => (
  <div style={{ width: 640, margin: "15px auto" }}>
    <h1>Chimp Assist Widget Demo</h1>
    <ChimpWidget     
      backendEndpoint="http://localhost:3134"
      mqttBrokerHost="http://localhost:8080/mqtt"
      mqttBaseTopic="chimpassist/demo"
      title="Chimp Assist Demo"
     />
  </div>
);


render(<App />, document.getElementById("root"));
