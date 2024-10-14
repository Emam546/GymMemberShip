import DeleteDialog from "@src/components/common/AlertDialog";
import { formateDate } from "@src/utils";
import Link from "next/link";
import { useState } from "react";
import { DeleteButton } from "@src/components/common/deleteButton";
import { useTranslation } from "react-i18next";
import { E, TH } from "@src/components/common/table";
import {
  ExtendedPaginationProps,
  PaginationManager,
} from "@src/components/pagination";
export interface ElemProps {
  order: number;
  payment: DataBase.WithId<DataBase.Models.ProductPayments>;
  user?: DataBase.WithId<DataBase.Models.User>;
  admin?: DataBase.WithId<DataBase.Models.Admins>;
  onDelete?: () => void;
}
export type HeadKeys =
  | "order"
  | "user"
  | "paid"
  | "createdAt"
  | "delete"
  | "link"
  | "admin"
  | "remainingMoney";

function Shower({
  payment,
  user,
  order,
  headKeys,
  onDelete,
  admin,
}: ElemProps & { headKeys: HeadKeys[] }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("table:productsPayments");
  const { t: t2 } = useTranslation("productsPayments:deleteForm");
  return (
    <>
      <tr>
        <E val="order" heads={headKeys}>
          <td>
            <h6 className="mb-0 fw-semibold">{order + 1}</h6>
          </td>
        </E>
        <E val="user" heads={headKeys}>
          <td className="tw-w-full">
            {user ? (
              <Link href={`/users/${user._id}`}>{user.name}</Link>
            ) : (
              t("Deleted")
            )}
          </td>
        </E>
        <E val="admin" heads={headKeys}>
          <td className="tw-w-full">
            {admin ? (
              <Link href={`/admins/${admin._id}`}>{admin.name}</Link>
            ) : (
              t("Deleted")
            )}
          </td>
        </E>
        <E val="link" heads={headKeys}>
          <td>
            <Link href={`/products/payments/${payment._id}`}>{t("Link")}</Link>
          </td>
        </E>
        <E val="remainingMoney" heads={headKeys}>
          <td>{`${payment.remaining}EGP`}</td>
        </E>
        <E val="paid" heads={headKeys}>
          <td>{`${payment.paid}EGP`}</td>
        </E>

        <E val="createdAt" heads={headKeys}>
          <td>
            <p className="mb-0 fw-normal">
              {formateDate(new Date(payment.createdAt))}
            </p>
          </td>
        </E>
        <E val="delete" heads={headKeys}>
          <td>
            <DeleteButton onClick={() => setOpen(true)} />
          </td>
        </E>
      </tr>
      <DeleteDialog
        onAccept={async () => {
          if (onDelete) await onDelete();
          setOpen(false);
        }}
        onClose={function () {
          setOpen(false);
        }}
        open={open}
        data={{
          title: t2("model.title"),
          desc: t2("model.desc"),
          accept: t2("model.accept"),
          deny: t2("model.deny"),
        }}
      />
    </>
  );
}

export interface PaymentProps extends ExtendedPaginationProps {
  payments: ElemProps[];
  totalCount: number;
  headKeys: HeadKeys[];
  onDelete?: (elem: ElemProps) => void;
}
export function ProductsPaymentInfoGenerator({
  payments,
  headKeys,
  onDelete,
  ...props
}: PaymentProps) {
  const { t } = useTranslation("table:productsPayments");
  return (
    <PaginationManager {...props} noElems={t("There is no payments")}>
      <div className="table-responsive">
        <table className="table mb-0 align-middle text-nowrap">
          <thead className="text-dark fs-4">
            <tr>
              <E heads={headKeys} val="order">
                <TH>{t("head.Id")}</TH>
              </E>
              <E heads={headKeys} val="user">
                <TH>{t("head.User")}</TH>
              </E>
              <E heads={headKeys} val="admin">
                <TH>{t("head.admin")}</TH>
              </E>
              <E heads={headKeys} val="link">
                <TH>{t("head.Link")}</TH>
              </E>
              <E heads={headKeys} val="remainingMoney">
                <TH>{t("head.remainingMoney")}</TH>
              </E>
              <E heads={headKeys} val="paid">
                <TH>{t("head.Paid")}</TH>
              </E>
              <E heads={headKeys} val="createdAt">
                <TH>{t("head.Created At")}</TH>
              </E>
              <E heads={headKeys} val="delete">
                <TH>{t("head.Delete")}</TH>
              </E>
            </tr>
          </thead>
          <tbody>
            {payments.map((doc) => {
              return (
                <Shower
                  {...doc}
                  onDelete={() => onDelete?.(doc)}
                  key={doc.payment._id}
                  headKeys={headKeys}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </PaginationManager>
  );
}

declare global {
  namespace I18ResourcesType {
    interface Resources {
      "table:productsPayments": {
        Deleted: "Deleted";
        Link: "Link";
        head: {
          Id: "Id";
          User: "User";
          Plan: "Plan";
          Link: "Link";
          Paid: "Paid";
          startedAt: string;
          remainingMoney: string;
          "Created At": "Created At";
          "End At": "End At";
          "A/R/T": "A/R/T";
          Attend: "Attend";
          Delete: "Delete";
          admin: string;
        };
        "There is no payments": "There is no payments";
      };
      "productsPayments:deleteForm": {
        paragraph: "Once you delete the payment, it cannot be undone. This is permanent.";
        "delete.button": "Delete Payment";
        model: {
          accept: "Delete";
          title: "Are you sure you want to delete the payment?";
          desc: "Once you click delete, the payment and associated data will be permanently deleted and cannot be restored.";
          deny: "Keep The Payment";
        };
      };
    }
  }
}
