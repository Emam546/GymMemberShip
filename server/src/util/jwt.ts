import EnvVars from "@serv/declarations/major/EnvVars";
import jwt, { SignOptions } from "jsonwebtoken";

export function sign(payload: string | object | Buffer, options?: SignOptions) {
  return jwt.sign(payload, EnvVars.jwt.secret, {
    ...options,
    ...EnvVars.jwt.options,
  });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decode<T = any>(token: string): T {
  return jwt.verify(token, EnvVars.jwt.secret) as T;
}
