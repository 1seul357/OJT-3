import { Shape } from "@svgdotjs/svg.js";

export const value = (element: Shape, matrix?: Object) => {
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
    point: element.type === "polygon" ? element.plot() : null,
    transform: matrix ? matrix : element.transform(),
    fill: element.fill(),
  };
  return item;
};
