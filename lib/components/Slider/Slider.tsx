import * as SliderPrimitive from "@radix-ui/react-slider";
import { forwardRef } from "react";

const Slider = forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentProps<typeof SliderPrimitive.Root>
>((props, forwardRef) => {
  const { children, ...itemProps } = props;
  return (
    <SliderPrimitive.Root
      {...itemProps}
      className="slider"
      ref={forwardRef}
      data-testid="slider"
    >
      <SliderPrimitive.Track className="track">
        <SliderPrimitive.Range className="range" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="thumb" />
      {children}
    </SliderPrimitive.Root>
  );
});

const SliderThumb = SliderPrimitive.Thumb;
export { SliderThumb };
Slider.displayName = "Slider";
export default Slider;
