import { Routes, Route } from "react-router-dom";
import RedemptionsList from "@components/redemptionsList";
export function RedemptionRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<RedemptionsList redemptions="all" />} />
        <Route
          path=":userId"
          element={<RedemptionsList redemptions="user" />}
        />
        <Route
          path="stream-session/:sessionId"
          element={<RedemptionsList redemptions="session" />}
        />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
