import { Routes, Route } from "react-router-dom";
import StreamEvents from "@components/streamEvents";
import StreamEventsLayouts from "@components/streamEvents/streamEventsLayouts";
import ComponentWithTitle from "@components/componentWithTitle";

export function EventRoutes() {
  return (
    <Routes>
      <Route>
        <Route
          index
          element={
            <ComponentWithTitle
              title="Events"
              component={<StreamEventsLayouts />}
            />
          }
        />
        <Route path=":eventsId" element={<StreamEvents editor={false} />} />
        <Route
          path=":eventsId/editor"
          element={<StreamEvents editor={true} />}
        />

        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
