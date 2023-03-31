import DrawerBar from "@components/drawer";
import "./style.css";
import React, { useEffect, useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import PreviousPage from "@components/previousPage";
import { addNotification } from "@utils/getNotificationValues";
import {
  getDefaultBreakpoints,
  getDefaultCols,
} from "@utils/layoutBreakpoints";

type LayoutState = [
  ReactGridLayout.Layouts,
  React.Dispatch<React.SetStateAction<ReactGridLayout.Layouts>>
];

type CurrentBreakpointState = [
  string,
  React.Dispatch<React.SetStateAction<string>>
];
export default function ReactGrid<T = unknown>(props: {
  layoutName: string;
  layoutState: LayoutState;
  toolboxState: LayoutState;
  currentBreakpointState: CurrentBreakpointState;
  componentsMap: Map<string, () => JSX.Element>;
  onEdit: () => Promise<T>;
  showDrawer?: boolean;
}) {
  const {
    layoutName,
    layoutState,
    toolboxState,
    currentBreakpointState,
    componentsMap,
    onEdit,
    showDrawer = true,
  } = props;
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
        <div
          key={item.i}
          style={{ border: !item.static ? "2px solid pink" : "" }}
        >
          {isEdit ? (
            <div
              className="grid-hide-button common-button"
              onClick={() => onPutItem(item)}
            >
              &times;
            </div>
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
        style={{ marginRight: "2rem" }}
        compactType={null}
        layouts={layout}
        onBreakpointChange={onBreakpointChange}
        breakpoints={getDefaultBreakpoints}
        preventCollision={false}
        rowHeight={30}
        cols={getDefaultCols}
        autoSize={true}
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

const ToolBox = (props: {
  items: ReactGridLayout.Layout[];
  onTakeItem: (item: ReactGridLayout.Layout) => void;
}) => {
  const { items, onTakeItem } = props;
  return (
    <>
      <div className="grid-toolbox-title">Available grid</div>
      <div className="grid-toolbox">
        <div className="grid-toolbox-items">
          {items.map((item) => (
            <ToolBoxItem key={item.i} item={item} onTakeItem={onTakeItem} />
          ))}
        </div>
      </div>
    </>
  );
};

const ToolBoxItem = (props: {
  item: ReactGridLayout.Layout;
  onTakeItem: (item: ReactGridLayout.Layout) => void;
}) => {
  const { item, onTakeItem } = props;
  return (
    <div className="grid-items-item" onClick={onTakeItem.bind(undefined, item)}>
      {item.i.replace("-", " ")}
    </div>
  );
};

function LayoutDrawerBar<T = unknown>(props: {
  layoutName: string;
  toolbox: ReactGridLayout.Layouts;
  currentBreakpoint: string;
  onTakeItem: (item: ReactGridLayout.Layout) => void;
  setLayout: React.Dispatch<React.SetStateAction<ReactGridLayout.Layouts>>;
  isEditState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  editFn: () => Promise<T>;
}) {
  const {
    layoutName,
    toolbox,
    currentBreakpoint,
    onTakeItem,
    setLayout,
    isEditState,
    editFn,
  } = props;
  const [isEdit, setIsEdit] = isEditState;
  const toggleStaticMode = () => {
    setStaticInLayout(isEdit);

    setIsEdit((prevState) => {
      return !prevState;
    });
  };

  const setStaticInLayout = (isStatic: boolean) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      [currentBreakpoint]: prevLayout[currentBreakpoint].map((item) => ({
        ...item,
        static: isStatic,
      })),
    }));
  };

  const handleOnSave = () => {
    editFn();
    addNotification(
      "Success",
      "Stream events layout edited successfully",
      "success"
    );
  };

  return (
    <DrawerBar direction={"top"} size={120} sticky={true} overlay={false}>
      <div className="grid-menu-drawer">
        <div className="grid-menu-drawer-toolbox">
          <ToolBox
            items={toolbox[currentBreakpoint] || []}
            onTakeItem={onTakeItem}
          />
        </div>
        <div>
          <div className="grid-header-drawer">
            <PreviousPage /> <span>{layoutName}</span> grid
          </div>

          <div className="grid-edit-save">
            <div> Breakpoint: {currentBreakpoint}</div>
            <div>
              Is edit:
              <span style={{ color: !isEdit ? "red" : "green" }}>
                {" " + isEdit.toString()}
              </span>
            </div>
            <div>
              <button onClick={toggleStaticMode}>Toggle Edit</button>
            </div>
            <div>
              {!isEdit ? <button onClick={handleOnSave}>Save</button> : null}
            </div>
          </div>
        </div>
      </div>
    </DrawerBar>
  );
}
