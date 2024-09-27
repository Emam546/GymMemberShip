import "@locales/plan/[id]";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import { GoToButton } from "@src/components/common/inputs/addButton";
import PlanInfoForm from "@src/components/pages/plans/form";
import Head from "next/head";
import requester from "@src/utils/axios";
import EnvVars from "@serv/declarations/major/EnvVars";
import { MakeItSerializable } from "@src/utils";
import connect from "@serv/db/connect";
import { GetServerSideProps } from "next";
import { getPlan } from "@serv/routes/admin/plans/[id]";
import PrintPlanPayments from "@src/components/pages/plans/payments/print";
import PaymentInfoGenerator from "@src/components/pages/plans/payments/table";
import { useTranslation } from "react-i18next";

interface Props {
  doc: DataBase.WithId<DataBase.Models.Plans>;
}
export default function Page({ doc }: Props) {
  const { t } = useTranslation("/plan/[id]");
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{doc.name}</title>
      </Head>
      <BigCard>
        <CardTitle>{t("Update Plan Data")}</CardTitle>
        <MainCard>
          <PlanInfoForm
            defaultData={{
              details: doc.details,
              name: doc.name,
              prices: doc.prices,
            }}
            onData={async (data) => {
              await requester.post(`/api/admin/plans/${doc._id}`, data);
              alert(t("messages.updated", { ns: "translation" }));
            }}
            buttonName={t("buttons.update", { ns: "translation" })}
          />
        </MainCard>
        <div className="tw-flex tw-items-center tw-justify-between">
          <CardTitle>{t("Payments")}</CardTitle>
          <PrintPlanPayments id={doc._id} />
        </div>
        <MainCard>
          <PaymentInfoGenerator
            id={doc._id}
            perPage={20}
            headKeys={["createdAt", "delete", "paid", "user", "log", "link"]}
          />
        </MainCard>
      </BigCard>
      <div className="py-3">
        <GoToButton label={t("Go To Users Logs")} href={`/plans/${doc._id}/logs`} />
        <GoToButton label={t("Go To Plans")} href="/plans" />
      </div>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  try {
    const plan = await getPlan(ctx.params!.id as string);
    return {
      props: {
        doc: MakeItSerializable({
          ...plan.toJSON(),
          _id: plan._id.toString(),
        }),
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
