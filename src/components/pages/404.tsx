import React from "react";
import { MainCard } from "../card";
export interface Message {
  message?: string;
  state?: string;
}
export default function Page404({
  message = "The Url is not exist",
  state = "404",
}: Message) {
  return (
    <div className="card tw-flex-1 tw-flex tw-justify-center tw-items-center tw-mb-0 tw-py-10">
      <div className="tw-text-center tw-w-fit tw-h-fit">
        <h2 className="tw-text-4xl tw-font-semibold">{state}</h2>
        {message != undefined && <p>{message}</p>}
      </div>
    </div>
  );
}
