import { callback } from "chart.js/dist/helpers/helpers.core";

export const handleDeleteLayout = <T = unknown>(
  idToDelete: string | null,
  setIdToDelete: React.Dispatch<React.SetStateAction<string | null>>,
  callback: () => void
) => {
  if (
    idToDelete !== null &&
    confirm(`Are you sure you want to delete layout: ${idToDelete}?`)
  ) {
    callback();
  } else {
    setIdToDelete(null);
  }
};
