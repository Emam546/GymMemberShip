import "@locales/plan/add";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import { useRouter } from "next/router";
import PlansInfoForm from "@src/components/pages/plans/form";
import { GoToButton } from "@src/components/common/inputs/addButton";
import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import { useTranslation } from "react-i18next";
import { RedirectIfNotAdmin } from "@src/components/wrappers/redirect";
export default function Page() {
  const { t } = useTranslation("/plan/add");
  const router = useRouter();
  const mutate = useMutation({
    mutationFn(data: unknown) {
      return requester.post(`/api/admin/plans`, data);
    },
  });
  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <RedirectIfNotAdmin>
        <BigCard>
          <CardTitle>{t("Add Plan")}</CardTitle>
          <MainCard>
            <PlansInfoForm
              onData={async (data) => {
                await mutate.mutateAsync(data);
                await router.push("/plans");
              }}
              buttonName={t("buttons.submit", { ns: "translation" })}
            />
          </MainCard>
        </BigCard>
        <div className="tw-mt-3">
          <GoToButton label={t("Go To Plans")} href={"/plans"} />
        </div>
      </RedirectIfNotAdmin>
    </>
  );
}
