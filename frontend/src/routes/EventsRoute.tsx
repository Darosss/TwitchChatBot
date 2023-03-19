import { Routes, Route } from "react-router-dom";
import StreamEvents from "@components/streamEvents";
import StreamEventsLayouts from "@components/streamEvents/streamEventsLayouts";

export function EventRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<StreamEventsLayouts />} />
        <Route path=":eventsId" element={<StreamEvents />}></Route>
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
