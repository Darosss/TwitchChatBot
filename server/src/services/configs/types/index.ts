import { ConfigModel } from "@models/types";
export type ConfigUpdateData = Partial<Omit<ConfigModel, "_id" | "createdAt" | "updatedAt">>;
