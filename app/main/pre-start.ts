import dotenv from "dotenv";
// **NOTE** Do not import any local paths here, or any libraries dependent
// on environment variables.

// **** Setup command line options **** //

// **** Set the env file **** //

const result2 = dotenv.config({
  path: `${process.env.NODE_ENV}.env`,
});

if (result2.error) {
  throw result2.error;
}
