export const handleActionOnChangeState = (
  idToDelete: string | null,
  setIdToDelete: React.Dispatch<React.SetStateAction<string | null>>,
  callback: () => void
) => {
  if (
    idToDelete !== null &&
    window.confirm(`Are you sure you want to delete layout: ${idToDelete}?`)
  ) {
    callback();
  } else {
    setIdToDelete(null);
  }
};
