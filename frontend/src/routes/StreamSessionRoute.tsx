import { Routes, Route } from "react-router-dom";

import StreamSessionDetail from "@components/streamSessionDetail";
import StreamSessions from "@components/streamSessions";
import MessagesList from "@components/messagesList";
import RedemptionsList from "@components/redemptionsList";
import ComponentWithTitle from "@components/componentWithTitle";

export function StreamSessionRoutes() {
  return (
    <Routes>
      <Route>
        <Route
          index
          element={
            <ComponentWithTitle
              title="Stream session"
              Component={<StreamSessions />}
            />
          }
        />
        <Route
          path=":sessionId"
          element={
            <ComponentWithTitle
              title="Stream session profile"
              Component={<StreamSessionDetail />}
            />
          }
        />
        <Route
          path=":sessionId/messages"
          element={
            <ComponentWithTitle
              title="Stream session messages"
              Component={<MessagesList messages="session" />}
            />
          }
        />
        <Route
          path=":sessionId/redemptions"
          element={
            <ComponentWithTitle
              title="Stream session redemptions"
              Component={<RedemptionsList redemptions="session" />}
            />
          }
        />

        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
