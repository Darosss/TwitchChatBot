import { Routes, Route } from "react-router-dom";
import MessagesList from "@components/MessagesList";

export function MessageRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<MessagesList messages="all" />} />
        <Route path=":userId" element={<MessagesList messages="user" />} />
        <Route
          path="stream-session/:sessionId"
          element={<MessagesList messages="session" />}
        />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
