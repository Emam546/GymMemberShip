/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ExtractJwt } from "passport-jwt";

export const MixedExtract = () =>
  ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => {
      if (req && req.cookies)
        return (req.cookies as Record<string, string>).token;

      return null;
    },
  ]);
