import { Routes, Route } from "react-router-dom";
import TriggersList from "@components/triggersList";

export function TriggerRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<TriggersList />} />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
