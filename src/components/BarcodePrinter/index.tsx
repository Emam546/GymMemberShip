import React, {
  ComponentRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Logo from "@sources/src/logo.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Barcode from "react-barcode";
import i18n from "@src/i18n";
import { useTranslation } from "react-i18next";
import { createContext, useState } from "react";
import { formateDate } from "@src/utils";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import EnvVars from "@serv/declarations/major/EnvVars";

export function Group({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="tw-px-5 tw-py-3 tw-bg-[#0F5424] tw-text-gray-200">
        {title}
      </div>
      <div className="tw-px-2 tw-py-3 tw-flex-1 tw-bg-[#FFE49E] tw-text-[#6E6F6E]">
        {children}
      </div>
    </>
  );
}

// Create a Context
type Doc = DataBase.Populate.Model<
  DataBase.WithId<DataBase.Models.Payments>,
  "userId" | "planId" | "trainerId"
>;
type State = {
  setUser(data: Doc): Promise<jsPDF>;
};
export const BarCodeContext = createContext<State>({
  setUser() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Promise(() => {});
  },
});

// Create a Provider Component
const margins = 0;
export const BarcodePrintProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ref = useRef<ComponentRef<"div">>(null);
  const { t } = useTranslation("barcode:print");
  const [{ id, doc: payment }, setPayment] = useState<{
    id: number;
    doc?: Doc;
  }>({
    id: Date.now(),
  });
  const result = useMemo<
    Array<(val: Awaited<ReturnType<State["setUser"]>>) => void>
  >(() => [], []);
  useEffect(() => {
    if (!payment || result.length == 0) return;
    (async () => {
      const doc = new jsPDF();
      if (!ref.current) return;
      const input = ref.current;
      const canvas = await html2canvas(input);
      const pageWidth = doc.internal.pageSize.getWidth();

      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", margins, margins, pageWidth - margins, 0);
      result.forEach((val) => {
        val(doc);
      });
      result.length = 0;
      return;
    })();
  }, [id]);

  return (
    <>
      {/*  */}
      <div className="tw-fixed tw-top-0 tw-left-0 -tw-z-[100000] tw-appearance-none tw-opacity-0">
        <div ref={ref}>
          <div className="tw-grid tw-grid-cols-[auto,1fr] tw-grid-rows-1">
            <div className="tw-w-[30rem] tw-text-center">
              <div className="px-2 tw-py-2 tw-bg-[#B91118]">
                <h4 className="tw-m-0 tw-text-gray-100 tw-font-bold">
                  {EnvVars.GYM.barcode.title}
                </h4>
              </div>
              <div className="tw-grid tw-grid-cols-[auto,1fr] tw-font-semibold">
                <Group title={t("data.name")}>{payment?.userId?.name}</Group>
                <Group title={t("data.type")}>{payment?.planId?.name}</Group>
                <Group title={t("data.startDate")}>
                  {payment?.startAt
                    ? formateDate(new Date(payment?.startAt))
                    : undefined}
                </Group>
                <Group title={t("data.endDate")}>
                  {payment?.endAt
                    ? formateDate(new Date(payment?.endAt))
                    : undefined}
                </Group>
                <Group title={t("data.trainer.label")}>
                  {payment?.trainerId ? payment.trainerId.name : undefined}
                </Group>
              </div>
              <div className="tw-px-5 tw-mt-3">
                <div className="tw-flex tw-mx-auto">
                  <Barcode
                    height={80}
                    displayValue={false}
                    margin={"0px" as unknown as number}
                    value={"670118be1681bf319ceacf47"}
                  />
                </div>
                <div className="tw-w-full tw-flex tw-justify-center">
                  <p className="mb-0">{"670118be1681bf319ceacf47"}</p>
                </div>
              </div>
            </div>
            <div className="tw-bg-[#1D1D1A] tw-h-full tw-flex-1 tw-max-w-fit tw-flex tw-items-center">
              <img
                src={Logo.src}
                alt="Logo"
                className="tw-p-6 tw-max-w-[20rem] tw-w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <BarCodeContext.Provider
        value={{
          setUser: (data) => {
            setPayment({ doc: data, id: Date.now() });
            return new Promise((res) => {
              result.push((...data) => res(...data));
            });
          },
        }}
      >
        {children}
      </BarCodeContext.Provider>
    </>
  );
};
export function usePrintBarCode({
  ...opt
}: Omit<
  UseMutationOptions<
    Awaited<ReturnType<State["setUser"]>>,
    unknown,
    Parameters<State["setUser"]>,
    unknown
  >,
  "mutationFn"
>) {
  const print = useContext(BarCodeContext).setUser;
  return useMutation({
    mutationFn(doc: Parameters<State["setUser"]>) {
      return print(...doc);
    },
    ...opt,
  });
}

declare global {
  namespace I18ResourcesType {
    interface Resources {
      "barcode:print": {
        data: {
          name: "User Name";
          type: "payment Type";
          startDate: "Start Date";
          endDate: "End Date";
          trainer: {
            notExist: "Not Exist";
            label: "Trainer Name";
          };
        };
      };
    }
  }
}
i18n.addLoadUrl("/components/barcode/print", "barcode:print");
