import { Routes, Route } from "react-router-dom";
import CommandsList from "@components/commandsList";
import ComponentWithTitle from "@components/componentWithTitle";

export function CommandRoutes() {
  return (
    <Routes>
      <Route>
        <Route
          index
          element={
            <ComponentWithTitle
              title="Chat commands"
              component={<CommandsList />}
            />
          }
        />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
