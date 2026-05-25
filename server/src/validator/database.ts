
import Validator, { AvailableRules } from "validator-checker-js";
import { MessagesStore } from "validator-checker-js/dist/Rule";
import mongoose from "mongoose";
import { hasOwnProperty } from "@serv/util";
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
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
      hasOwnProperty(value, "existedId") &&
      hasOwnProperty(value.existedId, "path")
    );
  },
  async (id, data) => {
    if (typeof id != "string") return "the id is not a string";
    if (!mongoose.Types.ObjectId.isValid(id)) return "the id is not a string";

    const res: Document | null = await mongoose
      .model(data.existedId.path)
      .findById(id);
    if (!res) return `the id is not exist in ${data.existedId.path}`;
    return undefined;
  },
  {}
);
