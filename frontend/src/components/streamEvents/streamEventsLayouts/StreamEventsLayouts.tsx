import React, { useState } from "react";
import { useCreateLayout, useGetWidgets, useRemoveWidgetById } from "@services";
import { Link } from "react-router-dom";
import { initialLayoutWidgets, initialToolboxWidgets } from "src/layout";
import { addSuccessNotification } from "@utils";
import CardboxWrapper from "@components/cardboxWrapper";
import {
  CardboxInput,
  CardboxItem,
} from "@components/cardboxWrapper/CardboxWrapper";
import { AxiosError, Loading } from "@components/axiosHelper";
import { useAxiosWithConfirmation } from "@hooks";

export default function StreamNotifications() {
  const { data, loading, error, refetchData } = useGetWidgets();

  const [layoutName, setLayoutName] = useState<string>("");

  const { refetchData: fetchCreateLayout } = useCreateLayout({
    name: layoutName,
    layout: initialLayoutWidgets,
    toolbox: initialToolboxWidgets,
  });

  const setWidgetIdToDelete = useAxiosWithConfirmation({
    hookToProceed: useRemoveWidgetById,
    opts: {
      onFullfiled: () => refetchData(),
    },
  });

  if (error) return <AxiosError error={error} />;
  if (!data || loading) return <Loading />;

  const { data: layouts } = data;

  const createNewLayout = () => {
    fetchCreateLayout().then(() => {
      refetchData();
      addSuccessNotification("Stream events layout created successfully");
    });
  };

  return (
    <>
      <CardboxWrapper title={"Events widgets list"}>
        <CardboxInput title="Create widgets layout">
          <input
            type="text"
            placeholder="Name"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
          ></input>
          <button
            onClick={() => createNewLayout()}
            className="common-button primary-button"
          >
            Create
          </button>
        </CardboxInput>
        {layouts.map((layout, index) => (
          <CardboxItem
            title={layout.name}
            onClickX={() => {
              setWidgetIdToDelete(layout._id);
            }}
            key={index}
          >
            <Link className="common-button primary-button" to={`${layout._id}`}>
              Show
            </Link>
            <Link
              className="common-button primary-button"
              to={`${layout._id}/editor`}
            >
              Edit
            </Link>
          </CardboxItem>
        ))}
      </CardboxWrapper>
    </>
  );
}
