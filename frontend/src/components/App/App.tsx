import React from "react";
import "./style.css";

import { SocketContext, socketConn } from "../../Context/SocketContext";
import SideBar from "../SideBar";

function App() {
  return (
    <SocketContext.Provider value={socketConn}>
      <div className="App">
        <header className="App-header">
          <SideBar />
        </header>
      </div>
    </SocketContext.Provider>
  );
}

export default App;
