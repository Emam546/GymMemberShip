export function createLog(
  planId: string,
  userId: string,
  paymentId: string
): Omit<DataBase.Models.Logs, "createdAt" | "createdBy" | "adminId"> {
  return {
    paymentId,
    planId,
    userId,
  };
}
