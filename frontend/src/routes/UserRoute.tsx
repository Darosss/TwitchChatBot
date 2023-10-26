import { Routes, Route } from "react-router-dom";
import Users from "@components/users";
import UserProfile from "@components/userProfile";
import MessagesList from "@components/messagesList";
import RedemptionsList from "@components/redemptionsList";
import ComponentWithTitle from "@components/componentWithTitle";

export function UserRoutes() {
  return (
    <Routes>
      <Route
        index
        element={<ComponentWithTitle title="Users" component={<Users />} />}
      />
      <Route path=":userId" element={<UserProfile />} />
      <Route
        path=":userId/messages"
        element={
          <ComponentWithTitle
            title="User messages"
            component={<MessagesList messages="user" />}
          />
        }
      />
      <Route
        path=":userId/redemptions"
        element={
          <ComponentWithTitle
            title="User redemptions"
            component={<RedemptionsList redemptions="user" />}
          />
        }
      />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}
