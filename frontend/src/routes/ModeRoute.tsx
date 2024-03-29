import { Routes, Route } from "react-router-dom";
import ModesList from "@components/modesList";
import Tags from "@components/modesList/tags";
import Moods from "@components/modesList/moods";
import Affixes from "@components/modesList/affixes";
import ComponentWithTitle from "@components/componentWithTitle";

export function ModesRoutes() {
  return (
    <Routes>
      <Route
        index
        element={<ComponentWithTitle title="Modes" component={<ModesList />} />}
      />
      <Route
        path="moods"
        element={<ComponentWithTitle title="Moods" component={<Moods />} />}
      />
      <Route
        path="affixes"
        element={<ComponentWithTitle title="Affixes" component={<Affixes />} />}
      />
      <Route
        path="tags"
        element={<ComponentWithTitle title="Tags" component={<Tags />} />}
      />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}
