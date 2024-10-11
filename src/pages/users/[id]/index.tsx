import "@locales/users/[id]";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import { GoToButton } from "@src/components/common/inputs/addButton";
import UserInfoForm from "@src/components/pages/users/form";
import Head from "next/head";
import { useState } from "react";
import requester from "@src/utils/axios";
import EnvVars from "@serv/declarations/major/EnvVars";
import { MakeItSerializable } from "@src/utils";
import connect from "@serv/db/connect";
import { GetServerSideProps } from "next";
import PrintUsersPayments from "@src/components/pages/users/subscriptions/print";
import PaymentInfoGenerator from "@src/components/pages/users/subscriptions/table";
import { getUser } from "@serv/routes/admin/users/[id]";
import AddUserPayment from "@src/components/pages/users/addPayment";
import { getAllPlans } from "@serv/routes/admin/plans";
import { getAllTrainers } from "@serv/routes/admin/trainers";
import queryClient from "@src/queryClient";
import DeleteAccountForm from "@src/components/pages/users/deleteAccountForm";
import { useTranslation } from "react-i18next";
import { CopyText } from "@src/components/common/copy";

interface Props {
  doc: DataBase.WithId<DataBase.Models.User>;
  plans: DataBase.WithId<DataBase.Models.Plans>[];
  trainers: DataBase.WithId<DataBase.Models.Trainers>[];
}

export default function Page({ doc: initData, plans, trainers }: Props) {
  const [doc, setDoc] = useState(initData);
  const { t } = useTranslation("/users/[id]");
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{doc.name}</title>
      </Head>
      <BigCard>
        <div className="tw-flex tw-items-center tw-justify-between">
          <CardTitle>{t("Update User Data")}</CardTitle>
          <div>
            <CopyText text={doc.barcode.toString()}>
              Barcode:{doc.barcode}
            </CopyText>
          </div>
        </div>
        <MainCard>
          <UserInfoForm
            defaultData={{
              details: doc.details,
              name: doc.name,
              age: doc.age,
              blocked: doc.blocked,
              phone: doc.phone,
              sex: doc.sex,
              tall: doc.tall,
              weight: doc.weight,
            }}
            onData={async (data) => {
              await requester.post(`/api/admin/users/${doc._id}`, data);
              setDoc({ ...doc, ...data });
              alert(t("messages.updated", { ns: "translation" }));
            }}
            buttonName={t("buttons.update", { ns: "translation" })}
          />
        </MainCard>
        <div className="tw-mb-8">
          <DeleteAccountForm id={doc._id} />
        </div>
        <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
          <CardTitle>{t("Payments")}</CardTitle>
          <PrintUsersPayments id={doc._id} />
        </div>
        <MainCard>
          <AddUserPayment
            trainers={trainers}
            onData={async ({ ...data }) => {
              await requester.post("/api/admin/subscriptions", {
                ...data,
                userId: doc._id,
              });
              queryClient.invalidateQueries([
                "subscriptions",
                "users",
                doc._id,
              ]);
              alert(t("messages.added", { ns: "translation" }));
            }}
            plans={plans}
          />
        </MainCard>

        <MainCard>
          <PaymentInfoGenerator
            id={doc._id}
            perPage={10}
            headKeys={[
              "admin",
              "delete",
              "paid",
              "plan",
              "log",
              "addLog",
              "link",
              "endAt",
              "remainingMoney",
            ]}
          />
        </MainCard>
      </BigCard>
      <div className="py-3">
        <GoToButton label={t("Go To Logs")} href={`/users/${doc._id}/logs`} />
      </div>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  try {
    const user = await getUser(ctx.params!.id as string);
    const plans = await getAllPlans();
    const trainers = await getAllTrainers();
    return {
      props: {
        doc: MakeItSerializable({ ...user.toJSON(), _id: user._id.toString() }),
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
