import "@src/i18n/locales/plan";
import EnvVars from "@serv/declarations/major/EnvVars";
import { getAllPlans } from "@serv/routes/admin/plans";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import GoToAddButton from "@src/components/common/inputs/addButton";
import PlansInfoGetter from "@src/components/pages/plans/info";
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

export interface Props {
  plans: DataBase.WithId<DataBase.Models.Plans>[];
}
export default function Page({ plans: initPlans }: Props) {
  const [plans, setPlans] = useState(initPlans);
  const { t } = useTranslation("/plan");
  const mutate = useMutation({
    async mutationFn(data: unknown) {
      const res = await requester.post(`/api/admin/plans`, data);
      return res.data.data as DataBase.WithId<DataBase.Models.Plans>;
    },
  });
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <RedirectIfNotAdmin>
        <Head>
          <title>{t("title")}</title>
        </Head>
        <BigCard>
          <CardTitle>{t("Add Plan")}</CardTitle>
          <MainCard>
            <PlansInfoForm
              onData={async (data) => {
                const doc = await mutate.mutateAsync(data);
                setPlans([...plans, doc]);
              }}
              buttonName={t("buttons.add", { ns: "translation" })}
            />
          </MainCard>
          <CardTitle>{t("Plans")}</CardTitle>
          <MainCard>
            <PlansInfoGetter plans={plans} setPlans={setPlans} />
          </MainCard>
        </BigCard>
        <div className="tw-py-3">
          <GoToAddButton label={t("Add Plan")} href="/plans/add" />
        </div>
      </RedirectIfNotAdmin>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  const plans = await getAllPlans();
  return {
    props: {
      plans: plans.map((doc) => {
        return {
          ...MakeItSerializable(doc),
          _id: doc._id.toString(),
        };
      }),
    },
  };
};
