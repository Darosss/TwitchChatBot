import { ConfigModel } from "@models";

export type ConfigDefaults = Omit<ConfigModel, "_id" | "createdAt" | "updatedAt">;
