import "./style.css";
import React from "react";

import { SocketContext, socketConn } from "@context/SocketContext";
import SideBar from "@components/SideBar";

import { configure } from "axios-hooks";
import Axios from "axios";

const axios = Axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

configure({ axios });

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
