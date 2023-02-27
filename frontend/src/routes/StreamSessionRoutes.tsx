import { Routes, Route } from "react-router-dom";

import TwitchSessionDetail from "@components/TwitchSessionDetail";
import TwitchSessions from "@components/TwitchSessions";

export function StreamSessionRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<TwitchSessions />} />
        <Route path=":sessionId" element={<TwitchSessionDetail />} />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
