import requester from "@src/utils/axios";
import { remainingDays } from "@src/utils/payment";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
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
  return useMutation<
    DataBase.WithId<DataBase.Models.Logs> | null,
    unknown,
    { paymentId: string; body?: Data }
  >({
    async mutationFn({ body, paymentId }) {
      const request = await requester.get<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.Payments>>
      >(`/api/admin/payments/${paymentId}`);
      const rDays = remainingDays(request.data.data);
      if (
        rDays <= 0 &&
        !confirm(
          "Do you want to add more logs to the payment?\nThe remaining days of the payment is 0 ."
        )
      )
        return null;
      const data = await requester.post<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.Logs>>
      >(`/api/admin/payments/${paymentId}/logs`, body);
      return data.data.data;
    },
    onSuccess(...args) {
      alert("log added successfuly");
      onSuccess?.call(this, ...args);
    },
    ...opt,
  });
}
