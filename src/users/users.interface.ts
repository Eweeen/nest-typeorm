export interface Paginated<TModel> {
  result: TModel[];
  nbPages: number;
}
