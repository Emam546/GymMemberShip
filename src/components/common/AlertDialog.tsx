import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";

export interface Props {
    onAccept: () => any;
    onClose: () => any;
    open: boolean;
    data: {
        desc: string;
        title: string;
        accept: string;
        deny: string;
    };
    submitting?: boolean;
}
export default function DeleteDialog({
    submitting,
    open,
    onAccept,
    onClose,
    data: { desc, accept, deny, title },
}: Props) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {desc}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <div className="tw-w-full tw-px-4 tw-pb-3 tw-flex tw-gap-x-5 tw-justify-center md:tw-justify-end">
                    <Button
                        onClick={onAccept}
                        color="error"
                        variant="outlined"
                        disabled={submitting}
                    >
                        {accept}
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        className="tw-bg-blue-600"
                    >
                        {deny}
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
}
