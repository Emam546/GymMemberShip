import React from "react";
import dynamic from "next/dynamic";
import { EditorProps } from "react-draft-wysiwyg";
import { EditorState, RawDraftContentState, convertFromRaw } from "draft-js";
const Editor = dynamic<EditorProps>(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr: false }
);

type Props = {
    defaultValue?: RawDraftContentState;
    disabled?: boolean;
} & EditorProps;

const toolbar = {
    options: [
        "inline",
        "list",
        "textAlign",
        "colorPicker",
        "link",
        "emoji",
        "image",
        "remove",
        "history",
    ],
};

const FinalEditor = React.forwardRef<HTMLInputElement, Props>(
    ({ defaultValue, placeholder, disabled, ...props }, ref) => {
        return (
            <div
                aria-disabled={disabled}
                className="tw-bg-neutral-100 aria-disabled:tw-bg-neutral-300"
            >
                <Editor
                    editorClassName="tw-min-h-[10rem] tw-px-3 tw-max-w-full"
                    defaultEditorState={
                        defaultValue &&
                        EditorState.createWithContent(
                            convertFromRaw(defaultValue)
                        )
                    }
                    placeholder={placeholder}
                    toolbar={toolbar}
                    handlePastedText={() => false}
                    {...props}
                />
            </div>
        );
    }
);

export default FinalEditor;
