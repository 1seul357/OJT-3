import { Container, Shape, Svg } from "@svgdotjs/svg.js";

export const dragAndDrop = (
  g: Container,
  draw: Svg,
  e: MouseEvent,
  controller: Function,
  makeController: Function
) => {
  const x = Number(g.x());
  const y = Number(g.y());
  const startPoint = draw.point(e.clientX, e.clientY);

  const moveHandler = (e: MouseEvent) => {
    controller();
    const newPoint = draw.point(e.clientX, e.clientY);
    g.x(x + newPoint.x - startPoint.x).y(y + newPoint.y - startPoint.y);
  };

  const upHandler = () => {
    controller();
    draw.off("mousemove", moveHandler as EventListener);
    draw.off("mouseup", upHandler);
    controller = makeController();
  };
  draw.on("mousemove", moveHandler as EventListener);
  draw.on("mouseup", upHandler);
};
