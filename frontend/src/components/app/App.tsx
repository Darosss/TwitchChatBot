import "./style.css";
import React from "react";

import { SocketContext, socketConn } from "@context/SocketContext";
import SideBar from "@components/sideBar";

import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { CommandRoutes } from "@routes/CommandRoute";
import { ConfigRoutes } from "@routes/ConfigsRoute";
import { EventRoutes } from "@routes/EventsRoute";
import { MessageRoutes } from "@routes/MessageRoute";
import { OverlayRoutes } from "@routes/OverlayRoute";
import { RedemptionRoutes } from "@routes/RedemptionRoute";
import { StreamSessionRoutes } from "@routes/StreamSessionRoute";
import { TriggerRoutes } from "@routes/TriggerRoute";
import { UserRoutes } from "@routes/UserRoute";
import { MessageCategoriesRoute } from "@routes/MessageCategoriesRoute";
import { ReactNotifications } from "react-notifications-component";
import { TimersRoute } from "@routes/TimersRoute";

function App() {
  return (
    <SocketContext.Provider value={socketConn}>
      <BrowserRouter>
        <div className="main">
          <ReactNotifications />
          <SideBar />
          <Routes>
            <Route element={<OverlayLayout />}>
              <Route path="/overlay/*" element={<OverlayRoutes />} />
            </Route>

            <Route element={<DefaultRouteLayout />}>
              <Route path="/" element={<>HOME </>} />
              <Route path="/users/*" element={<UserRoutes />} />
              <Route path="/messages/*" element={<MessageRoutes />} />
              <Route
                path="/message-categories/*"
                element={<MessageCategoriesRoute />}
              />
              <Route path="/commands/*" element={<CommandRoutes />} />
              <Route path="/events/*" element={<EventRoutes />} />
              <Route path="/redemptions/*" element={<RedemptionRoutes />} />
              <Route
                path="/stream-sessions/*"
                element={<StreamSessionRoutes />}
              />
              <Route path="/timers/*" element={<TimersRoute />} />
              <Route path="/triggers/*" element={<TriggerRoutes />} />
              <Route path="/configs/*" element={<ConfigRoutes />} />
              <Route path="/*" element={<>Not found</>} />
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
