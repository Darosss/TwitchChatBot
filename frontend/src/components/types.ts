export type HandleShowModalParams<T> =
  | { type: "create" }
  | {
      type: "edit" | "duplicate";
      data: T;
    };
