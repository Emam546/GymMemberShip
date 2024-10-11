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
import PrintPlanPayments from "@src/components/pages/plans/subscriptions/print";
import PaymentInfoGenerator from "@src/components/pages/plans/subscriptions/table";
import { useTranslation } from "react-i18next";
import { IsAdminComp } from "@src/components/wrappers";

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
        <IsAdminComp>
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
        </IsAdminComp>
      </BigCard>
      <div className="py-3">
        <IsAdminComp>
          <GoToButton
            label={t("Go To Users Logs")}
            href={`/plans/${doc._id}/logs`}
          />
          <GoToButton
            label={t("Go To Plan Payments")}
            href={`/plans/${doc._id}/subscriptions`}
          />

          <GoToButton
            label={t("Go To Plan Users")}
            href={`/plans/${doc._id}/whatsapp`}
          />
        </IsAdminComp>
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

declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/plan/[id]": {
        "Update Plan Data": "Update Plan Data";
        Payments: "Payments";
        "Go To Plans": "Go To Plans";
        "Go To Users Logs": "Go To User Logs";
        "Go To Plan Payments": "Go To Plan Payments";
        "Go To Plan Users": "Go To Plans Users";
      };
    }
  }
}
