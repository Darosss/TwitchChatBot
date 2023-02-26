import { Routes, Route } from "react-router-dom";
import TwitchEvents from "@components/TwitchEvents";

export function EventRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<TwitchEvents />} />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
