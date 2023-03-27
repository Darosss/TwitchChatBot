import { Routes, Route } from "react-router-dom";
import ModesList from "@components/modesList";
import Tags from "@components/modesList/tags";
import Moods from "@components/modesList/moods";
import Personalities from "@components/modesList/personalities";

export function ModesRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<ModesList />} />
        <Route path="moods" element={<Moods />} />
        <Route path="personalities" element={<Personalities />} />
        <Route path="tags" element={<Tags />} />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
