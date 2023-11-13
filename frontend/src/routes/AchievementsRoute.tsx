import { Routes, Route } from "react-router-dom";
import ComponentWithTitle from "@components/componentWithTitle";
import Achievements, {
  AchievementsList,
  BadgesList,
  AchievementStagesList,
  BadgesImages,
  OneAchievementStageData,
  AchievementStagesSounds,
  AchievementStageContextProvider,
} from "@components/achievements";
import { ManyAchievementStagesContextProvider } from "@components/achievements/stages";
import { BadgesContextProvider } from "@components/achievements/badges";

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
              component={
                <ManyAchievementStagesContextProvider>
                  <AchievementStagesList />
                </ManyAchievementStagesContextProvider>
              }
            />
          }
        />
        <Route
          path=":id"
          element={
            <ComponentWithTitle
              title="Achievement stage data"
              component={
                <AchievementStageContextProvider>
                  <OneAchievementStageData />
                </AchievementStageContextProvider>
              }
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
              component={
                <BadgesContextProvider>
                  <BadgesList />
                </BadgesContextProvider>
              }
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
