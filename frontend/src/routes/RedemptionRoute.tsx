import { Routes, Route } from "react-router-dom";
import RedemptionsList from "@components/redemptionsList";
import ComponentWithTitle from "@components/componentWithTitle";
export function RedemptionRoutes() {
  return (
    <Routes>
      <Route>
        <Route
          index
          element={
            <ComponentWithTitle
              title="Redemptions"
              component={<RedemptionsList redemptions="all" />}
            />
          }
        />
        <Route
          path=":userId"
          element={
            <ComponentWithTitle
              title="User redemptions"
              component={<RedemptionsList redemptions="user" />}
            />
          }
        />
        <Route
          path="stream-session/:sessionId"
          element={
            <ComponentWithTitle
              title="Stream session redemptions"
              component={<RedemptionsList redemptions="session" />}
            />
          }
        />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
