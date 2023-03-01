import { Routes, Route } from "react-router-dom";
import Users from "@components/users";
import UserProfile from "@components/userProfile";
import MessagesList from "@components/messagesList";
import RedemptionsList from "@components/redemptionsList";

export function UserRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<Users />} />
        <Route path=":userId" element={<UserProfile />} />
        <Route
          path=":userId/messages"
          element={<MessagesList messages="user" />}
        />
        <Route
          path=":userId/redemptions"
          element={<RedemptionsList redemptions="user" />}
        />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
