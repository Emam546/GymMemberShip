import React from "react";
import { Range } from "react-range";

export interface RangeProps {
  length: number;
  start: number;
  end: number;
  values: React.ReactNode[];
  setValues(start: number, end: number): unknown;
}
export default function RangeTracker({
  length,
  start,
  end,
  values,
  setValues,
}: RangeProps) {
  return (
    <div dir="ltr">
      <Range
        label="Select your value"
        step={1}
        min={0}
        max={length}
        values={[start, end]}
        onChange={([newStart, newEnd]) => {
          const MaxStart = Math.max(Math.min(length, 1), end - 1);
          const MinEnd = Math.max(Math.min(length, 1), start + 1);
          const options = [
            Math.min(newStart, MaxStart),
            Math.min(Math.max(newEnd, MinEnd), length),
          ] as [number, number];
          setValues(...options);
        }}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="tw-bg-gray-300 tw-h-2 tw-rounded tw-relative tw-w-full"
          >
            <div
              className="tw-absolute tw-h-full tw-bg-blue-300"
              style={{
                width: `${((end - start) / length) * 100}%`,
                left: `${(start / length) * 100}%`,
              }}
            ></div>

            <div className="tw-w-full tw-top-full tw-absolute tw-mt-1">
              {values.map((val, i) => {
                return (
                  <div
                    key={i}
                    className="tw-absolute tw-top-0 -tw-translate-x-1/2"
                    style={{ left: `${(i / length) * 100}%` }}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            key={props.key}
            className="tw-h-5 tw-w-5 bg-primary tw-rounded-full"
          />
        )}
      />
    </div>
  );
}
