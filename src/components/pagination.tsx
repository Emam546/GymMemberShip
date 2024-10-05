import { Pagination } from "@mui/material";

export interface PaginationProps {
  page: number;
  perPage: number;
  totalCount: number;
  setPage?: (page: number) => void;
  noElems: string;
  children: React.ReactNode;
}
export type ExtendedPaginationProps = Omit<
  PaginationProps,
  "children" | "noElems"
>;
export function PaginationManager({
  page,
  perPage,
  totalCount: totalPayments,
  setPage,
  noElems,
  children,
}: PaginationProps) {
  const pageNum = Math.ceil(totalPayments / perPage);
  return (
    <div>
      {totalPayments > 0 && (
        <>
          {children}
          {pageNum > 1 && (
            <div className="tw-mt-2" dir="ltr">
              <Pagination
                onChange={(e, value) => {
                  setPage?.(value - 1);
                }}
                page={page + 1}
                count={pageNum}
              />
            </div>
          )}
        </>
      )}
      {totalPayments == 0 && <p className="tw-mb-0">{noElems}</p>}
    </div>
  );
}
