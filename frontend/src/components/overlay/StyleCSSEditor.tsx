import { useState } from "react";
import Modal from "@components/modal";
import React from "react";
import { OverlayKeysStylesParsedType } from "@layout";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import { useEditOverlay } from "@services";
import { addNotification } from "@utils";
import { setStyles } from "@redux/overlaysSlice";

type OverlayKeysType =
  OverlayKeysStylesParsedType[keyof OverlayKeysStylesParsedType];

function StyleCSSEditor() {
  const [showModal, setShowModal] = useState(false);
  const {
    baseData,
    overlay: { styles },
  } = useSelector((state: RootStore) => state.overlays);

  const editOverlayMutation = useEditOverlay();

  const handleEditOverlay = () => {
    if (!baseData._id)
      return addNotification(
        "No overlay id",
        "No overlay id to delete",
        "warning"
      );

    editOverlayMutation.mutate({
      id: baseData._id,
      updatedOverlay: { styles },
    });
  };
  return (
    <div className="style-css-editor">
      <button
        className="common-button primary-button"
        onClick={() => setShowModal(true)}
      >
        Css Settings
      </button>
      <Modal
        title="Overlay widgets style css editor"
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => {
          handleEditOverlay();
          setShowModal(false);
        }}
      >
        <StyleCssEditorModalData />
      </Modal>
    </div>
  );
}

export default StyleCSSEditor;

function StyleCssEditorModalData() {
  const {
    baseData: { styles },
  } = useSelector((state: RootStore) => state.overlays);

  const [choosenOverlayEdit, setChoosenOverlayEdit] = useState<
    [keyof OverlayKeysStylesParsedType, OverlayKeysType]
  >(["overlayAchievements", styles["overlayAchievements"]]);

  return (
    <div className="style-css-editor-modal-data-wrapper">
      <div className="style-css-editor-head-menu">
        {styles
          ? Object.keys(styles).map((key, index) => {
              const keyAsserted = key as keyof OverlayKeysStylesParsedType;
              const value = styles?.[keyAsserted];
              return (
                <React.Fragment key={index}>
                  <button
                    className={`common-button ${
                      choosenOverlayEdit[0] === keyAsserted
                        ? " primary-button"
                        : "secondary-button"
                    } `}
                    onClick={() => setChoosenOverlayEdit([keyAsserted, value])}
                  >
                    {key}
                  </button>
                </React.Fragment>
              );
            })
          : null}
      </div>
      <div className="style-css-editor-editing-overlay-wrapper">
        {choosenOverlayEdit?.[1] ? (
          <CssEditInputs propertyKeyName={choosenOverlayEdit[0]} />
        ) : null}
      </div>
    </div>
  );
}

interface CssEditInputsProps {
  propertyKeyName: keyof OverlayKeysStylesParsedType;
}

type KeyDataAsObject = { [index: string]: number | string };

function CssEditInputs({ propertyKeyName }: CssEditInputsProps) {
  const {
    baseData: { styles },
  } = useSelector((state: RootStore) => state.overlays);

  const data = styles[propertyKeyName];
  const dataKeys = Object.keys(data);

  return (
    <>
      {dataKeys.map((key) => {
        const keyAsserted = key as keyof OverlayKeysType;
        const keyData = data[keyAsserted];
        if (typeof keyData === "object") {
          const keyDataAsObject: KeyDataAsObject = keyData;
          return (
            <div key={key} className="style-css-editor-edit-inputs-wrapper">
              <div>{keyAsserted} </div>
              <div>
                {Object.keys(keyData).map((keyOfNestedData) => {
                  return (
                    <NestedInputData
                      overlayDataKey={keyAsserted}
                      key={keyOfNestedData}
                      keyOfNestedData={keyOfNestedData}
                      overlayNestedData={keyDataAsObject}
                      propertyKeyName={propertyKeyName}
                    />
                  );
                })}
              </div>
            </div>
          );
        } else {
          return (
            <SimpleInputData
              key={key}
              propertyKeyName={propertyKeyName}
              overlayDataKey={keyAsserted}
              overlayPropertyData={keyData}
            />
          );
        }
      })}
    </>
  );
}
interface SimpleInputDataProps {
  overlayDataKey: keyof OverlayKeysType;
  propertyKeyName: keyof OverlayKeysStylesParsedType;
  overlayPropertyData: string | number;
}
interface NestedInputDataProps {
  overlayDataKey: keyof OverlayKeysType;
  overlayNestedData: KeyDataAsObject;
  keyOfNestedData: string;
  propertyKeyName: keyof OverlayKeysStylesParsedType;
}

function NestedInputData({
  overlayNestedData,
  keyOfNestedData,
  propertyKeyName,
  overlayDataKey,
}: NestedInputDataProps) {
  const dispatch = useDispatch();
  const overlaysStateRedux = useSelector((state: RootStore) => state.overlays);
  const {
    baseData: { styles },
  } = overlaysStateRedux;
  const data = styles[propertyKeyName];
  const keyOfNestedDataAsserted =
    keyOfNestedData as keyof typeof overlayNestedData;

  const isChangedDataString =
    typeof overlayNestedData[keyOfNestedDataAsserted] === "string";

  return (
    <div className="style-css-editor-edit-inputs-nested-data">
      <div>{keyOfNestedData} </div>
      <div>
        <input
          type={`${isChangedDataString ? "text" : "number"}`}
          value={overlayNestedData[keyOfNestedDataAsserted]}
          onChange={(e) => {
            const newData = isChangedDataString
              ? e.target.value
              : e.target.valueAsNumber;

            const newState: OverlayKeysStylesParsedType = {
              ...styles,
              [propertyKeyName]: {
                ...data,
                [overlayDataKey]: {
                  ...overlayNestedData,
                  [keyOfNestedDataAsserted]: newData,
                },
              },
            };
            dispatch(setStyles(newState));
          }}
        />
      </div>
    </div>
  );
}

function SimpleInputData({
  overlayDataKey,
  overlayPropertyData,
  propertyKeyName,
}: SimpleInputDataProps) {
  const dispatch = useDispatch();
  const {
    baseData: { styles },
  } = useSelector((state: RootStore) => state.overlays);

  const data = styles[propertyKeyName];
  return (
    <div className="style-css-editor-edit-inputs-wrapper">
      <div>{overlayDataKey}</div>
      <div>
        <input
          type={`${
            typeof overlayPropertyData === "string" ? "text" : "number"
          }`}
          value={overlayPropertyData}
          onChange={(e) => {
            const newData =
              typeof data[overlayDataKey] === "string"
                ? e.target.value
                : e.target.valueAsNumber;
            const newState = {
              ...styles,
              [propertyKeyName]: {
                ...data,
                [overlayDataKey]: newData,
              },
            };
            dispatch(setStyles(newState));
          }}
        />
      </div>
    </div>
  );
}
