import { Routes, Route } from "react-router-dom";
import Overlay from "@components/overlay";

export function OverlayRoutes() {
  return (
    <Routes>
      <Route path=":overlayId">
        <Route index element={<Overlay editor={false} />} />
        <Route path="editor" element={<Overlay editor={true} />} />
      </Route>

      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}
