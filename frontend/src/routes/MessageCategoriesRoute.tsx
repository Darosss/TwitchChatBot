import { Routes, Route } from "react-router-dom";
import MessageCategoriesList from "@components/messageCategoriesList";
import ComponentWithTitle from "@components/componentWithTitle";

export function MessageCategoriesRoute() {
  return (
    <Routes>
      <Route
        index
        element={
          <ComponentWithTitle
            title="Message categories"
            component={<MessageCategoriesList />}
          />
        }
      />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}
