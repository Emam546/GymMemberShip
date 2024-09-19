import { AxiosError } from "axios";
import React from "react";
export interface Props {
  error?: Error | unknown;
  loading?: boolean;
}
export default function ErrorShower({ error, loading }: Props) {
  return (
    <>
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <>
          {error && (
            <div>
              <p className="tw-text-red-600">
                {error instanceof Error ? error.message : JSON.stringify(error)}
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
