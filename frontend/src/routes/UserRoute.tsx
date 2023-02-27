import { Routes, Route } from "react-router-dom";
import Users from "@components/users";
import UserProfile from "@components/userProfile";

export function UserRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<Users />} />
        <Route path=":userId" element={<UserProfile />} />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
