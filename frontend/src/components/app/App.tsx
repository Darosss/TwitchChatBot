import React from "react";

import { SocketContextProvider } from "@context";
import SideBar from "@components/sideBar";

import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { ReactNotifications } from "react-notifications-component";
import { HelmetProvider } from "react-helmet-async";
import Home from "@components/home";
import OverlayList from "@components/overlay/overlaysList";
import ComponentWithTitle from "@components/componentWithTitle";
import {
  OverlayRoutes,
  UserRoutes,
  MessageRoutes,
  MessageCategoriesRoute,
  CommandRoutes,
  EventRoutes,
  ModesRoutes,
  RedemptionRoutes,
  StreamSessionRoutes,
  TimersRoute,
  TriggerRoutes,
  ConfigRoutes,
  SongsRoutes,
} from "@routes";

function App() {
  return (
    <SocketContextProvider>
      <HelmetProvider>
        <BrowserRouter>
          <div className="main">
            <ReactNotifications />
            <Routes>
              <Route element={<OverlayLayout />}>
                <Route path="/overlay/*" element={<OverlayRoutes />} />
              </Route>
              <Route element={<HomeLayout />}>
                <Route path="/" element={<Home />} />
              </Route>

              <Route element={<DefaultRouteLayout />}>
                <Route
                  path="/overlay"
                  element={
                    <ComponentWithTitle
                      title="Overlays"
                      component={<OverlayList />}
                    />
                  }
                />

                <Route path="/users/*" element={<UserRoutes />} />
                <Route path="/messages/*" element={<MessageRoutes />} />
                <Route
                  path="/message-categories/*"
                  element={<MessageCategoriesRoute />}
                />
                <Route path="/commands/*" element={<CommandRoutes />} />
                <Route path="/events/*" element={<EventRoutes />} />
                <Route path="/modes/*" element={<ModesRoutes />} />
                <Route path="/redemptions/*" element={<RedemptionRoutes />} />
                <Route
                  path="/stream-sessions/*"
                  element={<StreamSessionRoutes />}
                />
                <Route path="/songs/*" element={<SongsRoutes />} />
                <Route path="/timers/*" element={<TimersRoute />} />
                <Route path="/triggers/*" element={<TriggerRoutes />} />
                <Route path="/configs/*" element={<ConfigRoutes />} />
                <Route path="/*" element={<>Not found</>} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </HelmetProvider>
    </SocketContextProvider>
  );
}

const DefaultRouteLayout = () => {
  return (
    <div className="main-other">
      <SideBar />

      <Outlet />
    </div>
  );
};

const HomeLayout = () => {
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
