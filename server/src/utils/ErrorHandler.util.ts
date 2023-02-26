import { Error as ErrorMoongose } from "mongoose";

class AppError extends Error {
  statusCode: number;
  message: string;

  constructor(statusCode?: number, message?: string) {
    super(message);

    this.name = Error.name;
    this.statusCode = statusCode || 500;
    this.message = this.setErrorMessage(message);

    Error.captureStackTrace(this);
  }

  private setErrorMessage(msgError: string | undefined) {
    if (this.statusCode === 500 && !msgError) return "Internal Server Error";
    else if (!msgError) return "Unknown error occured. Try again later";
    else return msgError;
  }
}

const handleAppError = (err: any) => {
  if (err instanceof AppError) {
    throw new AppError(err.statusCode, err.message);
  } else if (err instanceof ErrorMoongose) {
    throw new AppError(400, err.message);
  }
  throw new AppError();
};

export { AppError, handleAppError };
