import { Routes, Route, Outlet } from "react-router-dom";
import Overlay, { OverlayDataContextProvider } from "@components/overlay";

export function OverlayRoutes() {
  return (
    <Routes>
      <Route path=":overlayId" element={<OverlayWrappedWithContext />}>
        <Route index element={<Overlay editor={false} />} />
        <Route path="editor" element={<Overlay editor={true} />} />
      </Route>

      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}

const OverlayWrappedWithContext = () => {
  return (
    <>
      <OverlayDataContextProvider>
        <Outlet />
      </OverlayDataContextProvider>
    </>
  );
};
