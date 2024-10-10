import requester from "@src/utils/axios";
import { remainingDays } from "@src/utils/payment";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
export interface Data {
  trainerId?: string;
}
export function useAttend({
  onSuccess,
  ...opt
}: Omit<
  UseMutationOptions<
    DataBase.WithId<DataBase.Models.Logs> | null,
    unknown,
    { paymentId: string; body?: Data },
    unknown
  >,
  "mutationFn"
>) {
  const { t } = useTranslation("attend:messages");
  return useMutation<
    DataBase.WithId<DataBase.Models.Logs> | null,
    unknown,
    { paymentId: string; body?: Data }
  >({
    async mutationFn({ body, paymentId }) {
      const request = await requester.get<
        Routes.ResponseSuccess<
          DataBase.Populate.Model<
            DataBase.WithId<DataBase.Models.Payments>,
            "adminId" | "userId" | "planId" | "trainerId"
          >
        >
      >(`/api/admin/payments/${paymentId}`);
      const rDays = remainingDays(request.data.data);
      if (rDays <= 0 && !confirm(t("messages.finished"))) return null;
      const requestLogs = await requester.get<
        Routes.ResponseSuccess<
          DataBase.Populate.Model<
            DataBase.WithId<DataBase.Models.Logs>,
            "adminId" | "planId" | "trainerId"
          >[]
        >
      >(`/api/admin/users/${request.data.data.userId?._id || ""}/logs`, {
        params: {
          limit: 1,
        },
      });

      if (
        requestLogs.data.data[0] &&
        new Date(requestLogs.data.data[0].createdAt).getDate() ==
          new Date().getDate() &&
        !confirm(t("messages.userAttendedAlready"))
      )
        return null;

      const data = await requester.post<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.Logs>>
      >(`/api/admin/payments/${paymentId}/logs`, body);
      return data.data.data;
    },
    onSuccess(...args) {
      if (!args[0]) return;
      alert("a log was added successfully");
      onSuccess?.call(this, ...args);
    },
    ...opt,
  });
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "attend:messages": {
        messages: {
          finished: string;
          userAttendedAlready: string;
          logAdded:""
        };
      };
    }
  }
}
