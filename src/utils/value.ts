import { Shape } from "@svgdotjs/svg.js";

export const value = (element: any) => {
  const item = {
    type:
      element.type === "rect"
        ? "rect"
        : element.type === "circle"
        ? "circle"
        : "polygon",
    width: element.width(),
    height: element.height(),
    x: element.x(),
    y: element.y(),
    point: element.plot ? element.plot() : null,
    transform: element.transform(),
    fill: element.fill(),
  };
  return item;
};
