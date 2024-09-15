import { RawDraftContentState } from "draft-js";

export function isRawDraftContentStateEmpty(
    rawContentState: RawDraftContentState
) {
    if (
        !rawContentState ||
        !rawContentState.blocks ||
        rawContentState.blocks.length === 0
    ) {
        // If the rawContentState is undefined, has no "blocks" array, or the "blocks" array is empty, consider it empty.
        return true;
    }

    // Check if all block objects have empty text content
    return rawContentState.blocks.every((block) => block.text.trim() === "");
}
