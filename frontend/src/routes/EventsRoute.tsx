import { Routes, Route } from "react-router-dom";
import StreamEvents from "@components/streamEvents";
import { initialLayoutWidgets } from "src/layout/initialLayoutWidgets";

export function EventRoutes() {
  return (
    <Routes>
      <Route>
        <Route
          index
          element={<StreamEvents initialLayouts={initialLayoutWidgets} />}
        />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
