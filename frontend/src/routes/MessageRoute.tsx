import { Routes, Route } from "react-router-dom";
import MessagesList from "@components/messagesList";
import ComponentWithTitle from "@components/componentWithTitle";

export function MessageRoutes() {
  return (
    <Routes>
      <Route>
        <Route
          index
          element={
            <ComponentWithTitle
              title="Messages"
              Component={<MessagesList messages="all" />}
            />
          }
        />

        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
