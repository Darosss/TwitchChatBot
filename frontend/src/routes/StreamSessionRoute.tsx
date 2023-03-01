import { Routes, Route } from "react-router-dom";

import StreamSessionDetail from "@components/streamSessionDetail";
import StreamSessions from "@components/streamSessions";
import MessagesList from "@components/messagesList";
import RedemptionsList from "@components/redemptionsList";

export function StreamSessionRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<StreamSessions />} />
        <Route path=":sessionId" element={<StreamSessionDetail />} />
        <Route
          path=":sessionId/messages"
          element={<MessagesList messages="session" />}
        />
        <Route
          path=":sessionId/redemptions"
          element={<RedemptionsList redemptions="session" />}
        />

        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
