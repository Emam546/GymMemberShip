/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
const config: Config = {
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "./tsconfig.test.json" }],
  },
  roots: ["<rootDir>/"],
  testMatch: ["**/?(*.)+(spec|test).+(ts|js)"],
  testEnvironment: "node",
  preset: "ts-jest",
  moduleFileExtensions: ["ts", "tsx", "js", "json", "css"],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(
      {
        "@src/*": ["./src/*"],
        "@serv/*": ["./server/src/*"],
        "@shared/*": ["./shared/*"],
        "@utils/*": ["./utils/*"],
        "@test/*": ["./server/spec/*"],
      },
      {
        prefix: "<rootDir>/",
      }
    ),
  },
};
export default config;
