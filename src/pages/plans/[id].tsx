import { BigCard, CardTitle, MainCard } from "@src/components/card";
import { GoToButton } from "@src/components/common/inputs/addButton";
import PlanInfoForm from "@src/components/pages/plans/form";
import Head from "next/head";
import { useState } from "react";
import requester from "@src/utils/axios";
import EnvVars from "@serv/declarations/major/EnvVars";
import { getAllPlans } from "@serv/routes/admin/plans";
import { MakeItSerializable } from "@src/utils";
import connect from "@serv/db/connect";
import { GetServerSideProps } from "next";
import { getPlan } from "@serv/routes/admin/plans/[id]";
import PrintPlanPayments from "@src/components/pages/plans/payments/print";
import PaymentInfoGenerator from "@src/components/pages/plans/payments/table";

interface Props {
  doc: DataBase.WithIdOrg<DataBase.Models.Plans>;
}
export default function Page({ doc: initData }: Props) {
  const [doc, setDoc] = useState(initData);
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{doc.name}</title>
      </Head>
      <BigCard>
        <CardTitle>Update Level Data</CardTitle>
        <MainCard>
          <PlanInfoForm
            defaultData={{
              details: doc.details,
              name: doc.name,
              prices: doc.prices,
            }}
            onData={async (data) => {
              await requester.post(`/api/admin/plans/${doc.id}`, data);
              setDoc({ ...doc, ...data });
              alert("the document updated successfully");
            }}
            buttonName="Update"
          />
        </MainCard>
        <div className="tw-flex tw-items-center tw-justify-between">
          <CardTitle>Payments</CardTitle>
          <PrintPlanPayments id={doc.id} />
        </div>
        <MainCard>
          <PaymentInfoGenerator
            id={doc.id}
            perPage={20}
            headKeys={["createdAt", "delete", "order", "paid", "user"]}
          />
        </MainCard>
      </BigCard>
      <div className="py-3">
        <GoToButton label="Go To Levels" href="/plans" />
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
          id: plan._id.toString(),
          ...plan.toJSON(),
        }),
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
