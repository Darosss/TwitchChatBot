import { Routes, Route } from "react-router-dom";
import TimersList from "@components/timersList";

export function TimersRoute() {
  return (
    <Routes>
      <Route>
        <Route index element={<TimersList />} />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
