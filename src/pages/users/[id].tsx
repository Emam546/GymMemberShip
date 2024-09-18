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
import PrintUsersPayments from "@src/components/pages/plans/payments/print";
import PaymentInfoGenerator from "@src/components/pages/users/payments/table";
import { getUser } from "@serv/routes/admin/user/[id]";

interface Props {
  doc: DataBase.WithId<DataBase.Models.User>;
}
export default function Page({ doc: initData }: Props) {
  const [doc, setDoc] = useState(initData);
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{doc.name}</title>
      </Head>
      <BigCard>
        <CardTitle>Update User Data</CardTitle>
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
              await requester.post(`/api/admin/user/${doc._id}`, data);
              setDoc({ ...doc, ...data });
              alert("the document updated successfully");
            }}
            buttonName="Update"
          />
        </MainCard>
        <div className="tw-flex tw-items-center tw-justify-between">
          <CardTitle>Payments</CardTitle>
          <PrintUsersPayments id={doc._id} />
        </div>
        <MainCard>
          <PaymentInfoGenerator
            id={doc._id}
            perPage={7}
            headKeys={[
              "createdAt",
              "delete",
              "paid",
              "plan",
              "log",
              "addLog",
              "separated",
              "link",
            ]}
          />
        </MainCard>
      </BigCard>
      <div className="py-3">
        <GoToButton label="Go To Logs" href={`/users/${doc._id}/logs`} />
      </div>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  try {
    const user = await getUser(ctx.params!.id as string);
    return {
      props: {
        doc: MakeItSerializable({ ...user.toJSON(), _id: user._id.toString() }),
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
