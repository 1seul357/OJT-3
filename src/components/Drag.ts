import { Container, Svg } from "@svgdotjs/svg.js";

export const dragItem = (draw: Svg, group: Container) => {
  group.mousedown((e: MouseEvent) => {
    const x = Number(group.x());
    const y = Number(group.y());
    const startPoint = draw.point(e.clientX, e.clientY);

    const moveHandler = (e: MouseEvent) => {
      const newPoint = draw.point(e.clientX, e.clientY);
      group.x(x + newPoint.x - startPoint.x).y(y + newPoint.y - startPoint.y);
    };

    const upHandler = () => {
      draw.off("mousemove", moveHandler as EventListener);
      draw.off("mouseup", upHandler);
    };

    draw.on("mousemove", moveHandler as EventListener);
    draw.on("mouseup", upHandler);
  });
};
