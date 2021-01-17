export type exclude_t =
  | ((dir: string, name: string) => void | boolean)
  | RegExp;
