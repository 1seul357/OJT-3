import { Shape } from "@svgdotjs/svg.js";

const getItem = (key: string) => {
  const value = localStorage.getItem(key);
  return value;
};

const setItem = (key: string, value: Shape) => {
  localStorage.setItem(
    key,
    value.type === "rect"
      ? JSON.stringify({
          type: "rect",
          index: value.dom,
          width: value.width(),
          height: value.height(),
          x: value.x(),
          y: value.y(),
          transform: value.transform(),
          fill: value.fill(),
        })
      : value.type === "circle"
      ? JSON.stringify({
          type: "circle",
          index: value.dom,
          width: value.width(),
          x: value.x(),
          y: value.y(),
          transform: value.transform(),
          fill: value.fill(),
        })
      : JSON.stringify({
          type: "polygon",
          index: value.dom,
          point: value.plot(),
          transform: value.transform(),
          fill: value.fill(),
        })
  );
};

export default { getItem, setItem };
