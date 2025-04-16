import { Routes, Route } from "react-router-dom";
import ComponentWithTitle from "@components/componentWithTitle";
import Achievements, {
  AchievementsList,
  BadgesList,
  AchievementStagesList,
  BadgesImages,
  OneAchievementStageData,
  AchievementStagesSounds,
} from "@components/achievements";

export function AchievementsRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <ComponentWithTitle
            title="Achievements menu"
            component={<Achievements />}
          />
        }
      />
      <Route
        path="list"
        element={
          <ComponentWithTitle
            title="Achievements"
            component={<AchievementsList />}
          />
        }
      />
      <Route path="stages">
        <Route
          index
          element={
            <ComponentWithTitle
              title="Achievements Stages"
              component={<AchievementStagesList />}
            />
          }
        />
        <Route
          path=":id"
          element={
            <ComponentWithTitle
              title="Achievement stage data"
              component={<OneAchievementStageData />}
            />
          }
        />
        <Route
          path="sounds"
          element={
            <ComponentWithTitle
              title="Achievement stage sounds"
              component={<AchievementStagesSounds />}
            />
          }
        />
      </Route>
      <Route path="badges">
        <Route
          index
          element={
            <ComponentWithTitle
              title="Achievement badges"
              component={<BadgesList />}
            />
          }
        />
        <Route
          path="images"
          element={
            <ComponentWithTitle
              title="Badges Images"
              component={<BadgesImages />}
            />
          }
        />
      </Route>

      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}
export {};
