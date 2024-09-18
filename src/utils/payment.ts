export function planToDays(plan: DataBase.Models.Payments["plan"]) {
  switch (plan.type) {
    case "day":
      return plan.num;
    case "month":
      return plan.num * 30;
    case "year":
      return plan.num * 30 * 12;
    default:
      throw new Error("undefined Value");
  }
}
function getDifferenceInDays(date1: Date, date2: Date) {
  const oneDay = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
  const diffInTime = date2.getTime() - date1.getTime(); // Get the absolute difference in milliseconds
  const diffInDays = Math.ceil(diffInTime / oneDay); // Convert to days and round up

  return diffInDays;
}
export function remainingDays(
  payment: Pick<DataBase.Models.Payments, "plan" | "createdAt" | "separated">,
  curDays: number
) {
  const days = planToDays(payment.plan);
  if (payment.separated) return days - curDays;
  const startDate = new Date(payment.createdAt);
  const daysStarted = getDifferenceInDays(startDate, new Date());
  return Math.max(0, days - daysStarted);
}
