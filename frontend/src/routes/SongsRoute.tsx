import { Routes, Route } from "react-router-dom";
import ComponentWithTitle from "@components/componentWithTitle";
import SongsList from "@components/songsList";

export function SongsRoutes() {
  return (
    <Routes>
      <Route
        element={<ComponentWithTitle title="Songs" component={<SongsList />} />}
      >
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
