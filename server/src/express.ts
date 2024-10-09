/* eslint-disable @typescript-eslint/no-namespace */
import express, { Response as ExpressResponse } from "express";
express.response.sendSuccess = function (data, msg = "Success") {
  return this.json({
    status: true,
    msg: msg,
    data: data,
  });
};
express.response.sendFailed = function (msg, err) {
  return this.json({
    status: false,
    msg: msg,
    err,
  });
};

declare global {
  namespace Express {
    interface Response {
      sendSuccess<T>(
        data: T,
        msg?: string
      ): ReturnType<ExpressResponse["json"]>;
      sendFailed(
        msg: string,
        err?: unknown
      ): ReturnType<ExpressResponse["json"]>;
    }
  }
}
