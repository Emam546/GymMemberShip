export function paidType(
  plan: DataBase.Models.Payments["plan"],
  price: number
) {
  switch (plan.type) {
    case "day":
      return plan.num * price;
    case "month":
      return Math.floor((price / 30) * plan.num);
    case "year":
      return Math.floor((price / 365) * plan.num);
  }
  return 0;
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
function getDifferenceInDays(date1: Date, date2: Date) {
  const oneDay = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
  const diffInTime = date2.getTime() - date1.getTime(); // Get the absolute difference in milliseconds
  const diffInDays = Math.floor(diffInTime / oneDay); // Convert to days and round up
  return diffInDays;
}
export function remainingDays(
  payment: Pick<
    DataBase.Models.Payments,
    "plan" | "createdAt" | "separated" | "startAt"
  >,
  curDays: number
) {
  const days = payment.plan.num;
  if (payment.separated) return days - curDays;
  const startDate = new Date(payment.startAt || payment.createdAt);
  const daysStarted = getDifferenceInDays(startDate, new Date());
  return Math.max(0, days - daysStarted);
}
