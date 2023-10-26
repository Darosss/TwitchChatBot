import { Routes, Route } from "react-router-dom";
import Overlay from "@components/overlay";

export function OverlayRoutes() {
  return (
    <Routes>
      <Route path=":overlayId" element={<Overlay editor={false} />} />
      <Route path=":overlayId/editor" element={<Overlay editor={true} />} />

      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}
