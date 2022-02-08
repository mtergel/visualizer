import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as Portal from "@radix-ui/react-portal";
import { HiX } from "@react-icons/all-files/hi/HiX";
import clsx from "clsx";
import IconButton from "components/IconButton/IconButton";
import { ReactNode } from "react";

interface DialogProps {
  content: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassname?: string;
}
const Dialog: React.FC<DialogProps> = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  contentClassname,
}) => {
  const merged = clsx("dialog-content", contentClassname);

  return (
    <DialogPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>

      <Portal.Root>
        <DialogPrimitive.Overlay
          className="dialog-overlay"
          data-testid="dialog-overlay"
        />
        <DialogPrimitive.Content className={merged}>
          {content}
          <DialogPrimitive.Close asChild>
            <IconButton
              className="absolute top-3 right-3"
              variant="ghost"
              aria-label="cross"
              icon={<HiX />}
            />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </Portal.Root>
    </DialogPrimitive.Root>
  );
};

const DialogClose = DialogPrimitive.Close;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;
export { DialogClose, DialogTitle, DialogDescription };
export default Dialog;
