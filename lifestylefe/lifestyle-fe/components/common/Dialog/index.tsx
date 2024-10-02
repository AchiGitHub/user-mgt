import React, { FC, ReactNode } from "react";
import {
  Dialog as MuiDialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface Props extends DialogProps {
  primaryLabel: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
}

const Dialog: FC<Props> = ({
  open,
  primaryLabel,
  onClose,
  children,
  primaryAction,
  ...rest
}) => {
  return (
    <MuiDialog open={open} onClose={onClose} {...rest}>
      <DialogTitle>{primaryLabel}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={() => primaryAction.onClick()}>
          {primaryAction.label}
        </Button>
      </DialogActions>
    </MuiDialog>
  );
};

export default Dialog;
