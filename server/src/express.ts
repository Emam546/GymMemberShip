/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IncomingMessage } from "http";
import { Response } from "express";
IncomingMessage.prototype.sendData = function (...a) {
  return (this as unknown as Response).json(...a);
};
declare module "express" {
  interface Response {
    sendData(...a: Parameters<Response["json"]>): ReturnType<Response["json"]>;
  }
}
declare module "http" {
  interface IncomingMessage {
    sendData(...a: Parameters<Response["json"]>): ReturnType<Response["json"]>;
  }
}
