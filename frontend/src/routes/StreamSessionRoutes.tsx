import { Routes, Route } from "react-router-dom";

import StreamSessionDetail from "@components/streamSessionDetail";
import StreamSessions from "@components/streamSessions";

export function StreamSessionRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<StreamSessions />} />
        <Route path=":sessionId" element={<StreamSessionDetail />} />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
