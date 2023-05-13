import React, { useEffect, useState } from "react";
import {
  useCreateLayout,
  useGetWidgets,
  useRemoveWidgetById,
} from "@services/WidgetsService";
import { Link } from "react-router-dom";
import {
  initialLayoutWidgets,
  initialToolboxWidgets,
} from "src/layout/initialLayoutWidgets";
import { handleActionOnChangeState } from "@utils/handleDeleteApi";
import { addNotification } from "@utils/getNotificationValues";
import CardboxWrapper from "@components/cardboxWrapper";
import {
  CardboxInput,
  CardboxItem,
} from "@components/cardboxWrapper/CardboxWrapper";

export default function StreamNotifications() {
  const { data, loading, error, refetchData } = useGetWidgets();

  const [layoutName, setLayoutName] = useState<string>("");

  const [layoutIdToDelete, setLayoutIdToDelete] = useState<string | null>(null);

  const { refetchData: fetchCreateLayout } = useCreateLayout({
    name: layoutName,
    layout: initialLayoutWidgets,
    toolbox: initialToolboxWidgets,
  });

  const { refetchData: fetchDeleteLayout } = useRemoveWidgetById(
    layoutIdToDelete ? layoutIdToDelete : ""
  );

  useEffect(() => {
    handleActionOnChangeState(layoutIdToDelete, setLayoutIdToDelete, () => {
      fetchDeleteLayout().then(() => {
        refetchData();

        addNotification(
          "Deleted",
          "Stream events layout removed successfully",
          "danger"
        );
        setLayoutIdToDelete(null);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutIdToDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  const { data: layouts } = data;

  const createNewLayout = () => {
    fetchCreateLayout().then(() => {
      refetchData();
      addNotification(
        "Success",
        "Stream events layout created successfully",
        "success"
      );
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
        {layouts.map((layout, index) => {
          return (
            <CardboxItem
              title={layout.name}
              onClickX={() => {
                setLayoutIdToDelete(layout._id);
              }}
              key={index}
            >
              <Link
                className="common-button primary-button"
                to={`${layout._id}`}
              >
                Show
              </Link>
              <Link
                className="common-button primary-button"
                to={`${layout._id}/editor`}
              >
                Edit
              </Link>
            </CardboxItem>
          );
        })}
      </CardboxWrapper>
    </>
  );
}
