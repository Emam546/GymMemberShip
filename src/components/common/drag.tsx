import { faGripLinesVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useEffect, useState } from "react";

export default function DraggableComp({
    onDragOver,
    onDrag,
    onDragStart,
    parentDiv,
}: {
    parentDiv?: HTMLElement | null;
    onDragOver?: (ele: Window) => any;
    onDrag?: (this: Window, ev: Event) => any;
    onDragStart?: (ele: Window) => any;
}) {
    const [drag, setDrag] = useState(false);
    const [cord, setCord] = useState<[number, number]>([0, 0]);
    const [parentWidth, setWidth] = useState<string>("");
    const [dragStart, setDragStart] = useState(false);

    useEffect(() => {
        if (drag) {
            if (onDrag) {
                window.addEventListener("mousemove", onDrag);
                window.addEventListener("touchmove", onDrag);
            }
            setDragStart(true);
            if (!dragStart && onDragStart) onDragStart(window);
        } else {
            if (dragStart && onDragOver) onDragOver(window);
            setDragStart(false);
            if (onDrag) {
                window.removeEventListener("mousemove", onDrag);
                window.removeEventListener("touchmove", onDrag);
            }
        }
        return () => {
            if (onDrag) {
                window.removeEventListener("mousemove", onDrag);
                window.removeEventListener("touchmove", onDrag);
            }
        };
    }, [drag]);
    useEffect(() => {
        if (!parentDiv) return;
        function DragOver() {
            setDrag(false);
            if (!parentDiv) return;
            parentDiv.style.width = parentWidth;
        }
        function XYDragging(x: number, y: number) {
            if (!parentDiv) return;
            if (!drag) return;
            const [posX, posY] = cord;
            parentDiv.style.left = x - posX + "px";
            parentDiv.style.top = y - posY + "px";
        }
        function elementDrag(e: MouseEvent) {
            e.preventDefault();
            XYDragging(e.clientX, e.clientY);
        }
        function elementDragTouch(e: TouchEvent) {
            e.preventDefault();
            XYDragging(e.touches[0].clientX, e.touches[0].clientY);
        }
        window.addEventListener("mouseup", DragOver);
        window.addEventListener("mousemove", elementDrag);
        window.addEventListener("touchend", DragOver);
        window.addEventListener("touchmove", elementDragTouch);
        return () => {
            window.removeEventListener("mouseup", DragOver);
            window.removeEventListener("mousemove", elementDrag);
            window.removeEventListener("touchend", DragOver);
            window.removeEventListener("touchmove", elementDragTouch);
        };
    }, [parentDiv, drag, cord, parentWidth]);
    function StartDragging(x: number, y: number) {
        if (!parentDiv) return;
        const rect = parentDiv.getBoundingClientRect();
        const posX = x - rect.left;
        const posY = y - rect.top;
        parentDiv.style.left = x - posX + "px";
        parentDiv.style.top = y - posY + "px";
        setWidth(parentDiv.style.width);
        parentDiv.style.width = parentDiv.offsetWidth + "px";
        setCord([posX, posY]);
        setDrag(true);
    }
    return (
        <div
            className={classNames("tw-absolute -tw-left-4 tw-touch-none", {
                "tw-cursor-grab": !drag,
                "tw-cursor-grabbing": drag,
            })}
            onTouchStart={(e) => {
                if (!parentDiv) return;
                e.preventDefault();
                StartDragging(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onMouseDown={(e) => {
                if (!parentDiv) return;
                e.preventDefault();
                StartDragging(e.clientX, e.clientY);
            }}
        >
            <FontAwesomeIcon icon={faGripLinesVertical} />
        </div>
    );
}
