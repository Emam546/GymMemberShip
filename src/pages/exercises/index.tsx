import "@src/i18n/locales/plan";
import EnvVars from "@serv/declarations/major/EnvVars";
import { getAllPlans } from "@serv/routes/admin/plans";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import GoToAddButton, {
  AddButton,
} from "@src/components/common/inputs/addButton";
import ExercisesInfoGetter from "@src/components/pages/exercises/info";
import connect from "@serv/db/connect";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { MakeItSerializable } from "@src/utils";
import { useTranslation } from "react-i18next";
import { RedirectIfNotAdmin } from "@src/components/wrappers/redirect";
import requester from "@src/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import PlansInfoForm from "@src/components/pages/plans/form";
import { getAllExercises } from "@serv/routes/admin/exercises";
import ErrorShower from "@src/components/common/error";

export interface Props {
  exercises: DataBase.Populate.ModelArray<
    DataBase.WithId<DataBase.Models.Exercises>,
    "workoutIds"
  >[];
}
export default function Page({ exercises: initPlans }: Props) {
  const [exercises, setExercises] = useState(initPlans);
  const { t } = useTranslation("/exercises");
  const mutate = useMutation({
    async mutationFn() {
      const data = {
        title: t("new", { ns: "exercises:info" }),
        order: Date.now(),
      };
      const res = await requester.post(`/api/admin/exercises`, data);

      return res.data.data as DataBase.Populate.ModelArray<
        DataBase.WithId<DataBase.Models.Exercises>,
        "workoutIds"
      >;
    },
    onSuccess(data) {
      setExercises((pre) => [...pre, data]);
    },
  });
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <RedirectIfNotAdmin>
        <Head>
          <title>{t("title")}</title>
        </Head>
        <BigCard>
          <CardTitle>{t("exercises")}</CardTitle>
          <MainCard>
            <ExercisesInfoGetter
              exercises={exercises}
              setExercises={setExercises}
            />
            <div className="tw-my-3">
              <AddButton
                onClick={() => mutate.mutate()}
                disabled={mutate.isLoading}
                label={t("button.add")}
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
  const plans = (await getAllExercises()) as unknown as Props["exercises"];
  return {
    props: {
      exercises: plans.map((doc) => {
        return {
          ...MakeItSerializable(doc),
          _id: doc._id.toString(),
        };
      }),
    },
  };
};
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/exercises": {
        title: "Plans";
        exercises: "Plans";
        "button.add": "Add Plan";
      };
    }
  }
}
