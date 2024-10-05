import EnvVars from "@serv/declarations/major/EnvVars";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import AddButton from "@src/components/common/inputs/addButton";
import connect from "@serv/db/connect";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { MakeItSerializable } from "@src/utils";
import { useTranslation } from "react-i18next";
import { RedirectIfNotAdmin } from "@src/components/wrappers/redirect";
import requester from "@src/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import TrainersInfoForm from "@src/components/pages/trainers/form";
import { getAllTrainers } from "@serv/routes/admin/trainers";
import TrainersTable from "@src/components/pages/trainers/table";

export interface Props {
  trainers: DataBase.WithId<DataBase.Models.Trainers>[];
}
export default function Page({ trainers: initPlans }: Props) {
  const [trainers, setTrainers] = useState(initPlans);
  const { t } = useTranslation("/trainers");
  const mutate = useMutation({
    async mutationFn(data: unknown) {
      const res = await requester.post(`/api/admin/trainers`, data);
      return res.data.data as DataBase.WithId<DataBase.Models.Trainers>;
    },
  });
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <RedirectIfNotAdmin>
        <Head>
          <title>{t("page.title")}</title>
        </Head>
        <BigCard>
          <CardTitle>{t("add.title")}</CardTitle>
          <MainCard>
            <TrainersInfoForm
              onData={async (data) => {
                const doc = await mutate.mutateAsync(data);
                setTrainers([...trainers, doc]);
                alert(t("messages.added", { ns: "translation" }));
              }}
              buttonName={t("buttons.add", { ns: "translation" })}
            />
          </MainCard>
          <CardTitle>{t("elems.title")}</CardTitle>
          <MainCard>
            <TrainersTable
              trainers={trainers.map((val, i) => {
                return {
                  order: i + 1,
                  trainer: val,
                };
              })}
              headKeys={["delete", "email", "name", "order", "phone"]}
              page={0}
              perPage={trainers.length}
              totalCount={trainers.length}
              onDelete={async (trainer) => {
                await requester.delete(`/api/admin/trainers/${trainer._id}`);
                setTrainers((pre) =>
                  pre.filter(({ _id }) => _id != trainer._id)
                );
                alert(t("messages.deleted", { ns: "translation" }));
              }}
            />
          </MainCard>
        </BigCard>
      </RedirectIfNotAdmin>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  const trainers = await getAllTrainers();
  return {
    props: {
      trainers: trainers.map((doc) => {
        return {
          ...MakeItSerializable(doc),
          _id: doc._id.toString(),
        };
      }),
    },
  };
};
import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/trainers": {
        "page.title": "Trainers";
        "elems.title": "Trainers";
        "add.title": "Add Trainer";
      };
    }
  }
}
i18n.addLoadUrl("/pages/trainers", "/trainers");
