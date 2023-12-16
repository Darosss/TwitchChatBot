import { AxiosCustomReturnErrorType } from "@services";
import { useEffect, useState } from "react";

interface AxiosErrorsProps {
  error: NonNullable<AxiosCustomReturnErrorType>;
}

//TODO: replenish these
enum KnownErrorCodes {
  ERROR_NETWORK = "ERR_NETWORK",
}

export default function AxiosError({
  error: { code, status, message },
}: AxiosErrorsProps) {
  const [countdown, setCountdown] = useState(15);
  const [isActiveCountdown, setIsActiveCountdown] = useState(true);

  useEffect(() => {
    if (code === KnownErrorCodes.ERROR_NETWORK && isActiveCountdown) {
      const timer = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [code, isActiveCountdown]);

  useEffect(() => {
    if (countdown === 0) {
      window.location.reload();
    }
  }, [countdown]);

  const stopRefresh = () => {
    setIsActiveCountdown(false);
  };

  return (
    <div className="axios-error-wrapper">
      {code === KnownErrorCodes.ERROR_NETWORK ? (
        <>
          We have problem with connecting to our servers.
          <br />
          {isActiveCountdown ? (
            <button
              onClick={stopRefresh}
              className="common-button primary-button"
            >
              We will automatically try again in {countdown} seconds.
              <div className="hidrr">Stop refreshing</div>
            </button>
          ) : (
            "Try again later."
          )}
        </>
      ) : (
        message
      )}
    </div>
  );
}
