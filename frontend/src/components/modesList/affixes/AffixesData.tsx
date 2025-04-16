import { CardboxItem } from "@components/cardboxWrapper/CardboxWrapper";
import { HandleShowModalParams } from "@components/types";
import {
  openModal,
  resetAffixState,
  setAffixState,
  setEditingId,
} from "@redux/affixesSlice";
import { Affix, useDeleteAffix } from "@services";
import { useDispatch } from "react-redux";

interface AffixesDataProps {
  data: Affix[];
}

export default function AffixesData({ data }: AffixesDataProps) {
  const dispatch = useDispatch();
  const deleteAffixMutation = useDeleteAffix();
  const handleDeleteAffix = (id: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the affix with ID: ${id}?`
      )
    )
      return;
    deleteAffixMutation.mutate(id);
  };

  const handleShowModal = (params: HandleShowModalParams<Affix>) => {
    dispatch(openModal());
    if (params?.type === "create") {
      dispatch(resetAffixState());

      return;
    }
    const { type, data } = params;
    if (type === "edit") dispatch(setEditingId(data._id));
    dispatch(setAffixState(data));
  };
  return (
    <>
      <CardboxItem title="Create affix">
        <button
          onClick={() => handleShowModal({ type: "create" })}
          className="common-button primary-button"
        >
          Create
        </button>
      </CardboxItem>
      {data.map((affix, index) => {
        return (
          <CardboxItem
            title={affix.name}
            onClickX={() => {
              handleDeleteAffix(affix._id);
            }}
            key={index}
          >
            <button
              onClick={() => handleShowModal({ type: "edit", data: affix })}
              className="common-button primary-button edit-mode-button"
            >
              Edit
            </button>
          </CardboxItem>
        );
      })}
    </>
  );
}
