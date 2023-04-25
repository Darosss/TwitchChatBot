import { MessageCategoryCreateData } from "@services/MessageCategoriesService";

type DispatchAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_MESSAGES"; payload: string[] }
  | { type: "SET_TAG"; payload: string }
  | { type: "SET_MOOD"; payload: string }
  | { type: "SET_ENABLED"; payload?: boolean }
  // | { type: "SET_DESC"; payload: string }
  | { type: "SET_STATE"; payload: MessageCategoryCreateData };
