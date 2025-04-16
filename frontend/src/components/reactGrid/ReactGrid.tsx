import DrawerBar from "@components/drawer";
import React, { useEffect, useMemo, useState } from "react";
import ReactGridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import PreviousPage from "@components/previousPage";
import { getDefaultBreakpoints, getDefaultCols } from "@utils";

type CurrentBreakpointState = [
  string,
  React.Dispatch<React.SetStateAction<string>>
];

interface ReactGridProps {
  layoutName: string;
  layoutState: ReactGridLayout.Layouts;
  toolboxState: ReactGridLayout.Layouts;
  currentBreakpointState: CurrentBreakpointState;
  componentsMap: Map<string, () => JSX.Element>;
  onEdit: (
    layout: ReactGridLayout.Layouts,
    toolbox: ReactGridLayout.Layouts
  ) => void;
  showDrawer?: boolean;
}

export default function ReactGrid({
  layoutName,
  layoutState,
  toolboxState,
  currentBreakpointState,
  componentsMap,
  onEdit,
  showDrawer = true,
}: ReactGridProps) {
  const [layout, setLayout] = useState(layoutState);
  const [toolbox, setToolbox] = useState(toolboxState);
  const [currentBreakpoint, setCurrentBreakpoint] = currentBreakpointState;
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setLayout({ ...layoutState });
  }, [layoutState]);

  useEffect(() => {
    setToolbox({ ...toolboxState });
  }, [toolboxState]);

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
          editFn={() => onEdit(layout, toolbox)}
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

const ToolBox = (props: {
  items: ReactGridLayout.Layout[];
  onTakeItem: (item: ReactGridLayout.Layout) => void;
}) => {
  const { items, onTakeItem } = props;
  return (
    <>
      <div className="grid-toolbox-title">Available grid items</div>
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

function LayoutDrawerBar(props: {
  layoutName: string;
  toolbox: ReactGridLayout.Layouts;
  currentBreakpoint: string;
  onTakeItem: (item: ReactGridLayout.Layout) => void;
  setLayout: React.Dispatch<React.SetStateAction<ReactGridLayout.Layouts>>;
  isEditState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  editFn: () => void;
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
  const toggleEditMode = () => {
    setEditableInLayout(isEdit);

    setIsEdit((prevState) => {
      return !prevState;
    });
  };

  const setEditableInLayout = (editable: boolean) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      [currentBreakpoint]: prevLayout[currentBreakpoint].map((item) => ({
        ...item,
        isDraggable: !editable,
        isResizable: !editable,
      })),
    }));
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
              <button
                className={`common-button ${
                  isEdit ? "danger-button" : "primary-button"
                }`}
                onClick={toggleEditMode}
              >
                Toggle Edit
              </button>
            </div>
            <div>
              {!isEdit ? (
                <button
                  className="common-button primary-button"
                  onClick={editFn}
                >
                  Save
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </DrawerBar>
  );
}
