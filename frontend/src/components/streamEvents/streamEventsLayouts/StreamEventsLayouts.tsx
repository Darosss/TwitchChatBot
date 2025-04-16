import { useState } from "react";
import { useCreateWidget, useDeleteWidget, useGetWidgets } from "@services";
import { Link } from "react-router-dom";
import { initialLayoutWidgets, initialToolboxWidgets } from "@layout";
import { addNotification } from "@utils";
import CardboxWrapper from "@components/cardboxWrapper";
import {
  CardboxInput,
  CardboxItem,
} from "@components/cardboxWrapper/CardboxWrapper";
import { Error, Loading } from "@components/axiosHelper";
import { useQueryParams } from "@hooks/useQueryParams";
import { fetchWidgetsDefaultParams } from "@services";

export default function StreamNotifications() {
  const queryParams = useQueryParams(fetchWidgetsDefaultParams);
  const { data, isLoading, error } = useGetWidgets(queryParams);

  const [layoutName, setLayoutName] = useState<string>("");

  const createWidgetMutation = useCreateWidget();
  const deleteWidgetMutation = useDeleteWidget();

  if (error) return <Error error={error} />;
  if (!data || isLoading) return <Loading />;

  const { data: layouts } = data;

  const handleCreateWidget = () => {
    if (!layoutName)
      return addNotification(
        "Provide name",
        "You need to provide layout name",
        "danger"
      );
    createWidgetMutation.mutate({
      name: layoutName,
      layout: initialLayoutWidgets,
      toolbox: initialToolboxWidgets,
    });
  };

  const handleDeleteWidget = (id: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the widget with ID: ${id}?`
      )
    )
      return;
    deleteWidgetMutation.mutate(id);
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
            onClick={handleCreateWidget}
            className="common-button primary-button"
          >
            Create
          </button>
        </CardboxInput>
        {layouts.map((layout, index) => (
          <CardboxItem
            title={layout.name}
            onClickX={() => {
              handleDeleteWidget(layout._id);
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
