import { useState } from "react";
import { useOverlayDataContext } from "./OverlayDataContext";
import Modal from "@components/modal";
import React from "react";
import { OverlayKeysStylesParsedType } from "src/layout/initialLayoutOverlays";
import { useSocketContext } from "@socket";

type OverlayKeysType =
  OverlayKeysStylesParsedType[keyof OverlayKeysStylesParsedType];

function StyleCSSEditor() {
  const [showModal, setShowModal] = useState(false);
  const { baseData, fetchEditOverlay } = useOverlayDataContext();
  const {
    emits: { refreshOverlayLayout },
  } = useSocketContext();
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
          setShowModal(false);
          fetchEditOverlay().then(() => {
            refreshOverlayLayout(baseData._id);
          });
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
    stylesState: [styles],
  } = useOverlayDataContext();

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
    stylesState: [styles],
  } = useOverlayDataContext();

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
  const {
    stylesState: [styles, setStyles],
  } = useOverlayDataContext();
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
          onChange={(e) =>
            setStyles((prevState) => {
              const newData = isChangedDataString
                ? e.target.value
                : e.target.valueAsNumber;

              const newState: OverlayKeysStylesParsedType = {
                ...prevState,
                [propertyKeyName]: {
                  ...data,
                  [overlayDataKey]: {
                    ...overlayNestedData,
                    [keyOfNestedDataAsserted]: newData,
                  },
                },
              };

              return newState;
            })
          }
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
  const {
    stylesState: [styles, setStyles],
  } = useOverlayDataContext();

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
          onChange={(e) =>
            setStyles((prevState) => {
              const newData =
                typeof data[overlayDataKey] === "string"
                  ? e.target.value
                  : e.target.valueAsNumber;
              const newState = {
                ...prevState,
                [propertyKeyName]: {
                  ...data,
                  [overlayDataKey]: newData,
                },
              };
              return newState;
            })
          }
        />
      </div>
    </div>
  );
}
