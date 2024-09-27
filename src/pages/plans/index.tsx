import "@src/i18n/locales/plan";
import EnvVars from "@serv/declarations/major/EnvVars";
import { getAllPlans } from "@serv/routes/admin/plans";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import AddButton from "@src/components/common/inputs/addButton";
import PlansInfoGetter from "@src/components/pages/plans/info";
import connect from "@serv/db/connect";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { MakeItSerializable } from "@src/utils";
import { useTranslation } from "react-i18next";

export interface Props {
  plans: DataBase.WithIdOrg<DataBase.Models.Plans>[];
}
export default function Page({ plans: levels }: Props) {
  const { t } = useTranslation("/plan");
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{t("title")}</title>
      </Head>
      <BigCard>
        <CardTitle>{t("Plans")}</CardTitle>
        <MainCard>
          <PlansInfoGetter plans={levels} />
        </MainCard>
      </BigCard>
      <div className="tw-py-3">
        <AddButton label={t("Add Plan")} href="/plans/add" />
      </div>
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
          id: doc._id.toString(),
          ...MakeItSerializable(doc),
        };
      }),
    },
  };
};
