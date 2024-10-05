import MainInput from "@src/components/common/inputs/main";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Grid2 } from "../form";
import { useTranslation } from "react-i18next";
import i18n from "@src/i18n";
interface Props {
  user?: DataBase.WithId<DataBase.Models.User>;
}
export interface DataType extends DataBase.WithId<DataBase.Models.User> {
  blocked?: boolean;
  name?: string;
  age?: number;
  tall?: number;
  weight?: number;
  sex?: "male" | "female";
  phone?: string;
  details: {
    whyDidYouCame?: string;
  };
}
export default function UserInfoForm({ user }: Props) {
  const { t } = useTranslation("form:user");
  const { register, formState } = useForm<DataType>({
    values: user,
  });
  return (
    <div>
      <Grid2>
        <div>
          <MainInput
            id={"name-input"}
            title={t("User Name")}
            disabled
            value={user?.name}
          />
          <Link href={`/users/${user?._id}`}>{user?.name}</Link>
        </div>

        <MainInput
          id={"phone-input"}
          disabled
          title={t("Phone")}
          {...register("phone")}
          err={formState.errors.name}
        />
      </Grid2>
    </div>
  );
}
i18n.addLoadUrl("/components/users/form", "form:user");
