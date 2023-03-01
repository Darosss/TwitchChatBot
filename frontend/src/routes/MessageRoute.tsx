import { Routes, Route } from "react-router-dom";
import MessagesList from "@components/messagesList";

export function MessageRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<MessagesList messages="all" />} />

        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
