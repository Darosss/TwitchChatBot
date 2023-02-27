import { Routes, Route } from "react-router-dom";
import CommandsList from "@components/commandsList";

export function CommandRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<CommandsList />} />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
