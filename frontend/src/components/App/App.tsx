import React from "react";
import "./style.css";

import TwitchChat from "../TwitchChat";
import TwitchStream from "../TwitchStream";

import { SocketContext, socketConn } from "../../Context/SocketContext";

function App() {
  return (
    <SocketContext.Provider value={socketConn}>
      <div className="App">
        <header className="App-header">
          <h1> HERE MENU </h1>
          <div>
            <TwitchStream />
            <TwitchChat />
          </div>
        </header>
      </div>
    </SocketContext.Provider>
  );
}

export default App;
