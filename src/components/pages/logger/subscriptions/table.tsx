import { E } from "@src/components/common/table";
import { PaginationManager } from "@src/components/pagination";
import { formateDate } from "@src/utils";
import { remainingDays } from "@src/utils/payment";
import Link from "next/link";

interface ElemProps {
  order: number;
  subscription: DataBase.Populate.Model<
    DataBase.WithId<DataBase.Models.Subscriptions>,
    "planId" | "adminId" | "trainerId"
  >;
  headKeys: HeadKeys[];
  selected: boolean;
  onClick: () => void;
}
function Row({ headKeys, order, subscription, onClick, selected }: ElemProps) {
  const startAt = new Date(subscription.startAt || subscription.createdAt);
  const endAt = new Date(
    startAt.getTime() + subscription.plan.num * 24 * 60 * 60 * 1000
  );
  return (
    <tr
      onClick={() => {
        onClick();
      }}
      data-selected={selected}
      data-active={remainingDays(subscription) > 0}
      data-remaining={subscription.remaining > 0}
    >
      <E heads={headKeys} val="id">
        <td>{order + 1}</td>
      </E>
      <E heads={headKeys} val="plan">
        <td>
          <Link href={`/subscriptions/${subscription._id}`}>
            {subscription.planId?.name}
          </Link>
        </td>
      </E>
      <E heads={headKeys} val="link">
        <td>
          <Link href={`/subscriptions/${subscription._id}`}>Link</Link>
        </td>
      </E>
      <E heads={headKeys} val="remainingDays">
        <td>{remainingDays(subscription)}</td>
      </E>
      <E heads={headKeys} val="startAt">
        <td>{formateDate(startAt)}EGP</td>
      </E>
      <E heads={headKeys} val="endAt">
        <td>{formateDate(endAt)}</td>
      </E>
    </tr>
  );
}
export type HeadKeys =
  | "id"
  | "plan"
  | "link"
  | "startAt"
  | "endAt"
  | "remainingMoney"
  | "remainingDays"
  | "delete";
export interface Props {
  elems: Pick<ElemProps, "subscription" | "order">[];
  totalCount: number;
  onDelete?: (elem: ElemProps) => void;
  onSetPage: (page: number) => void;
  onSelect: (payment: Pick<ElemProps, "subscription" | "order">) => void;
  page: number;
  selected?: string;
  headKeys: HeadKeys[];
  perPage: number;
}
export default function UserPaymentsTable({
  onSetPage,
  page,
  elems,
  onSelect,
  totalCount,
  headKeys,
  selected,
  perPage,
}: Props) {
  return (
    <PaginationManager
      page={page}
      perPage={perPage}
      totalCount={totalCount}
      setPage={onSetPage}
      noElems={""}
    >
      <table className="table-payments tw-w-full">
        <thead>
          <tr>
            <E heads={headKeys} val="id">
              <th>Id</th>
            </E>
            <E heads={headKeys} val="plan">
              <th className="tw-w-full">Plan</th>
            </E>
            <E heads={headKeys} val="link">
              <th>Link</th>
            </E>
            <E heads={headKeys} val="remainingMoney">
              <th>R Money</th>
            </E>
            <E heads={headKeys} val="remainingDays">
              <th>R Days</th>
            </E>
            <E heads={headKeys} val="startAt">
              <th>Start At</th>
            </E>
            <E heads={headKeys} val="endAt">
              <th>End At</th>
            </E>
            <E heads={headKeys} val="delete">
              <th>Delete</th>
            </E>
          </tr>
        </thead>
        <tbody>
          {elems.map((val) => {
            return (
              <Row
                key={val.subscription._id}
                {...val}
                headKeys={headKeys}
                onClick={() => onSelect(val)}
                selected={val.subscription._id == selected}
              />
            );
          })}
        </tbody>
      </table>
    </PaginationManager>
  );
}
