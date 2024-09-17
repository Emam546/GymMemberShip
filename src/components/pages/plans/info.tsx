import { useState } from "react";
import InfoGetter, { CreateElem } from "../../InsertCommonData";
import { Elem as OrgElem } from "../../InsertCommonData/Elem";
import Link from "next/link";
import DeleteDialog from "@src/components/common/AlertDialog";
import { useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";
export type T = DataBase.WithIdOrg<DataBase.Models.Plans>;

const Elem = CreateElem<T>(({ index, props: { data }, ...props }, ref) => {
  return (
    <OrgElem {...props} ref={ref}>
      <Link href={`/plans/${data.id}`}>{data.name}</Link>
    </OrgElem>
  );
});
export interface Props {
  plans: DataBase.WithIdOrg<DataBase.Models.Plans>[];
}
export default function PlansInfoGetter({ plans: initPlans }: Props) {
  const [curDel, setCurDel] = useState<T>();
  const [plans, setLevels] = useState(initPlans);
  const mutate = useMutation({
    async mutationFn(id: string) {
      await requester.delete(`/api/admin/plans/${id}`);
    },
    onSuccess(_, id, context) {
      setLevels(plans.filter((val) => val.id != id));
      setCurDel(undefined);
    },
  });
  return (
    <>
      <>
        {plans.length > 0 && (
          <InfoGetter
            Elem={Elem}
            data={plans}
            onDeleteElem={(elem) => setCurDel(elem)}
          />
        )}
        {plans.length == 0 && (
          <p className="tw-mb-0">
            There is no plans so far please add some plans
          </p>
        )}
      </>

      <DeleteDialog
        onAccept={async () => {
          await mutate.mutateAsync(curDel!.id);
        }}
        onClose={function () {
          setCurDel(undefined);
        }}
        submitting={mutate.isLoading}
        open={curDel != undefined}
        data={{
          title: `Delete Level`,
          desc: `Once you click delete, The Level and associated data will be permanently deleted and cannot be restored.`,
          accept: `Delete ${curDel?.name} Plan`,
          deny: "Keep",
        }}
      />
    </>
  );
}
