import { Polygon, Shape } from "@svgdotjs/svg.js";
import { dataType } from "./interface";

export const value = (element: Shape) => {
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
    transform: element.transform(),
    fill: element.fill(),
  };
  return item;
};
