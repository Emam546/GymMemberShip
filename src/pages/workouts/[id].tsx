import "@src/i18n/locales/plan";
import EnvVars from "@serv/declarations/major/EnvVars";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import { AddButton } from "@src/components/common/inputs/addButton";
import connect from "@serv/db/connect";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { MakeItSerializable } from "@src/utils";
import { useTranslation } from "react-i18next";
import { RedirectIfNotAdmin } from "@src/components/wrappers/redirect";
import requester from "@src/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import ErrorShower from "@src/components/common/error";
import WorkOutInfoForm from "@src/components/pages/workouts/form";
import { getWorkOut } from "@serv/routes/admin/exercises/workout/[id]";
import StepsInfoGetter from "@src/components/pages/workouts/info";

export interface Props {
  workout: DataBase.WithId<DataBase.Models.Workouts>;
}
export default function Page({ workout: initWorkOut }: Props) {
  const [workout, setWorkOut] = useState(initWorkOut);
  const { t } = useTranslation("/workouts/[id]");
  const mutate = useMutation({
    async mutationFn(data: Partial<DataBase.Models.Workouts>) {
      const res = await requester.post(
        `/api/admin/workouts/${workout._id}`,
        data
      );
      return res.data.data as DataBase.WithId<DataBase.Models.Workouts>;
    },
    onSuccess(data) {
      setWorkOut(data);
    },
  });
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <RedirectIfNotAdmin>
        <Head>
          <title>{t("title")}</title>
        </Head>
        <BigCard>
          <CardTitle>{t("workout")}</CardTitle>
          <MainCard>
            <div className="tw-mb-3">
              <WorkOutInfoForm
                defaultData={{
                  title: workout.title,
                }}
                onData={async (data) => {
                  await mutate.mutateAsync(data);
                  alert(t("messages.updated", { ns: "translation" }));
                }}
                buttonName={t("buttons.update", { ns: "translation" })}
              />
            </div>
            <StepsInfoGetter
              workouts={workout.steps}
              setSteps={function (steps): void {
                mutate.mutate({
                  steps: steps.map((val) => ({
                    _id: val._id,
                    desc: val.desc,
                    files: val.files,
                    title: val.title,
                  })),
                });
              }}
            />
            <div className="tw-mt-3">
              <AddButton
                label={t("add", { ns: "step:info" })}
                onClick={() => {
                  mutate.mutate({
                    steps: [
                      ...workout.steps,
                      {
                        desc: "",
                        files: [],
                        title: t("new", {
                          ns: "step:info",
                          index: workout.steps.length + 1,
                        }),
                      } as any,
                    ],
                  });
                }}
                disabled={mutate.isLoading}
              />
            </div>
            <ErrorShower error={mutate.error} />
          </MainCard>
        </BigCard>
      </RedirectIfNotAdmin>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  if (!ctx.params)
    return {
      notFound: true,
    };
  const workOut = await getWorkOut(ctx.params.id as string);
  return {
    props: {
      workout: MakeItSerializable({
        ...workOut.toJSON(),
        _id: workOut._id.toString(),
      }),
    },
  };
};
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/workouts/[id]": {
        title: "Plans";
        workout: "Workout";
      };
    }
  }
}
