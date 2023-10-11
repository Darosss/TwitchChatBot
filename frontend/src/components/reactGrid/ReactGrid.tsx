import React, { useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import {
  getDefaultBreakpoints,
  getDefaultCols,
} from "@utils/layoutBreakpoints";
import LayoutDrawerBar from "./LayoutDrawerBar";

type LayoutState = [
  ReactGridLayout.Layouts,
  React.Dispatch<React.SetStateAction<ReactGridLayout.Layouts>>
];

type CurrentBreakpointState = [
  string,
  React.Dispatch<React.SetStateAction<string>>
];

interface ReactGridProps<T> {
  layoutName: string;
  layoutState: LayoutState;
  toolboxState: LayoutState;
  currentBreakpointState: CurrentBreakpointState;
  componentsMap: Map<string, () => JSX.Element>;
  onEdit: () => Promise<T>;
  showDrawer?: boolean;
}

export default function ReactGrid<T = unknown>({
  layoutName,
  layoutState,
  toolboxState,
  currentBreakpointState,
  componentsMap,
  onEdit,
  showDrawer = true,
}: ReactGridProps<T>) {
  const [layout, setLayout] = layoutState;
  const [toolbox, setToolbox] = toolboxState;
  const [currentBreakpoint, setCurrentBreakpoint] = currentBreakpointState;

  const [isEdit, setIsEdit] = useState(false);

  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );

  const onLayoutChange = (currLayout: ReactGridLayout.Layout[]) => {
    setLayout((prevLayouts) => ({
      ...prevLayouts,
      [currentBreakpoint]: currLayout,
    }));
  };

  const onBreakpointChange = (breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      [breakpoint]:
        prevToolbox[breakpoint] || [prevToolbox.currentBreakpoint] || [],
    }));
  };

  const onPutItem = (item: ReactGridLayout.Layout) => {
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      [currentBreakpoint]: [...(prevToolbox[currentBreakpoint] || []), item],
    }));

    setLayout((prevLayout) => ({
      ...prevLayout,
      [currentBreakpoint]: prevLayout[currentBreakpoint].filter(
        ({ i }) => i !== item.i
      ),
    }));
  };

  const onTakeItem = (item: ReactGridLayout.Layout) => {
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      [currentBreakpoint]: prevToolbox[currentBreakpoint].filter(
        ({ i }) => i !== item.i
      ),
    }));

    setLayout((prevLayout) => ({
      ...prevLayout,
      [currentBreakpoint]: [...prevLayout[currentBreakpoint], item],
    }));
  };

  const generateLayoutItems = () => {
    return layout[currentBreakpoint].map((item) => {
      const MapComponent = componentsMap.get(item.i);
      if (!MapComponent) return null;
      return (
        <div key={item.i} className={`${isEdit ? "react-grid-item-edit" : ""}`}>
          {isEdit ? (
            <>
              <div
                className="grid-hide-button common-button"
                onClick={() => onPutItem(item)}
              >
                &times;
              </div>

              <div className="grid-name-div"> {item.i} </div>
            </>
          ) : null}
          <span>
            <MapComponent />
          </span>
        </div>
      );
    });
  };

  return (
    <div>
      {showDrawer ? (
        <LayoutDrawerBar
          layoutName={layoutName}
          toolbox={toolbox}
          currentBreakpoint={currentBreakpoint}
          onTakeItem={onTakeItem}
          setLayout={setLayout}
          isEditState={[isEdit, setIsEdit]}
          editFn={onEdit}
        />
      ) : null}

      <ResponsiveReactGridLayout
        onLayoutChange={onLayoutChange}
        style={{ marginRight: "1rem" }}
        compactType={null}
        layouts={layout}
        onBreakpointChange={onBreakpointChange}
        breakpoints={getDefaultBreakpoints}
        rowHeight={5}
        cols={getDefaultCols}
        preventCollision={true}
        allowOverlap={true}
        containerPadding={{
          lg: [12, 12],
          md: [8, 8],
          sm: [6, 6],
          xs: [4, 4],
          xxs: [2, 2],
        }}
      >
        {generateLayoutItems()}
      </ResponsiveReactGridLayout>
    </div>
  );
}
