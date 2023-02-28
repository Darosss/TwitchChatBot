import { Routes, Route } from "react-router-dom";
import ConfigsList from "@components/configsList";

export function ConfigRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<ConfigsList />} />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
