import { Error, Loading } from "@components/axiosHelper";
import CardboxWrapper from "@components/cardboxWrapper";
import Modal from "@components/modal";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import {
  fetchAffixesDefaultParams,
  useGetAffixes,
  useCreateAffix,
  useEditAffix,
} from "@services";
import { addNotification } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "@hooks/useQueryParams";
import { closeModal, resetAffixState, setEditingId } from "@redux/affixesSlice";
import { RootStore } from "@redux/store";
import FilterBarModes from "../filterBarModes";
import AffixModalData from "./AffixModalData";
import AffixesData from "./AffixesData";

export default function Affixes() {
  const queryParams = useQueryParams(fetchAffixesDefaultParams);
  const { data: affixes, isLoading, error } = useGetAffixes(queryParams);
  const dispatch = useDispatch();
  const {
    isModalOpen,
    affix: affixState,
    editingId,
  } = useSelector((state: RootStore) => state.affixes);

  const createAffixMutation = useCreateAffix();
  const updateAffixMutation = useEditAffix();

  if (error) return <Error error={error} />;
  if (isLoading || !affixes) return <Loading />;

  const handleCreateAffix = () => {
    createAffixMutation.mutate(affixState);
    dispatch(resetAffixState());
  };

  const handleUpdateAffix = () => {
    if (!editingId) {
      addNotification("Couldn't update affix", "No affix id", "warning");
      return;
    }
    updateAffixMutation.mutate({
      id: editingId,
      updatedAffix: affixState,
    });
    dispatch(resetAffixState());
    dispatch(setEditingId(""));
  };

  return (
    <>
      <PreviousPage />
      <FilterBarModes />
      <CardboxWrapper title={"Affixes list"}>
        <AffixesData data={affixes.data} />
      </CardboxWrapper>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="affixesListPageSize"
          currentPage={affixes.currentPage}
          totalCount={affixes.count}
          siblingCount={1}
        />
      </div>
      <Modal
        title={`${editingId ? "Edit" : "Create"} affix`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => (editingId ? handleUpdateAffix() : handleCreateAffix())}
        show={isModalOpen}
      >
        <AffixModalData />
      </Modal>
    </>
  );
}
