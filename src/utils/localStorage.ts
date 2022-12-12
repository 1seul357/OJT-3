import { Shape } from "@svgdotjs/svg.js";

function setItem(key: string, value: Shape) {
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
          fill: value.fill(),
        })
      : value.type === "circle"
      ? JSON.stringify({
          type: "circle",
          index: value.dom,
          width: value.width(),
          x: value.x(),
          y: value.y(),
          fill: value.fill(),
        })
      : JSON.stringify({
          type: "polygon",
          index: value.dom,
          point: value.plot(),
          fill: value.fill(),
        })
  );
}

export default { setItem };
