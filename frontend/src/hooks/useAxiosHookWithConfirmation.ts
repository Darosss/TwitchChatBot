import { AxiosCustomReturn } from "@services";
import { addSuccessNotification } from "@utils";
import { useState, useEffect } from "react";

type DefaultHookType<TParams, TReturn> = (
  params: TParams | null
) => AxiosCustomReturn<TReturn>;

interface UseAxiosWithConfirmationParams<TParams, TReturn> {
  hookToProceed: DefaultHookType<TParams, TReturn>;
  opts?: UseAxiosWithConfirmation;
}

interface UseAxiosWithConfirmation {
  showConfirmation?: boolean;
  successMessage?: string;
  confirmMessage?: string;
  onFullfiled?: () => void;
  onRejected?: () => void;
}

export const useAxiosWithConfirmation = <TParams, TReturn>({
  hookToProceed,
  opts: {
    showConfirmation = true,
    successMessage = "Successfully done",
    confirmMessage = "Are you sure to proceed?",
    onFullfiled,
    onRejected,
  } = {},
}: UseAxiosWithConfirmationParams<TParams, TReturn>) => {
  const [id, setId] = useState<TParams | null>(null);

  const { refetchData } = hookToProceed(id);

  const resetId = () => setId(null);

  useEffect(() => {
    if (!id) return;

    if (showConfirmation && !window.confirm(confirmMessage)) {
      resetId();
      return;
    }
    refetchData().then(
      () => {
        onFullfiled?.();
        addSuccessNotification(successMessage);
        resetId();
      },
      () => {
        onRejected?.();
        resetId();
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return setId;
};
