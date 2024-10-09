/* eslint-disable @typescript-eslint/no-namespace */
import "@locales/users/add";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import { useTranslation } from "react-i18next";
import AdminInfoForm from "@src/components/pages/admins/form";
import { GetServerSideProps } from "next";
import i18n from "@src/i18n";
import AdminsTable from "@src/components/pages/admins/table";
import { useState } from "react";
import { getAdmins } from "@serv/routes/admin/admins";
import EnvVars from "@serv/declarations/major/EnvVars";
import connect from "@serv/db/connect";
import { useAuth, useLogUser } from "@src/components/UserProvider";
interface Props {
  admins: DataBase.WithId<DataBase.Models.Admins>[];
}
export default function Page({ admins: initAdmins }: Props) {
  const [admins, setAdmins] = useState(initAdmins);
  const auth = useAuth();
  const login = useLogUser();
  const { t } = useTranslation("/admins");
  const mutate = useMutation({
    async mutationFn(data: unknown) {
      const request = await requester.post<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.Admins>>
      >(`/api/admin/admins`, data);
      return request.data.data;
    },
    onSuccess(data) {
      setAdmins([...admins, data]);
      alert(t("messages.added", { ns: "translation" }));
    },
  });
  const deleteAdmin = useMutation({
    async mutationFn(data: DataBase.WithId<DataBase.Models.Admins>) {
      await requester.delete<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.Admins>>
      >(`/api/admin/admins/${data._id}`);
    },
  });

  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <BigCard>
        <CardTitle>{t("create.title")}</CardTitle>
        <MainCard>
          <AdminInfoForm
            onData={async (data) => {
              const user = await mutate.mutateAsync(data);
            }}
            buttonName={t("buttons.add", { ns: "translation" })}
          />
        </MainCard>
        <MainCard>
          <AdminsTable
            perPage={admins.length}
            page={0}
            admins={admins.map((admin, i) => {
              return {
                order: i,
                admin: admin,
              };
            })}
            onDelete={async (admin) => {
              await deleteAdmin.mutateAsync(admin);
              setAdmins((pre) => pre.filter((c) => c._id != admin._id));
              if (auth?._id == admin._id) login.mutate(null);
            }}
            totalCount={admins.length}
            headKeys={["delete", "email", "name", "order", "phone", "type"]}
          />
        </MainCard>
      </BigCard>
    </>
  );
}

declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/admins": {
        title: "Admins";
        "create.title": "Create User";
      };
    }
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);

  const admins = await getAdmins();
  return {
    props: {
      admins: admins.map((admin) => {
        return {
          ...admin.toJSON(),
          _id: admin._id.toString(),
        };
      }),
    },
  };
};

