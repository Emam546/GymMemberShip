import { BigCard, CardTitle, MainCard } from "@src/components/card";
import Head from "next/head";
import { useState } from "react";
import requester from "@src/utils/axios";
import EnvVars from "@serv/declarations/major/EnvVars";
import { MakeItSerializable } from "@src/utils";
import connect from "@serv/db/connect";
import { GetServerSideProps } from "next";
import { useTranslation } from "react-i18next";
import { getAdmin } from "@serv/routes/admin/admins/[id]";
import AdminInfoForm from "@src/components/pages/admins/form";
import { IsAdminComp } from "@src/components/wrappers";

interface Props {
  doc: DataBase.WithId<DataBase.Models.Admins>;
}

export default function Page({ doc: initData }: Props) {
  const [doc, setDoc] = useState(initData);
  const { t } = useTranslation("/admins/[id]");
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{doc.name}</title>
      </Head>
      <IsAdminComp>
        <BigCard>
          <CardTitle>{t("update.title")}</CardTitle>
          <MainCard>
            <AdminInfoForm
              defaultData={{
                password: doc.password,
                email: doc.email,
                phone: doc.phone,
                name: doc.name,
              }}
              onData={async (data) => {
                await requester.post(`/api/admin/admins/${doc._id}`, data);
                setDoc({ ...doc, ...data });
                alert(t("messages.updated", { ns: "translation" }));
              }}
              buttonName={t("buttons.update", { ns: "translation" })}
            />
          </MainCard>
          {/* <div className="tw-flex tw-items-center tw-justify-between">
            <CardTitle>{t("payments.title")}</CardTitle>
            <PrintUsersPayments id={doc._id} />
          </div> */}
        </BigCard>
      </IsAdminComp>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  try {
    const user = await getAdmin(ctx.params!.id as string);
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
import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/admins/[id]": {
        "update.title": "Update Admin Data";
        "payments.title": "Payments";
      };
    }
  }
}
i18n.addLoadUrl("/pages/admins/[id]", "/admins/[id]");
