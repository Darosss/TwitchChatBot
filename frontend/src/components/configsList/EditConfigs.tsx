import { useResetConfigs, useEditConfig, useGetConfigs } from "@services";
import { Loading } from "@components/axiosHelper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setConfigState,
  closeEditMode,
  openEditMode,
} from "@redux/configsSlice";
import { RootStore } from "@redux/store";
import Error from "@components/axiosHelper/errors";

export default function EditConfigs() {
  const dispatch = useDispatch();
  const { isUpdateMode, config: configsState } = useSelector(
    (state: RootStore) => state.configs
  );
  const { data: configs, isLoading, error } = useGetConfigs();

  const resetConfigsMutation = useResetConfigs();
  const editConfigsMutation = useEditConfig();

  useEffect(() => {
    if (!configs) return;
    dispatch(setConfigState(configs.data));
  }, [configs, dispatch]);

  if (error) return <Error error={error} />;
  if (isLoading || !configs) return <Loading />;

  const handleUpdateConfigs = () => {
    editConfigsMutation.mutate({ updatedConfig: configsState });
    dispatch(closeEditMode());
  };

  const handleResetConfigs = () => {
    if (!window.confirm("Are you sure you want reset configs to defaults?"))
      return;
    resetConfigsMutation.mutate();
    dispatch(closeEditMode());
  };

  return (
    <div className="edit-configs-wrapper">
      <button
        className="common-button primary-button"
        onClick={() => {
          dispatch(isUpdateMode ? closeEditMode() : openEditMode());
        }}
      >
        Edit
      </button>
      {isUpdateMode ? (
        <>
          <button
            className="common-button danger-button"
            onClick={handleUpdateConfigs}
          >
            Save
          </button>
          <button
            className="common-button danger-button"
            onClick={handleResetConfigs}
          >
            Reset to defaults
          </button>
        </>
      ) : null}
    </div>
  );
}
