import { FieldError, useForm } from "react-hook-form";
import { ErrorInputShower } from "@src/components/common/inputs/main";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Admins from "@serv/models/admins";
import SelectInput from "@src/components/common/inputs/select";
import { StyledSelect } from "@src/components/common/inputs/styles";
import connect from "@serv/db/connect";
import EnvVars from "@serv/declarations/major/EnvVars";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import requester from "@src/utils/axios";

export interface FormValues {
  id: string;
  password: string;
}
export interface Props {
  admins: { id: string; name: string }[];
}

export default function Login({ admins }: Props) {
  const { register, handleSubmit, formState, setError } = useForm<FormValues>({
    criteriaMode: "firstError",
  });
  const mutate = useMutation({
    async mutationFn(data: FormValues) {
      await requester.post("/api/admin/admins/auth/login", data);
    },
    onError(err: AxiosError<any>) {
      setError("root", {
        message: err.response?.data.msg || err.message || "",
      });
    },
    onSuccess() {
      router.replace("/");
    },
  });
  const router = useRouter();
  return (
    <div
      className="page-wrapper"
      id="main-wrapper"
      data-layout="vertical"
      data-navbarbg="skin6"
      data-sidebartype="full"
      data-sidebar-position="fixed"
      data-header-position="fixed"
    >
      <div className="overflow-hidden position-relative radial-gradient min-vh-100 d-flex align-items-center justify-content-center tw-py-6">
        <div className="d-flex align-items-center justify-content-center w-100">
          <div className="row justify-content-center w-100">
            <div className="col-md-8 col-lg-6 col-xxl-3">
              <div className="mb-0 card">
                <div className="card-body">
                  <div className="py-3 text-center text-nowrap logo-img d-block w-100">
                    <img
                      src="/images/logos/dark-logo.svg"
                      width={180}
                      alt="logo"
                    />
                  </div>
                  <p className="text-center">Login</p>
                  <form
                    onSubmit={handleSubmit(async (data) => {
                      try {
                        await mutate.mutateAsync(data);
                      } catch (error) {}
                    })}
                  >
                    <ErrorInputShower
                      err={formState.errors.root as FieldError}
                    />
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
        </div>
      </div>
    </div>
  );
}

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
