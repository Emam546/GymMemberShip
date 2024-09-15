import {
    ForwardRefExoticComponent,
    PropsWithoutRef,
    RefAttributes,
    useRef,
} from "react";

export interface PrimaryProps {
    onDelete?: (this: HTMLDivElement) => any;
    onDuplicate?: (this: HTMLDivElement) => any;
    onDragOver?: (ele: HTMLDivElement) => any;
    onDrag?: (this: HTMLDivElement, ev: Event) => any;
    onDragStart?: (ele: HTMLDivElement) => any;
    noDragging?: boolean;
}
export interface ElemProps<P> extends PrimaryProps {
    index: number;
    props: P;
}
export type ElemType<P> = ForwardRefExoticComponent<
    PropsWithoutRef<ElemProps<P>> & RefAttributes<HTMLDivElement>
>;
export interface PSchema {
    id: string;
}
export default function ElemGenerator<P extends PSchema>({
    Elem,
    noDragging,
    onResort,
    onDelete: deleteSelf,
    data,
    onDuplicate: duplicate,
}: {
    Elem: ElemType<P>;
    data: P[];
    onDelete?: (id: string) => any;
    onDuplicate?: (id: string) => any;
    onResort?: (indexes: number[]) => void;
    noDragging?: boolean;
}) {
    const allEle = useRef<HTMLDivElement[]>([]);
    allEle.current.length = data.length;
    return (
        <div className="tw-flex tw-flex-col tw-items-stretch tw-space-y-4 tw-transition-all tw-duration-700">
            {data.map((props, i) => {
                return (
                    <Elem
                        onDuplicate={duplicate && (() => duplicate(props.id))}
                        noDragging={noDragging}
                        key={`${props.id}_${i}`}
                        index={i}
                        onDelete={
                            deleteSelf &&
                            (() => {
                                deleteSelf(props.id);
                            })
                        }
                        onDragOver={(ele) => {
                            const indexes = allEle.current
                                .map((ele, i) => {
                                    const rect = ele.getBoundingClientRect();
                                    return [
                                        rect.top +
                                            rect.height / 2 +
                                            window.scrollY,
                                        i,
                                    ];
                                })
                                .sort((a, b) => a[0] - b[0])
                                .map((val) => val[1]);
                            if (onResort) onResort(indexes);
                        }}
                        ref={(ele) => {
                            if (!ele) return;
                            allEle.current[i] = ele;
                        }}
                        props={props}
                    />
                );
            })}
        </div>
    );
}
