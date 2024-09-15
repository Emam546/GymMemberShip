import Validator, { AvailableRules } from "validator-checker-js";
import { MessagesStore } from "validator-checker-js/dist/Rule";
import ramda from "ramda";
import mongoose from "mongoose";
declare module "validator-checker-js/dist/type" {
  interface AvailableRules {
    existedId: {
      type: string;
      path: { existedId: { path: "users" | "plans" | "transactions" } };
      errors: MessagesStore<{
        existedId: { path: "users" | "plans" | "transactions" };
      }>;
    };
  }
}

Validator.register(
  "existedId",
  (value): value is AvailableRules["existedId"]["path"] => {
    return (
      ramda.has("existedId", value) &&
      ramda.has("path", value.existedId) &&
      ramda.is(String, value.existedId.path)
    );
  },
  async (id, data) => {
    if (!ramda.is(String, id)) return "the id is not a string";
    const res: Document | null = await mongoose
      .model(data.existedId.path)
      .findById(id);

    if (!res) return `the id is not exist in ${data.existedId.path}`;
    return undefined;
  },
  {}
);
