import { AppError } from "./ErrorHandlerUtil";

export const checkExistResource = <T>(
  resource: T | null | undefined,
  resourceName: string
) => {
  if (!resource) {
    throw new AppError(404, `${resourceName} not found`);
  }

  return resource;
};
