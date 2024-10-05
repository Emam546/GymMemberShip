import { Pagination } from "@mui/material";
import { useTranslation } from "react-i18next";

export interface PaymentProps {
  page: number;
  perPage: number;
  totalCount: number;
  setPage: (page: number) => any;
  noElems: string;
  children: React.ReactNode;
}
export function PaginationManager({
  page,
  perPage,
  totalCount: totalPayments,
  setPage,
  noElems,
  children,
}: PaymentProps) {
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
                  setPage(value - 1);
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
