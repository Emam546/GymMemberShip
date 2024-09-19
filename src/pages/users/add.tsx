import { BigCard, CardTitle, MainCard } from "@src/components/card";
import { useRouter } from "next/router";
import UsersInfoForm from "@src/components/pages/users/form";
import { GoToButton } from "@src/components/common/inputs/addButton";
import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import { ObjectEntries } from "@src/utils";

export default function Page() {
  const router = useRouter();
  const mutate = useMutation({
    async mutationFn(data: unknown) {
      const request = await requester.post<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.User>>
      >(`/api/admin/users`, data);
      return request.data.data;
    },
  });
  return (
    <>
      <Head>
        <title>Create User</title>
      </Head>
      <BigCard>
        <CardTitle>Create User</CardTitle>
        <MainCard>
          <UsersInfoForm
            onData={async (data) => {
              const user = await mutate.mutateAsync(data);
              await router.push(`/users/${user._id}`);
            }}
            buttonName="Submit"
          />
        </MainCard>
      </BigCard>
      <div className="tw-mt-3">
        <GoToButton label="Go To Users" href={"/users"} />
      </div>
    </>
  );
}
