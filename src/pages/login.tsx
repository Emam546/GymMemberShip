import { FieldError, useForm } from "react-hook-form";
import { ErrorInputShower } from "@src/components/common/inputs/main";
import { useRouter } from "next/router";
import { GetServerSideProps, NextPage } from "next";
import Admins from "@serv/models/admins";
import { StyledSelect } from "@src/components/common/inputs/styles";
import connect from "@serv/db/connect";
import EnvVars from "@serv/declarations/major/EnvVars";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import requester from "@src/utils/axios";
// import Logo from "@sources/src/logo.png";
import { useLogUser } from "@src/components/UserProvider";
import ImagesBg from "@src/components/bg";
import { NextPageWithLayout } from "./_app";
import Head from "next/head";
export interface FormValues {
  id: string;
  password: string;
}
export interface Props {
  admins: { id: string; name: string }[];
}

const Login: NextPageWithLayout<Props> = function Login({ admins }) {
  const { register, handleSubmit, formState, setError } = useForm<FormValues>({
    criteriaMode: "firstError",
  });
  const login = useLogUser();
  const mutate = useMutation({
    async mutationFn(data: FormValues) {
      const response = await requester.post(
        "/api/admin/admins/auth/login",
        data
      );
      const user = response.data.data;
      await login.mutateAsync(user);
      await router.replace("/");
    },
    onError(err: AxiosError<any>) {
      setError("root", {
        message: err.response?.data.msg || err.message || "",
      });
    },
  });
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className=" tw-min-h-screen row justify-content-center tw-items-center login">
        <div className="col-md-8 col-lg-6 col-xxl-3">
          <div className="mb-0 card tw-bg-black/90">
            <div className="card-body">
              <div className="py-3 text-center text-nowrap logo-img d-block w-100">
                <img src={"/images/src/logo"} width={180} alt="logo" />
              </div>
              <p className="text-center">Login</p>
              <form
                onSubmit={handleSubmit(async (data) => {
                  try {
                    await mutate.mutateAsync(data);
                  } catch (error) {}
                })}
              >
                <ErrorInputShower err={formState.errors.root as FieldError} />
                <div className="mb-3">
                  <label htmlFor="user-input" className="form-label">
                    User
                  </label>
                  <StyledSelect
                    id="user-input"
                    {...register("id", {
                      required: "The Input is required",
                    })}
                  >
                    {admins.map((val) => {
                      return (
                        <option value={val.id} key={val.id}>
                          {val.name}
                        </option>
                      );
                    })}
                  </StyledSelect>
                  <ErrorInputShower err={formState.errors.id} />
                </div>
                <div className="mb-4">
                  <label htmlFor="password-input" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password-input"
                    {...register("password", {
                      required: "The Input is required",
                    })}
                  />
                  <ErrorInputShower err={formState.errors.password} />
                </div>
                <button
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="py-8 mb-4 btn btn-primary w-100 fs-4 rounded-2"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
Login.getLayout = (page) => {
  return page;
};
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  const g = await Admins.find({});
  return {
    props: {
      admins: g.map((val) => {
        return {
          id: val._id.toString(),
          name: val.name,
        };
      }),
    },
  };
};
export default Login;
