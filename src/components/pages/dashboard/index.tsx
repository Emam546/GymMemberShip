import {
  MonthlyEarnings,
  YearlyBreakUp,
  SalesOverView as SalesOverViewChart,
} from "@src/components/pages/dashboard/charts";
import "./locales";
import { ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@src/i18n";
export interface YearsAndMonthEarningsProps {
  yearsEarnings: DataBase.Queries.Payments.Profit[];
  monthEarnings: DataBase.Queries.Payments.Profit[];
  lastMonthEarning?: DataBase.Queries.Payments.Profit;
}
interface PercentProps extends ComponentProps<"p"> {
  increasing: number;
}
export function Percent({ increasing, ...props }: PercentProps) {
  return (
    <div className="pb-1 d-flex align-items-center">
      <span className="me-1 rounded-circle bg-light-success round-20 d-flex align-items-center justify-content-center">
        {increasing > 0 ? (
          <i className="ti ti-arrow-up-left text-success" />
        ) : (
          <i className="ti ti-arrow-down-right text-danger" />
        )}
      </span>
      <p className="mb-0 text-dark me-1 fs-3">+{increasing}%</p>
      <p className="mb-0 fs-3" {...props} />
    </div>
  );
}
export function YearsAndMonthEarnings({
  yearsEarnings,
  monthEarnings,
  lastMonthEarning,
}: YearsAndMonthEarningsProps) {
  const currentYear = yearsEarnings.find(
    (val) => val._id.year == new Date().getFullYear()
  )!;
  const lastYear = yearsEarnings.find(
    (val) => val._id.year == new Date().getFullYear() - 2
  );
  const yearIncreasing = lastYear
    ? (currentYear.profit / (lastYear.profit || 1)) * 100 - 100
    : 100;
  const totalMonthEarnings = monthEarnings.reduce(
    (acc, cur) => acc + cur.profit,
    0
  );
  const monthIncreasing = lastMonthEarning
    ? (totalMonthEarnings / (lastMonthEarning.profit || 1)) * 100 - 100
    : 100;
  const { t } = useTranslation("dashboard");

  return (
    <div className="col-lg-4">
      <div className="row">
        <div className="col-lg-12">
          {/* Yearly Breakup */}
          <div className="overflow-hidden card">
            <div className="p-4 card-body">
              <h5 className="card-title mb-9 fw-semibold">
                {t("Yearly Breakup")}
              </h5>
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="mb-3 fw-semibold">${currentYear?.profit}</h4>
                  <Percent increasing={yearIncreasing}>
                    {t("last year")}
                  </Percent>
                  <div className="d-flex align-items-center">
                    <div className="me-4">
                      <span className="round-8 bg-primary rounded-circle me-2 d-inline-block" />
                      <span className="fs-2">{new Date().getFullYear()}</span>
                    </div>
                    <div>
                      <span className="round-8 bg-light-primary rounded-circle me-2 d-inline-block" />
                      <span className="fs-2">
                        {new Date().getFullYear() - 1}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="d-flex justify-content-center">
                    <YearlyBreakUp
                      series={yearsEarnings.map((val) => ({
                        num: val.profit,
                        label: val._id.year!.toString(),
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          {/* Monthly Earnings */}
          <div className="card">
            <div className="card-body">
              <div className="row alig n-items-start">
                <div className="col-8">
                  <h5 className="card-title mb-9 fw-semibold">
                    {t("Monthly Earnings")}
                  </h5>
                  <h4 className="mb-3 fw-semibold">${totalMonthEarnings}</h4>
                  <Percent increasing={monthIncreasing}>
                    {t("last month")}
                  </Percent>
                </div>
                <div className="col-4">
                  <div className="d-flex justify-content-end">
                    <div className="p-6 text-white bg-secondary rounded-circle d-flex align-items-center justify-content-center">
                      <i className="ti ti-currency-dollar fs-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <MonthlyEarnings series={monthEarnings.map((val) => val.profit)} />
          </div>
        </div>
      </div>
    </div>
  );
}
export interface RecentPaymentsProps {
  payments: DataBase.WithId<
    DataBase.Models.Payments & {
      userId: DataBase.WithId<DataBase.Models.User>;
    }
  >[];
}
function formatTimeToString(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  // Convert hours from 24-hour to 12-hour format
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${period}`;
}
export function RecentPayments({ payments }: RecentPaymentsProps) {
  const { t } = useTranslation("index");
  return (
    <div className="col-lg-4 d-flex align-items-stretch">
      <div className="card w-100">
        <div className="p-4 card-body">
          <div className="mb-4">
            <h5 className="card-title fw-semibold">
              {t("Recent Transactions")}
            </h5>
          </div>
          <ul className="timeline-widget position-relative tw-my-1">
            {payments.map((val) => {
              const date = new Date(val.createdAt);
              return (
                <li
                  key={val._id}
                  className="overflow-hidden timeline-item d-flex position-relative"
                >
                  <div className="flex-shrink-0 timeline-time text-dark text-end">
                    {formatTimeToString(date)}
                  </div>
                  <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                    <span className="flex-shrink-0 my-8 border border-2 timeline-badge border-primary" />
                    <span className="flex-shrink-0 timeline-badge-border d-block" />
                  </div>
                  <div className="timeline-desc fs-3 text-dark mt-n1">
                    Payment received from {val.userId.name} of $
                    {`${val.paid.num} ${val.paid.type}`}
                  </div>
                </li>
              );
            })}
            {/* <li className="overflow-hidden timeline-item d-flex position-relative">
              <div className="flex-shrink-0 timeline-time text-dark text-end">
                09:30
              </div>
              <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                <span className="flex-shrink-0 my-8 border border-2 timeline-badge border-primary" />
                <span className="flex-shrink-0 timeline-badge-border d-block" />
              </div>
              <div className="timeline-desc fs-3 text-dark mt-n1">
                Payment received from John Doe of $385.90
              </div>
            </li> */}
            {/* <li className="overflow-hidden timeline-item d-flex position-relative">
              <div className="flex-shrink-0 timeline-time text-dark text-end">
                10:00 am
              </div>
              <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                <span className="flex-shrink-0 my-8 border border-2 timeline-badge border-info" />
                <span className="flex-shrink-0 timeline-badge-border d-block" />
              </div>
              <div className="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                New sale recorded{" "}
                <a
                  href="javascript:void(0)"
                  className="text-primary d-block fw-normal"
                >
                  #ML-3467
                </a>
              </div>
            </li>
            <li className="overflow-hidden timeline-item d-flex position-relative">
              <div className="flex-shrink-0 timeline-time text-dark text-end">
                12:00 am
              </div>
              <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                <span className="flex-shrink-0 my-8 border border-2 timeline-badge border-success" />
                <span className="flex-shrink-0 timeline-badge-border d-block" />
              </div>
              <div className="timeline-desc fs-3 text-dark mt-n1">
                Payment was made of $64.95 to Michael
              </div>
            </li>
            <li className="overflow-hidden timeline-item d-flex position-relative">
              <div className="flex-shrink-0 timeline-time text-dark text-end">
                09:30 am
              </div>
              <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                <span className="flex-shrink-0 my-8 border border-2 timeline-badge border-warning" />
                <span className="flex-shrink-0 timeline-badge-border d-block" />
              </div>
              <div className="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                New sale recorded{" "}
                <a
                  href="javascript:void(0)"
                  className="text-primary d-block fw-normal"
                >
                  #ML-3467
                </a>
              </div>
            </li>
            <li className="overflow-hidden timeline-item d-flex position-relative">
              <div className="flex-shrink-0 timeline-time text-dark text-end">
                09:30 am
              </div>
              <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                <span className="flex-shrink-0 my-8 border border-2 timeline-badge border-danger" />
                <span className="flex-shrink-0 timeline-badge-border d-block" />
              </div>
              <div className="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                New arrival recorded
              </div>
            </li>
            <li className="overflow-hidden timeline-item d-flex position-relative">
              <div className="flex-shrink-0 timeline-time text-dark text-end">
                12:00 am
              </div>
              <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                <span className="flex-shrink-0 my-8 border border-2 timeline-badge border-success" />
              </div>
              <div className="timeline-desc fs-3 text-dark mt-n1">
                Payment Done
              </div>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}
export interface SalesOverViewProps {
  months: { date: Date; data: DataBase.Queries.Payments.Profit[] }[];
}
function useGetMonth() {
  const { i18n } = useTranslation();
  return (date: Date) =>
    new Intl.DateTimeFormat(i18n.language, { month: "long" }).format(date);
}
export function SalesOverView({ months }: SalesOverViewProps) {
  const getMonthName = useGetMonth();
  months = months
    .map((val) => ({
      data: val.data,
      date: new Date(val.date),
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  const [curMonth, setCurMonth] = useState(new Date().getMonth());
  const { t } = useTranslation("dashboard");
  return (
    <div className="col-lg-8 d-flex align-items-strech">
      <div className="card w-100">
        <div className="card-body">
          <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
            <div className="mb-3 mb-sm-0">
              <h5 className="card-title fw-semibold">{t("Sales OverView")}</h5>
            </div>
            <div>
              <select
                onChange={(e) => {
                  setCurMonth(parseInt(e.currentTarget.value));
                }}
                value={curMonth}
                className="form-select"
              >
                {months.map((val) => {
                  return (
                    <option
                      key={val.date.getTime().toString()}
                      value={val.date.getMonth()}
                    >
                      {getMonthName(val.date)}{" "}
                      {new Date(val.date).getFullYear()}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <SalesOverViewChart
            data={
              months
                .find((val) => val.date.getMonth() == curMonth)
                ?.data.map((val) => {
                  return {
                    label: `${val._id.month}/${val._id.day}`,
                    num: val.profit,
                  };
                }) || []
            }
          />
        </div>
      </div>
    </div>
  );
}
