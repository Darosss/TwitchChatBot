import React from "react";
import { SocketContextProvider } from "@socket";
import { RouterProvider } from "react-router-dom";
import { ReactNotifications } from "react-notifications-component";
import { HelmetProvider } from "react-helmet-async";
import { allRoutes } from "@routes";

function App() {
  return (
    <SocketContextProvider>
      <HelmetProvider>
        <div className="main">
          <ReactNotifications />
          <RouterProvider router={allRoutes} />
        </div>
      </HelmetProvider>
    </SocketContextProvider>
  );
}

export default App;
