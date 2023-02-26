import "./style.css";
import React from "react";

import { SocketContext, socketConn } from "@context/SocketContext";
import SideBar from "@components/SideBar";

import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";

import { MessageRoutes } from "@routes/message.routes";
import { UserRoutes } from "@routes/user.routes";
import { ConfigRoutes } from "@routes/configs.routes";
import { TriggerRoutes } from "@routes/trigger.routes";
import { StreamSessionRoutes } from "@routes/streamSession.routes";
import { RedemptionRoutes } from "@routes/redemption.routes";
import { CommandRoutes } from "@routes/command.routes";
import { EventRoutes } from "@routes/events.routes";
import { OverlayRoutes } from "@routes/overlay.routes";

function App() {
  return (
    <SocketContext.Provider value={socketConn}>
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <SideBar />
          </header>
        </div>

        <div className="main">
          <Routes>
            <Route path="/overlay" element={<OverlayLayout />}>
              <Route index element={<OverlayRoutes />} />
            </Route>

            <Route path="/" element={<DefaultRouteLayout />}>
              <Route index element={<>HOME </>} />
              <Route path="users/*" element={<UserRoutes />} />
              <Route path="messages/*" element={<MessageRoutes />} />
              <Route path="commands/*" element={<CommandRoutes />} />
              <Route path="events/*" element={<EventRoutes />} />
              <Route path="redemptions/*" element={<RedemptionRoutes />} />
              <Route
                path="stream-sessions/*"
                element={<StreamSessionRoutes />}
              />
              <Route path="triggers/*" element={<TriggerRoutes />} />
              <Route path="configs/*" element={<ConfigRoutes />} />
              <Route path="*" element={<>Not found</>} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

const DefaultRouteLayout = () => {
  return (
    <div className="main-other">
      <Outlet />
    </div>
  );
};
const OverlayLayout = () => {
  return (
    <div className="main-overlay">
      <Outlet />
    </div>
  );
};
export default App;
