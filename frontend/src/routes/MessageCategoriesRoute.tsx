import { Routes, Route } from "react-router-dom";
import MessageCategoriesList from "@components/messageCategoriesList";

export function MessageCategoriesRoute() {
  return (
    <Routes>
      <Route>
        <Route index element={<MessageCategoriesList />} />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
