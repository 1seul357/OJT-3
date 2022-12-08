import { Container, Shape, Svg } from "@svgdotjs/svg.js";
import { removeSelector, removeShapeGroup } from "./remove";
import "../css/clickItem.css";

export const clickGroup = (
  group: Container,
  draw: Svg,
  select: Shape,
  setGroup: Function
) => {
  const g = draw.group().add(group).addClass("g");
  let controller: () => void;

  g.mousedown((e: MouseEvent) => {
    setGroup(true);
    removeSelector();
    select.attr({ fill: "#ffffff66" }).stroke({ color: "#00000099" });
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
  });

  const makeController = () => {
    const clone = draw
      .rect(Number(group.width()), Number(group.height()))
      .x(group.x())
      .y(group.y())
      .stroke("#66666699")
      .addClass("gclone")
      .fill("transparent")
      .addTo(g);
    clone.transform(group.transform());

    const x1 = Number(group.x());
    const x2 = x1 + Number(group.width());
    const y1 = Number(group.y());
    const y2 = y1 + Number(group.height());
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const pts = [
      [x1, y1],
      [x2, y1],
      [x1, y2],
      [x2, y2],
    ];
    group.transform().rotate ?? (0 * Math.PI) / 180;
    group.matrix().multiply(group.matrix().inverse());

    const rotate = group
      .circle(20)
      .cx(cx)
      .cy(cy - Number(clone.height()) / 1.2)
      .addClass("rotate")
      .attr({ fill: "#CCCCFF" })
      .transform(group.transform())
      .addTo(g);

    rotate.on("mousedown", (e) => {
      e.stopPropagation();
      rotate.hide();
      const moveHandler = (e: MouseEvent) => {
        e.preventDefault();
        circles.forEach((el) => el.remove());

        const pt = draw.point(e.clientX, e.clientY);
        const x = x1 + Number(group.width());
        const y = y1 + Number(group.height());
        const angle = Math.atan2(pt.x - x, -(pt.y - y)) * (180 / Math.PI);

        clone.transform(
          { rotate: angle - Number(clone.transform().rotate) },
          true
        );
      };

      const upHandler = () => {
        group.transform(clone.transform());
        rotate.show();
        rotate
          .cx(group.cx())
          .cy(group.cy() - Number(clone.height()) / 1.2)
          .transform(group.transform());
        draw.off("mousemove", moveHandler as EventListener);
        draw.off("mouseup", upHandler);
      };
      draw.on("mousemove", moveHandler as EventListener);
      draw.on("mouseup", upHandler);
    });

    const circles = pts.map((pt, i) => {
      const circle = g
        .circle(10)
        .cx(pt[0])
        .cy(pt[1])
        .addClass("circles")
        .transform(group.transform())
        .fill("#666666")
        .mousedown((e: MouseEvent) => {
          document.querySelector(".rotate")?.remove();
          e.stopPropagation();
          const moveHandler = (e: MouseEvent) => {
            const point = draw.point(e.clientX, e.clientY);
            const rotatedPoint = point.transform(group.matrix().inverse());
            const dx = rotatedPoint.x - pt[0];
            const dy = rotatedPoint.y - pt[1];

            if (i === 0) {
              clone
                .width(Number(group.width()) - dx)
                .height(Number(group.height()) - dy)
                .x(Number(group.x()) + dx)
                .y(Number(group.y()) + dy);
            }
            if (i === 1) {
              clone
                .width(Number(group.width()) + dx)
                .height(Number(group.height()) - dy)
                .x(group.x())
                .y(Number(group.y()) + dy);
            }
            if (i === 2) {
              clone
                .width(Number(group.width()) - dx)
                .height(Number(group.height()) + dy)
                .x(Number(group.x()) + dx)
                .y(group.y());
            }
            if (i === 3) {
              clone
                .width(Number(group.width()) + dx)
                .height(Number(group.height()) + dy)
                .x(group.x())
                .y(group.y());
            }
          };
          const upHandler = () => {
            group
              .width(clone.width())
              .height(clone.height())
              .x(clone.x())
              .y(clone.y());
            remove();
            draw.off("mousemove", moveHandler as EventListener);
            draw.off("mouseup", upHandler);
            controller = makeController();
          };
          draw.on("mousemove", moveHandler as EventListener);
          draw.on("mouseup", upHandler);
        });
      return circle;
    });
    const remove = () => {
      circles.forEach((el) => el.remove());
      clone.remove();
      rotate.remove();
    };
    return remove;
  };
  removeShapeGroup(group, setGroup);
  controller = makeController();
};
