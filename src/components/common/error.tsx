import { FirestoreError } from "firebase/firestore";
import React from "react";
export interface Props {
    error?: FirestoreError | null;
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
                            <h3>{error.code}</h3>
                            <h3>{error.name}</h3>
                            <p className="tw-text-red-600">{error.message}</p>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
