export type CommonSliceTypeFields<T extends string, T2> = {
  [K in T]: T2;
} & {
  isModalOpen: boolean;
  editingId?: string;
};
