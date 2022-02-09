import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import { ReactNode } from "react";

type DrawerSide = "right" | "bottom" | "left";

interface DrawerProps {
  content: ReactNode;
  side?: DrawerSide;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassname?: string;
}

const getSideCx = (side?: DrawerSide) => {
  switch (side) {
    case "bottom": {
      return "drawer-content-bottom";
    }

    case "right": {
      return "drawer-content-right";
    }

    case "left": {
      return "drawer-content-left";
    }

    default:
      return "drawer-content-right";
  }
};

const Drawer: React.FC<DrawerProps> = ({
  content,
  open,
  defaultOpen,
  onOpenChange,
  contentClassname,
  side,
  children,
}) => {
  const merged = clsx("drawer-content", getSideCx(side), contentClassname);

  return (
    <DialogPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="drawer-overlay" />
        <DialogPrimitive.Content className={merged}>
          <div className="flex flex-col h-full">{content}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

const DrawerClose = DialogPrimitive.Close;
export { DrawerClose };
export default Drawer;
