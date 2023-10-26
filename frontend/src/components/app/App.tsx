import React from "react";
import { SocketContextProvider } from "@context";
import { BrowserRouter, Routes } from "react-router-dom";
import { ReactNotifications } from "react-notifications-component";
import { HelmetProvider } from "react-helmet-async";
import { AllRoutes } from "@routes";

function App() {
  return (
    <SocketContextProvider>
      <HelmetProvider>
        <BrowserRouter>
          <div className="main">
            <ReactNotifications />
            <Routes>
              <AllRoutes />
            </Routes>
          </div>
        </BrowserRouter>
      </HelmetProvider>
    </SocketContextProvider>
  );
}

export default App;
