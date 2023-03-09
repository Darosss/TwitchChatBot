import { IConfig } from "@models/types";
export interface ConfigUpdateData
  extends Partial<Omit<IConfig, "_id" | "createdAt" | "updatedAt">> {}
