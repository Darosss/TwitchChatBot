import { Routes, Route } from "react-router-dom";
import Overlay from "@components/overlay";
import OverlaysList from "@components/overlay/overlaysList";

export function OverlayRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<OverlaysList />} />
        <Route path=":overlayId" element={<Overlay />} />

        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
