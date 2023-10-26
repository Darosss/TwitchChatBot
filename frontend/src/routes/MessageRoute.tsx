import { Routes, Route } from "react-router-dom";
import MessagesList from "@components/messagesList";
import ComponentWithTitle from "@components/componentWithTitle";

export function MessageRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <ComponentWithTitle
            title="Messages"
            component={<MessagesList messages="all" />}
          />
        }
      />

      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}
