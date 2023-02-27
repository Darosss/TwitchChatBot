import { Routes, Route } from "react-router-dom";
import Overlay from "@components/overlay";

export function OverlayRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<Overlay />} />

        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
