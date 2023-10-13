import { ConfigModel } from "@models";
export type ConfigUpdateData = Partial<Omit<ConfigModel, "_id" | "createdAt" | "updatedAt">>;
