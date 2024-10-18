import { useState } from "react";
import InfoGetter, { CreateElem } from "../../InsertCommonData";
import { Elem as OrgElem } from "../../InsertCommonData/Elem";
import Link from "next/link";
import DeleteDialog from "@src/components/common/AlertDialog";
import { useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import { useTranslation } from "react-i18next";
export type T = DataBase.WithIdOrg<DataBase.Models.Plans>;

const Elem = CreateElem<T>(({ index, props: { data }, ...props }, ref) => {
  return (
    <OrgElem {...props} ref={ref}>
      <Link href={`/plans/${data.id}`}>{data.name}</Link>
    </OrgElem>
  );
});
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "plan:info": {
        "There is no plans so far please add some plans": "There is no plans so far please add some plans";
        model: {
          title: "Delete Level";
          desc: "Once you click delete, The Level and associated data will be permanently deleted and cannot be restored.";
          accept: "Delete {{name}} Plan";
          deny: "Keep";
        };
      };
    }
  }
}

export interface Props {
  plans: DataBase.WithId<DataBase.Models.Plans>[];
  setPlans: (plans: DataBase.WithId<DataBase.Models.Plans>[]) => void;
}
export default function PlansInfoGetter({ plans, setPlans }: Props) {
  const [curDel, setCurDel] = useState<T>();
  const { t } = useTranslation("plan:info");

  const mutate = useMutation({
    async mutationFn(id: string) {
      await requester.delete(`/api/admin/plans/${id}`);
    },
    onSuccess(_, id, context) {
      setPlans(plans.filter((val) => val._id != id));

      setCurDel(undefined);
    },
  });
  return (
    <>
      <>
        {plans.length > 0 && (
          <InfoGetter
            Elem={Elem}
            data={plans.map((plan) => ({ ...plan, id: plan._id }))}
            onDeleteElem={(elem) => setCurDel(elem)}
            noDragging
          />
        )}
        {plans.length == 0 && (
          <p className="tw-mb-0">
            {t("There is no plans so far please add some plans")}
          </p>
        )}
      </>

      <DeleteDialog
        onAccept={async () => {
          if (!curDel) return;
          await mutate.mutateAsync(curDel.id);
        }}
        onClose={function () {
          setCurDel(undefined);
        }}
        submitting={mutate.isLoading}
        open={curDel != undefined}
        data={{
          title: t("model.title"),
          desc: t("model.desc"),
          accept: t("model.accept", { name: curDel?.name }),
          deny: t("model.deny"),
        }}
      />
    </>
  );
}
