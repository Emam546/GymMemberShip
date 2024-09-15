import classNames from "classnames";
import ElemGenerator, {
    ElemType as OrgElemType,
    PSchema,
    ElemProps as OrgElemProps,
} from "./EleGen";
import React from "react";
export interface ListProps<T> extends PSchema {
    data: T;
}

export type ElemType<T> = OrgElemType<ListProps<T>>;

export interface Props<T extends PSchema> {
    Elem: ElemType<T>;
    data: T[];
    noDragging?: boolean;
    onDeleteElem?: (v: T) => any;
    onResort?: (v: number[]) => any;
}
export const CreateElem = function <T = {}>(
    ...values: Parameters<
        typeof React.forwardRef<HTMLDivElement, OrgElemProps<ListProps<T>>>
    >
) {
    return React.forwardRef<HTMLDivElement, OrgElemProps<ListProps<T>>>(
        ...values
    );
};
export default function InfoGetter<T extends PSchema>({
    Elem,
    noDragging,
    onDeleteElem,
    onResort,
    data,
}: Props<T>) {
    return (
        <>
            <div
                className={classNames({
                    "pl-5": !noDragging,
                })}
            >
                <ElemGenerator
                    noDragging={noDragging}
                    Elem={Elem}
                    data={data.map((val, i) => ({
                        index: i,
                        id: val.id,
                        data: val,
                    }))}
                    onResort={(indexes) => {
                        onResort && onResort(indexes);
                    }}
                    onDelete={(xid) => {
                        if (!onDeleteElem) return;
                        const val = data.find((v) => v.id == xid);
                        val && onDeleteElem(val);
                    }}
                />
            </div>
        </>
    );
}
