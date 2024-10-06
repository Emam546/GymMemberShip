/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RequestHandler } from "express";

export default function parseMultiFormData() {
  return (...[req, res, next]: Parameters<RequestHandler>) => {
    if (req.headers["content-type"]?.startsWith("multipart/form-data"))
      if (req.body["data"]) req.body["data"] = JSON.parse(req.body["data"]);
    next();
  };
}
