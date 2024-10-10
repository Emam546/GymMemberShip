export function paidType<
  T extends number | undefined,
  G extends T extends number ? number : undefined
>(plan: DataBase.Models.Subscriptions["plan"], price: T): G {
  if (typeof price == "undefined") return undefined as G;
  switch (plan.type) {
    case "day":
      return (plan.num * price) as G;
    case "month":
      return Math.floor((price / 30) * plan.num) as G;
    case "year":
      return Math.floor((price / 365) * plan.num) as G;
  }
}
export function getDefaultDays(plan: DataBase.PlansType) {
  switch (plan) {
    case "day":
      return 1;
    case "month":
      return 30;
    case "year":
      return 365;
  }
}
const oneDay = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
function getDifferenceInDays(date1: Date, date2: Date) {
  const diffInTime = date2.getTime() - date1.getTime(); // Get the absolute difference in milliseconds
  const diffInDays = Math.floor(diffInTime / oneDay); // Convert to days and round up
  return diffInDays;
}

export function remainingDays(
  payment: Pick<
    DataBase.Models.Subscriptions,
    "plan" | "createdAt" | "startAt" | "endAt" | "logsCount"
  >
) {
  const days = payment.plan.num;
  // if (payment.separated) return days - curDays;
  const startDate = new Date(payment.startAt || payment.createdAt);
  const daysStarted = getDifferenceInDays(startDate, new Date());
  return Math.max(0, Math.min(days - daysStarted, days - payment.logsCount));
}
