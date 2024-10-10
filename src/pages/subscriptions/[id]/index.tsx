import "@src/i18n/locales/subscriptions/[id]";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import Head from "next/head";
import { useState } from "react";
import requester from "@src/utils/axios";
import EnvVars from "@serv/declarations/major/EnvVars";
import { MakeItSerializable } from "@src/utils";
import connect from "@serv/db/connect";
import { GetServerSideProps } from "next";
import { getAllPlans } from "@serv/routes/admin/plans";
import { getPayment } from "@serv/routes/admin/subscriptions/[id]";
import PaymentInfoForm from "@src/components/pages/subscriptions/info";
import DeletePaymentForm from "@src/components/pages/subscriptions/info/deleteForm";
import LogsPaymentInfo from "@src/components/pages/subscriptions/logs";
import { useTranslation } from "react-i18next";
import { getAllTrainers } from "@serv/routes/admin/trainers";

interface Props {
  doc: DataBase.WithId<
    DataBase.Populate.Model<
      DataBase.WithId<DataBase.Models.Subscriptions>,
      "userId" | "planId" | "adminId" | "trainerId"
    >
  >;
  plans: DataBase.WithId<DataBase.Models.Plans>[];
  trainers: DataBase.WithId<DataBase.Models.Trainers>[];
}
export default function Page({ doc: initData, plans, trainers }: Props) {
  const [doc, setDoc] = useState(initData);
  const { t } = useTranslation("/subscriptions/[id]");

  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>
          {t("title", {
            val: doc.userId?.name,
          })}
        </title>
      </Head>
      <BigCard>
        <CardTitle>{t("Update Payment Data")}</CardTitle>
        <MainCard>
          <PaymentInfoForm
            payment={{
              ...doc,
              planId: doc.planId?._id || "",
              userId: doc.userId?._id || "",
              adminId: doc.adminId?._id || "",
              trainerId: doc.trainerId?._id,
            }}
            trainers={trainers}
            plans={plans}
            user={doc.userId}
            onData={async (data) => {
              await requester.post(`/api/admin/subscriptions/${doc._id}`, data);
              setDoc({ ...doc, ...data });
              alert(t("messages.updated", { ns: "translation" }));
            }}
          />
        </MainCard>
        <DeletePaymentForm
          payment={{
            ...doc,
            planId: doc.planId?._id || "",
            userId: doc.userId?._id || "",
            adminId: doc.adminId?._id || "",
            trainerId: doc.trainerId?._id,
          }}
        />
        <MainCard>
          <CardTitle>{t("User Logs")}</CardTitle>
          <div>
            <LogsPaymentInfo id={doc._id} />
          </div>
        </MainCard>
      </BigCard>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  try {
    if (!ctx.params)
      return {
        notFound: true,
      };
    const payment = await getPayment(ctx.params.id as string);
    const plans = await getAllPlans();
    const trainers = await getAllTrainers();
    return {
      props: {
        doc: MakeItSerializable({
          ...payment.toJSON(),
          _id: payment._id.toString(),
        }) as unknown as Props["doc"],
        plans: plans.map((plan) => {
          return {
            ...MakeItSerializable(plan),
            _id: plan._id.toString(),
          };
        }),
        trainers: trainers.map((trainer) => {
          return {
            ...MakeItSerializable(trainer),
            _id: trainer._id.toString(),
          };
        }),
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
