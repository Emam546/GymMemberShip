import { BigCard, CardTitle, MainCard } from "@src/components/card";
import { useRouter } from "next/router";
import PlansInfoForm from "@src/components/pages/plans/form";
import { GoToButton } from "@src/components/common/inputs/addButton";
import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";

export default function Page() {
  const router = useRouter();
  const mutate = useMutation({
    mutationFn(data: unknown) {
      return requester.post(`/api/admin/plans`, data);
    },
  });
  return (
    <>
      <Head>
        <title>Add Plan</title>
      </Head>
      <BigCard>
        <CardTitle>Add Plan</CardTitle>
        <MainCard>
          <PlansInfoForm
            onData={async (data) => {
              await mutate.mutateAsync(data);
              await router.push("/plans");
            }}
            buttonName="Submit"
          />
        </MainCard>
      </BigCard>
      <div className="tw-mt-3">
        <GoToButton label="Go To Plans" href={"/plans"} />
      </div>
    </>
  );
}
