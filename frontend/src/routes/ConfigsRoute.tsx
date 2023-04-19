import { Routes, Route } from "react-router-dom";
import ConfigsList from "@components/configsList";
import ComponentWithTitle from "@components/componentWithTitle";

export function ConfigRoutes() {
  return (
    <Routes>
      <Route>
        <Route
          index
          element={
            <ComponentWithTitle title="Configs" Component={<ConfigsList />} />
          }
        />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
