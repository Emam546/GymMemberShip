import DeleteDialog from "@src/components/common/AlertDialog";
import { formateDate } from "@src/utils";
import Link from "next/link";
import { ComponentProps, useState } from "react";
import { DeleteButton } from "@src/components/common/deleteButton";
import { remainingDays } from "@src/utils/payment";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { E, TH } from "@src/components/common/table";
import {
  ExtendedPaginationProps,
  PaginationManager,
} from "@src/components/pagination";
import { useAttend } from "@src/hooks/subscriptions";
export interface ElemProps {
  order: number;
  subscription: Omit<
    DataBase.WithId<DataBase.Models.Subscriptions>,
    "userId" | "planId" | "adminId" | "trainerId"
  >;
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
  | "paid"
  | "createdAt"
  | "delete"
  | "log"
  | "endAt"
  | "addLog"
  | "link"
  | "admin"
  | "remainingMoney"
  | "startedAt";

function ShowLogValues({ payment }: { payment: ElemProps["subscription"] }) {
  const TotalDays = payment.plan.num;
  const rDays = remainingDays(payment);
  return (
    <div>
      <p className="tw-text-center tw-mb-0">
        {payment.logsCount}/{rDays}/{TotalDays}
      </p>
    </div>
  );
}

function AddLog({
  className,
  payment,
  onAdded,
  ...props
}: ComponentProps<"button"> & {
  payment: ElemProps["subscription"];
  onAdded: () => void;
}) {
  const mutate = useAttend({
    onSuccess(data) {
      if (!data) return;
      onAdded();
    },
  });
  return (
    <button
      disabled={mutate.isLoading}
      onClick={() => mutate.mutate({ paymentId: payment._id })}
      {...props}
      className={classNames(
        "tw-border-none focus-within:tw-outline-none tw-bg-blue-500 tw-text-blue-100 tw-w-5 tw-h-5 tw-flex tw-items-center tw-justify-center tw-rounded tw-leading-[0]",
        className
      )}
    >
      <FontAwesomeIcon fontSize="1rem" icon={faPlus} />
    </button>
  );
}

function Shower({
  subscription: initPayment,
  user,
  order,
  headKeys,
  onDelete,
  plan,
  admin,
}: ElemProps & { headKeys: HeadKeys[] }) {
  const [open, setOpen] = useState(false);
  const [payment, setPayment] = useState(initPayment);
  const endAt = new Date(
    new Date(payment.createdAt).getTime() +
      payment.plan.num * 1000 * 24 * 60 * 60
  );
  const { t } = useTranslation("table:payments");
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
        <E val="plan" heads={headKeys}>
          <td className="tw-w-full">
            {plan ? (
              <Link href={`/plans/${plan._id}`}>{plan.name}</Link>
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
            <Link href={`/subscriptions/${payment._id}`}>{t("Link")}</Link>
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
        <E val="startedAt" heads={headKeys}>
          <td>
            <p className="mb-0 fw-normal">
              {formateDate(new Date(payment.startAt || payment.createdAt))}
            </p>
          </td>
        </E>
        <E val="endAt" heads={headKeys}>
          <td>
            <p className="mb-0 fw-normal">{formateDate(endAt)}</p>
          </td>
        </E>
        <E val="log" heads={headKeys}>
          <td>
            <ShowLogValues payment={payment} />
          </td>
        </E>
        <E val="addLog" heads={headKeys}>
          <td>
            <div className="tw-flex tw-justify-center">
              <AddLog
                onAdded={() =>
                  setPayment((pre) => ({
                    ...pre,
                    logsCount: pre.logsCount + 1,
                  }))
                }
                payment={payment}
              />
            </div>
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
          title: `Delete Payment`,
          desc: `Once you click Block, The payment will be deleted from his history`,
          accept: `Delete Payment`,
          deny: "Keep",
        }}
      />
    </>
  );
}

export interface PaymentProps extends ExtendedPaginationProps {
  subscriptions: ElemProps[];
  totalCount: number;
  headKeys: HeadKeys[];
  onDelete?: (elem: ElemProps) => void;
}
export function PaymentInfoGenerator({
  subscriptions: payments,
  headKeys,
  onDelete,
  ...props
}: PaymentProps) {
  const { t } = useTranslation("table:payments");
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
              <E heads={headKeys} val="plan">
                <TH>{t("head.Plan")}</TH>
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
              <E heads={headKeys} val="startedAt">
                <TH>{t("head.startedAt")}</TH>
              </E>
              <E heads={headKeys} val="endAt">
                <TH>{t("head.End At")}</TH>
              </E>
              <E heads={headKeys} val="log">
                <TH className="tw-text-center">{t("head.A/R/T")}</TH>
              </E>
              <E heads={headKeys} val="addLog">
                <TH>{t("head.Attend")}</TH>
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
                  key={doc.subscription._id}
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
      "table:payments": {
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
    }
  }
}
