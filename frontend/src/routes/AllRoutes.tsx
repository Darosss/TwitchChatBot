import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { MessageRoutes } from "./MessageRoute";
import SideBar from "@components/sideBar";
import ComponentWithTitle from "@components/componentWithTitle";
import OverlayList from "@components/overlay/overlaysList";
import { CommandRoutes } from "./CommandRoute";
import { ConfigRoutes } from "./ConfigsRoute";
import { EventRoutes } from "./EventsRoute";
import { MessageCategoriesRoute } from "./MessageCategoriesRoute";
import { ModesRoutes } from "./ModeRoute";
import { RedemptionRoutes } from "./RedemptionRoute";
import { SongsRoutes } from "./SongsRoute";
import { StreamSessionRoutes } from "./StreamSessionRoute";
import { TimersRoute } from "./TimersRoute";
import { TriggerRoutes } from "./TriggerRoute";
import { UserRoutes } from "./UserRoute";
import { OverlayRoutes } from "./OverlayRoute";
import Home from "@components/home";
import { AchievementsRoutes } from "./AchievementsRoute";

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

export const allRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<OverlayLayout />}>
        <Route path="/overlay/*" element={<OverlayRoutes />} />
      </Route>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route element={<DefaultRouteLayout />}>
        <Route path="/achievements/*" element={<AchievementsRoutes />} />
        <Route
          path="/overlay"
          element={
            <ComponentWithTitle title="Overlays" component={<OverlayList />} />
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
        <Route path="/stream-sessions/*" element={<StreamSessionRoutes />} />
        <Route path="/songs/*" element={<SongsRoutes />} />
        <Route path="/timers/*" element={<TimersRoute />} />
        <Route path="/triggers/*" element={<TriggerRoutes />} />
        <Route path="/configs/*" element={<ConfigRoutes />} />
        <Route path="/*" element={<>Not found</>} />
      </Route>
    </Route>
  )
);
