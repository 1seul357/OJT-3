import { Svg, Container } from "@svgdotjs/svg.js";

export const Select = (draw: Svg, group: Container, className: string) => {
  const box = group.bbox();

  const select = draw
    .rect(box.width, box.height)
    .x(box.x)
    .y(box.y)
    .addClass(className)
    .attr({ fill: "#ffffff66" })
    .stroke({ color: "#00000099" });

  return select;
};
