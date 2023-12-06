import { Overlay, useEditOverlayById, useGetOverlayById } from "@services";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  OverlayKeysStylesParsedType,
  initialStylesState,
  parseOverlayKeysType,
  stringifyOverlayKeysType,
} from "src/layout";

type OverlayBaseData = Pick<Overlay, "_id" | "name">;

interface OverlayDataContextType {
  isEditorState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  baseData: OverlayBaseData;
  toolboxState: [
    Overlay["toolbox"],
    React.Dispatch<React.SetStateAction<ReactGridLayout.Layouts>>
  ];
  layoutState: [
    Overlay["layout"],
    React.Dispatch<React.SetStateAction<ReactGridLayout.Layouts>>
  ];
  stylesState: [
    OverlayKeysStylesParsedType,
    React.Dispatch<React.SetStateAction<OverlayKeysStylesParsedType>>
  ];
  fetchEditOverlay: () => Promise<unknown | Overlay>;
  fetchRefreshData: () => Promise<unknown | Overlay>;
}

export const initialOverlayDataContext: OverlayDataContextType = {
  isEditorState: [false, () => {}],
  baseData: { _id: "", name: "" },
  layoutState: [{}, () => {}],
  toolboxState: [{}, () => {}],
  stylesState: [initialStylesState, () => {}],
  fetchEditOverlay: async () => {},
  fetchRefreshData: async () => {},
};

export const OverlayDataContext = React.createContext<OverlayDataContextType>(
  initialOverlayDataContext
);

export const OverlayDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { overlayId } = useParams();
  const [isEditor, setIsEditor] = useState(false);
  const { data, loading, error, refetchData } = useGetOverlayById(
    overlayId || ""
  );

  const [styles, setStyles] =
    useState<OverlayKeysStylesParsedType>(initialStylesState);
  const [baseData, setBaseData] = useState<OverlayBaseData>(
    initialOverlayDataContext.baseData
  );
  const [layoutOverlay, setLayoutOverlay] = useState<ReactGridLayout.Layouts>(
    {}
  );
  const [toolbox, setToolbox] = useState<ReactGridLayout.Layouts>({});
  const { refetchData: fetchEditOverlay } = useEditOverlayById(
    overlayId || "",
    {
      layout: layoutOverlay,
      toolbox: toolbox,
      styles: stringifyOverlayKeysType(styles),
    }
  );

  useEffect(() => {
    if (!data) return;
    const {
      data: { _id, name, layout, toolbox, styles },
    } = data;
    setBaseData({ _id, name });
    setLayoutOverlay(layout);
    setToolbox(toolbox);
    if (styles && Object.keys(styles).length > 0)
      setStyles(parseOverlayKeysType(styles));
  }, [data]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  //TODO: without (layoutOverlay && Object.keys(layoutOverlay).length <= 0) - react grid doesnt work
  if (loading || (layoutOverlay && Object.keys(layoutOverlay).length <= 0))
    return <>Loading</>;

  return (
    <OverlayDataContext.Provider
      value={{
        isEditorState: [isEditor, setIsEditor],
        baseData: baseData,
        stylesState: [styles, setStyles],
        layoutState: [layoutOverlay, setLayoutOverlay],
        toolboxState: [toolbox, setToolbox],
        fetchEditOverlay: async () => {
          await fetchEditOverlay();
          await refetchData();
        },
        fetchRefreshData: refetchData,
      }}
    >
      {children}
    </OverlayDataContext.Provider>
  );
};

export const useOverlayDataContext = (): Required<OverlayDataContextType> => {
  const overlayDataContext = useContext(OverlayDataContext);

  if (!overlayDataContext) {
    throw new Error(
      "useOverlayDataContext must be used within a OverlayDataContextProvider"
    );
  }
  return overlayDataContext as OverlayDataContextType;
};
