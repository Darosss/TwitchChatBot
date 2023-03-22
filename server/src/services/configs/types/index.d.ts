import { ConfigModel } from "@models/types";
export interface ConfigUpdateData
  extends Partial<Omit<ConfigModel, "_id" | "createdAt" | "updatedAt">> {}
