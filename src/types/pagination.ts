export interface ContentWithPagination<T> {
  content: T;
  page: number;
  size: number;
  pageSkipSize: number;
  count: number;
  fastForwardPage: number;
  fastBackwardPage: number;
  isFirst: boolean;
  isLast: boolean;
}
