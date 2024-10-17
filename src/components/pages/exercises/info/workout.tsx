import CheckInput from "@src/components/common/checkInput";
import ErrorShower from "@src/components/common/error";
import { CreateElem } from "@src/components/InsertCommonData";
import { Elem as OrgElem } from "@src/components/InsertCommonData/Elem";
import requester from "@src/utils/axios";
import { useMutation } from "@tanstack/react-query";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
export type WorkOutElemDoc = DataBase.WithId<DataBase.Models.Workouts> & {
  exerciseId: string;

  onData: (v: DataBase.WithId<DataBase.Models.Workouts>) => void;
};
export const WorkOutOrgElem = CreateElem<DataBase.WithIdOrg<WorkOutElemDoc>>(
  ({ props: { data }, ...props }, ref) => {
    const [hide, setHide] = useState(data.hide);
    const { t } = useTranslation("workouts:info");
    const hideMutate = useMutation({
      mutationFn(state: boolean) {
        return requester.post(
          `/api/admin/exercises/${data.exerciseId}/workouts/${data.id}`,
          { hide: state }
        );
      },
      onSuccess(g, v) {
        data.onData({ ...data, hide: v });
        setHide(v);
      },
    });
    return (
      <>
        <OrgElem {...props} ref={ref}>
          <div className="tw-py-0.5 tw-flex tw-justify-between">
            <div>
              <Link href={`/workouts/${data.id}`}>{data.title}</Link>
            </div>
            <div className="tw-px-3">
              <CheckInput
                label={t("hide")}
                onChange={() => {
                  hideMutate.mutate(!hide);
                }}
                id={"hide-input"}
                checked={hide}
              />
            </div>
          </div>
        </OrgElem>
        <ErrorShower error={hideMutate.error} />
      </>
    );
  }
);
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "workouts:info": {
        NoData: "There is no Workouts so far please add some Workouts";
        hide: "Hide";
        new: "new";
        add: string;
      };
      "workouts:deleteForm": {
        title: "Delete Level";
        desc: "Once you click delete, The Level and associated data will be permanently deleted and cannot be restored.";
        accept: "Delete {{name}} Plan";
        deny: "Keep";
      };
    }
  }
}
