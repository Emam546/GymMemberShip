import TextArea from "@src/components/common/inputs/textArea";
import { useForm } from "react-hook-form";
import React from "react";
import { WrapElem } from "@src/components/common/inputs/styles";
import { WhatsappButtonStyle } from "@src/components/common/buttons/whatsapp";
import { hasOwnProperty } from "@src/utils";
import { isValidPhoneNumber } from "react-phone-number-input";
import requester from "@src/utils/axios";
import { useTranslation } from "react-i18next";

export interface FormData {
  message: string;
  files: FileList;
}
export interface DataType {
  messages: (
    | {
        message: string;
      }
    | {
        file: File;
      }
  )[];
}
export interface Props {
  defaultData?: DefaultData;
  onData: (data: DataType) => unknown;
  buttonName: React.ReactNode;
}
export type DefaultData = FormData;

export default function MessageDataForm({
  defaultData,
  buttonName,
  onData,
}: Props) {
  const { register, handleSubmit, formState } = useForm<FormData>({
    values: defaultData,
  });
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const messages: DataType["messages"] = [];
        messages.push(
          ...(await Promise.all(
            Array.from(data.files).map((val) => {
              return {
                file: val,
              };
            })
          ))
        );
        if (data.message) {
          messages.push({
            message: data.message,
          });
        }
        return onData({ messages });
      })}
      autoComplete="off"
    >
      <WrapElem id="formFileMultiple" label="Upload Files">
        <input
          className="form-control"
          type="file"
          {...register("files")}
          id="formFileMultiple"
          multiple
        />
      </WrapElem>
      <div className="tw-mt-4">
        <TextArea
          id={"desc-input"}
          title={"Message"}
          {...register("message")}
          className="tw-min-h-[10rem]"
          err={formState.errors.message}
        />
      </div>
      <div className="tw-mt-4 tw-flex tw-justify-end">
        <WhatsappButtonStyle type="submit" disabled={formState.isSubmitting}>
          {buttonName}
        </WhatsappButtonStyle>
      </div>
    </form>
  );
}
type Doc = DataBase.WithId<DataBase.Models.User>;
export interface MessageDataUsersProps extends Omit<Props, "onData"> {
  OnUsers: () => Promise<Doc[]> | Doc[];
}
export function MessageDataUsers({ OnUsers, ...props }: MessageDataUsersProps) {
  const { t } = useTranslation();
  return (
    <MessageDataForm
      onData={async function (dataMessages: DataType) {
        const users = await OnUsers();
        users.map(async (val) => {
          const formData = new FormData();
          const phone = val?.phone;
          if (!phone || !isValidPhoneNumber(phone)) return;
          const num = phone.startsWith("+") ? phone.slice(1) : phone;
          const data = {
            number: num,
            messages: dataMessages.messages.map((data, i) => {
              if (hasOwnProperty(data, "message")) {
                return {
                  message: data.message,
                };
              }
              formData.append(i.toString(), data.file);
              return {
                file: i,
              };
            }),
          };
          formData.append("data", JSON.stringify(data));
          try {
            await requester.post("/api/admin/whatsapp", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          } catch (err) {
            console.error(val?.name);
            console.error(err);
          }
          alert(t("messages.whatsapp.sended", { ns: "translation" }));
        });
      }}
      {...props}
    />
  );
}
// declare global {
//   namespace I18ResourcesType {
//     interface Resources {
//       "form:user": {
//         "User Name": "User Name";
//         Phone: "Phone";
//         Age: "Age";
//         "Tall in centimeter": "Tall in centimeter";
//         "Weight in Kg": "Weight in Kg";
//         "Why did you come": "Why did you come";
//       };
//     }
//   }
// }
