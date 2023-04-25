import { Routes, Route } from "react-router-dom";
import ModesList from "@components/modesList";
import Tags from "@components/modesList/tags";
import Moods from "@components/modesList/moods";
import Affixes from "@components/modesList/affixes";
import ComponentWithTitle from "@components/componentWithTitle";

export function ModesRoutes() {
  return (
    <Routes>
      <Route>
        <Route
          index
          element={
            <ComponentWithTitle title="Modes" Component={<ModesList />} />
          }
        />
        <Route
          path="moods"
          element={<ComponentWithTitle title="Moods" Component={<Moods />} />}
        />
        <Route
          path="affixes"
          element={
            <ComponentWithTitle title="Affixes" Component={<Affixes />} />
          }
        />
        <Route
          path="tags"
          element={<ComponentWithTitle title="Tags" Component={<Tags />} />}
        />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
