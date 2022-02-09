import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import clsx from "clsx";
import { forwardRef } from "react";

export const RadioGroup = RadioGroupPrimitive.Root;

export const RadioGroupRadio = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentProps<typeof RadioGroupPrimitive.Item>
>(({ children, className, ...rest }, forwardedRef) => {
  const merged = clsx("radio-item", className);
  return (
    <RadioGroupPrimitive.Item {...rest} className={merged} ref={forwardedRef}>
      {children}
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupRadio.displayName = "RadioGroupRadio";

export const RadioGroupIndicator = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Indicator>,
  React.ComponentProps<typeof RadioGroupPrimitive.Indicator>
>(({ children, className, ...rest }, forwardedRef) => {
  const merged = clsx("radio-item-indicator", className);
  return (
    <RadioGroupPrimitive.Indicator
      {...rest}
      className={merged}
      ref={forwardedRef}
    >
      {children}
    </RadioGroupPrimitive.Indicator>
  );
});

RadioGroupIndicator.displayName = "RadioGroupIndicator";
