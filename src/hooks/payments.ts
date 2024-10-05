import requester from "@src/utils/axios";
import { remainingDays } from "@src/utils/payment";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

export function useAttend({
  onSuccess,
  ...opt
}: Omit<
  UseMutationOptions<
    DataBase.WithId<DataBase.Models.Logs> | null,
    unknown,
    string,
    unknown
  >,
  "useMutation"
>) {
  return useMutation({
    async mutationFn(paymentId: string) {
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
      >(`/api/admin/payments/${paymentId}/logs`);
      return data.data.data;
    },
    onSuccess(data, variables, context) {
      alert("log added successfuly");
      onSuccess?.call(this, data, variables, context);
    },
    ...opt,
  });
}
