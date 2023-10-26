import { Routes, Route } from "react-router-dom";
import TriggersList from "@components/triggersList";
import ComponentWithTitle from "@components/componentWithTitle";

export function TriggerRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <ComponentWithTitle title="Triggers" component={<TriggersList />} />
        }
      />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}
