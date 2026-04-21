export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
};

export type SmartPaginationProps = {
    currentPage:number;
    lastPage:number; 
    onPageChange: (page: number) => void;
}