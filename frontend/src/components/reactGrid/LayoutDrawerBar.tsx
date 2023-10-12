import DrawerBar from "@components/drawer";
import PreviousPage from "@components/previousPage";
import { addNotification } from "@utils";

interface LayoutDrawerBarProps<T> {
  layoutName: string;
  toolbox: ReactGridLayout.Layouts;
  currentBreakpoint: string;
  onTakeItem: (item: ReactGridLayout.Layout) => void;
  setLayout: React.Dispatch<React.SetStateAction<ReactGridLayout.Layouts>>;
  isEditState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  editFn: () => Promise<T>;
}

interface ToolBoxProps {
  items: ReactGridLayout.Layout[];
  onTakeItem: (item: ReactGridLayout.Layout) => void;
}

interface ToolBoxItemProps {
  item: ReactGridLayout.Layout;
  onTakeItem: (item: ReactGridLayout.Layout) => void;
}

export default function LayoutDrawerBar<T = unknown>({
  layoutName,
  toolbox,
  currentBreakpoint,
  onTakeItem,
  setLayout,
  isEditState,
  editFn,
}: LayoutDrawerBarProps<T>) {
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
                  onClick={handleOnSave}
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

const ToolBox = ({ items, onTakeItem }: ToolBoxProps) => {
  return (
    <>
      <div className="grid-toolbox-title">Available grid items</div>
      <div className="grid-toolbox">
        <div className="grid-toolbox-items">
          {items.map((item, index) => (
            <ToolBoxItem key={index} item={item} onTakeItem={onTakeItem} />
          ))}
        </div>
      </div>
    </>
  );
};

const ToolBoxItem = ({ item, onTakeItem }: ToolBoxItemProps) => {
  return (
    <div className="grid-items-item" onClick={onTakeItem.bind(undefined, item)}>
      {item.i.replace("-", " ")}
    </div>
  );
};
