import { Routes, Route } from "react-router-dom";
import StreamEvents from "@components/streamEvents";

export function EventRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<StreamEvents />} />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
