export interface SortQuery<T> {
  [P in keyof<T>]?: 1 | -1;
}
export interface SelectQuery<T> {
  [P in keyof<T>]?: 1 | 0;
}
