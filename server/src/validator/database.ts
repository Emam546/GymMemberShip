/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-namespace */
import Validator, { AvailableRules } from "validator-checker-js";
import { MessagesStore } from "validator-checker-js/dist/Rule";
import ramda from "ramda";
import mongoose from "mongoose";
declare global {
  namespace Validator {
    interface AvailableRules {
      existedId: {
        type: string;
        path: { existedId: { path: string } };
        errors: MessagesStore<{
          existedId: { path: string };
        }>;
      };
    }
  }
}

Validator.register(
  "existedId",
  (value: unknown): value is AvailableRules["existedId"]["path"] => {
    return (
      ramda.has("existedId", value) &&
      ramda.has("path", value.existedId) &&
      ramda.is(String, value.existedId.path)
    );
  },
  async (id, data) => {
    if (!ramda.is(String, id)) return "the id is not a string";
    if (!mongoose.Types.ObjectId.isValid(id)) return "the id is not a string";

    const res: Document | null = await mongoose
      .model(data.existedId.path)
      .findById(id);
    if (!res) return `the id is not exist in ${data.existedId.path}`;
    return undefined;
  },
  {}
);
