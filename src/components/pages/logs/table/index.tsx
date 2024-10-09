import DeleteDialog from "@src/components/common/AlertDialog";
import Link from "next/link";
import { useState } from "react";
import { DeleteButton } from "@src/components/common/deleteButton";
import classNames from "classnames";
import { E, TH } from "@src/components/common/table";

export interface ElemProps {
  order: number;
  log: Omit<DataBase.WithId<DataBase.Models.Logs>, "userId" | "planId">;
  user?: DataBase.WithId<DataBase.Models.User>;
  plan?: DataBase.WithId<DataBase.Models.Plans>;
  admin?: DataBase.WithId<DataBase.Models.Admins>;
  trainer?: DataBase.WithId<DataBase.Models.Trainers>;
  onDelete?: () => void;
}
export type HeadKeys =
  | "order"
  | "user"
  | "plan"
  | "createdAt"
  | "delete"
  | "paymentLink"
  | "admin"
  | "trainer";
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight

  return `${day}-${month} ${hours}:${minutes} ${ampm}`;
};
function Shower({
  user,
  order,
  headKeys,
  log,
  onDelete,
  plan,
  admin,
  trainer,
}: ElemProps & { headKeys: HeadKeys[] }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("table:logs");
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
              t("td.deleted")
            )}
          </td>
        </E>
        <E val="plan" heads={headKeys}>
          <td className="tw-w-full">
            {plan ? (
              <Link href={`/plans/${plan._id}`}>{plan.name}</Link>
            ) : (
              t("td.deleted")
            )}
          </td>
        </E>
        <E val="trainer" heads={headKeys}>
          <td>
            {log.trainerId ? (
              trainer ? (
                <Link href={`/trainers/${trainer._id}`}>{trainer.name}</Link>
              ) : (
                t("td.deleted")
              )
            ) : (
              t("td.trainer.notExist")
            )}
          </td>
        </E>
        <E val="admin" heads={headKeys}>
          <td>
            {admin ? (
              <Link href={`/admins/${admin._id}`}>{admin.name}</Link>
            ) : (
              t("td.deleted")
            )}
          </td>
        </E>
        <E val="paymentLink" heads={headKeys}>
          <td>
            <Link href={`/payments/${log.paymentId}`}>Link</Link>
          </td>
        </E>
        <E val="createdAt" heads={headKeys}>
          <td
            className={classNames({
              "tw-w-full":
                !headKeys.includes("plan") && !headKeys.includes("user"),
            })}
          >
            <p className="mb-0 fw-normal">
              {formatDate(new Date(log.createdAt))}
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
          title: t("td.model.title"),
          desc: t("td.model.desc"),
          accept: t("td.model.accept"),
          deny: t("td.model.deny"),
        }}
      />
    </>
  );
}

export interface PaymentProps extends ExtendedPaginationProps {
  page: number;
  logs: ElemProps[];
  totalCount: number;
  headKeys: HeadKeys[];
  onDelete?: (elem: ElemProps) => void;
  perPage: number;
}
export function LogInfoGenerator({
  logs,
  headKeys,
  onDelete,
  ...props
}: PaymentProps) {
  const { t } = useTranslation("table:logs");
  return (
    <PaginationManager noElems={t("paragraph")} {...props}>
      <div className="table-responsive">
        <table className="table mb-0 align-middle text-nowrap">
          <thead className="text-dark fs-4">
            <tr>
              <E heads={headKeys} val="order">
                <TH>{t("th.Id")}</TH>
              </E>
              <E heads={headKeys} val="user">
                <TH>{t("th.User")}</TH>
              </E>
              <E heads={headKeys} val="plan">
                <TH>{t("th.Plan")}</TH>
              </E>
              <E heads={headKeys} val="trainer">
                <TH>{t("th.trainer")}</TH>
              </E>
              <E heads={headKeys} val="admin">
                <TH>{t("th.admin")}</TH>
              </E>
              <E heads={headKeys} val="paymentLink">
                <TH>{t("th.paymentLink")}</TH>
              </E>
              <E heads={headKeys} val="createdAt">
                <TH>{t("th.Logged At")}</TH>
              </E>
              <E heads={headKeys} val="delete">
                <TH>{t("th.Delete")}</TH>
              </E>
            </tr>
          </thead>
          <tbody>
            {logs.map((doc) => {
              return (
                <Shower
                  {...doc}
                  key={doc.log._id}
                  headKeys={headKeys}
                  onDelete={() => {
                    onDelete?.(doc);
                  }}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </PaginationManager>
  );
}
import i18n from "@src/i18n";
import { useTranslation } from "react-i18next";
import {
  ExtendedPaginationProps,
  PaginationManager,
} from "@src/components/pagination";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "table:logs": {
        th: {
          Id: "Id";
          User: "User";
          paymentLink: "paymentLink";
          "Logged At": "Logged At";
          Delete: "Delete";
          Plan: "Plan";
          admin: string;
          trainer: string;
        };
        td: {
          "trainer.notExist": string;
          deleted: "Deleted";
          model: {
            title: "Block User";
            desc: "Once you click Block, The payment will be deleted from his history";
            accept: "Delete Payment";
            deny: "Keep";
          };
        };
        paragraph: "There is no Logs so far";
      };
    }
  }
}
