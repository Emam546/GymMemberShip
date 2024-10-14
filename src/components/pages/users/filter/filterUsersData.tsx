import { useForm } from "react-hook-form";
import { ObjectEntries } from "@src/utils";
import { WrapElem } from "@src/components/common/inputs/styles";
import { useTranslation } from "react-i18next";
import RangeTracker from "@src/components/common/inputs/range";
import { useEffect } from "react";

export interface DataType {
  ageMin?: number;
  ageMax?: number;
  tallMin?: number;
  tallMax?: number;
}
interface FormData {
  age: [number, number];
  tall: [number, number];
}
export interface Props {
  onData: (data: DataType) => Promise<any> | any;
  values?: FormData;
}
const ages = [undefined, 10, 15, 20, 25, 30, 40, 50, undefined];
const agesLabel = ["0", 10, 15, 20, 25, 30, 40, 50, "+50"];
const talls = [undefined, 140, 150, 160, 170, 180, 190, 200, undefined];
const tallsLabel = [
  "100",
  ...talls.filter((val) => val != undefined).map((val) => `${val}cm`),
  "+200",
];
export default function FilterUsersData({ onData }: Props) {
  const { t } = useTranslation("filter:users");
  const { handleSubmit, setValue, watch, getValues } = useForm<FormData>({
    defaultValues: {
      age: [0, ages.length - 1],
      tall: [0, talls.length - 1],
    },
  });
  function Update() {
    const data = getValues();
    const g = Object.fromEntries(
      ObjectEntries({
        ageMin: ages[data.age[0]],
        ageMax: ages[data.age[1]],
        tallMin: talls[data.tall[0]],
        tallMax: talls[data.tall[1]],
      }).filter(([, val]) => val)
    );
    onData(g);
  }
  return (
    <div className="tw-pb-10">
      <WrapElem label="Age">
        <RangeTracker
          length={ages.length - 1}
          start={watch("age.0")}
          end={watch("age.1")}
          values={agesLabel}
          setValues={function (start: number, end: number) {
            setValue("age", [start, end]);
            Update();
          }}
        />
      </WrapElem>
      <WrapElem label="Tall" className="tw-mt-10">
        <RangeTracker
          length={talls.length - 1}
          start={watch("tall.0")}
          end={watch("tall.1")}
          values={tallsLabel}
          setValues={function (start: number, end: number) {
            setValue("tall", [start, end]);
            Update();
          }}
        />
      </WrapElem>
    </div>
  );
}
