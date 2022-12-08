import { Shape, Svg } from "@svgdotjs/svg.js";
import { removeSelector, removeShape, removeGroupSelector } from "./remove";
import "../css/clickItem.css";

export const clickItem = (
  item: Shape,
  draw: Svg,
  multipleSelection: Function,
  setShape: Function,
  setGroup: Function
) => {
  removeSelector();

  const g = draw.group();
  let controller: () => void;
  g.add(item).fill("transparent").addClass("g");

  g.mousedown((e: MouseEvent) => {
    setShape(item);
    // removeGroupSelector(draw);
    if (document.querySelector(".grouping")) {
      setGroup(null);
    }
    if (e.shiftKey) {
      multipleSelection(item);
      return;
    }
    removeSelector();
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
      controller = makeController(item);
    };
    draw.on("mousemove", moveHandler as EventListener);
    draw.on("mouseup", upHandler);
  });

  const makeController = (el: Shape) => {
    const clone = item
      .clone()
      .stroke("#66666699")
      .addClass("clone")
      .fill("transparent")
      .addTo(g);

    const x1 = Number(el.x());
    const x2 = x1 + Number(el.width());
    const y1 = Number(el.y());
    const y2 = y1 + Number(el.height());
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const pts =
      el.type === "polygon"
        ? [
            [cx, y1],
            [x1, y2],
            [x2, y2],
          ]
        : [
            [x1, y1],
            [x2, y1],
            [x1, y2],
            [x2, y2],
          ];

    el.transform().rotate ?? (0 * Math.PI) / 180;
    el.matrix().multiply(el.matrix().inverse());

    const rotate = g
      .circle(20 / Math.round(Number(el.transform().scaleX)))
      .cx(cx)
      .cy(cy - Number(el.height()) / 1.4)
      .addClass("rotate")
      .attr({ fill: "#CCCCFF" })
      .transform(el.transform());
    rotate.on("mousedown", (e) => {
      e.stopPropagation();
      rotate.hide();

      const moveHandler = (e: MouseEvent) => {
        e.preventDefault();
        circles.forEach((el) => el.remove());

        const pt = draw.point(e.clientX, e.clientY);
        const x = x1 + Number(el.width());
        const y = y1 + Number(el.height());
        const angle = Math.atan2(pt.x - x, -(pt.y - y)) * (180 / Math.PI);

        clone.transform(
          { rotate: angle - Number(clone.transform().rotate) },
          true
        );
      };

      const upHandler = () => {
        el.transform(clone.transform());
        rotate.show();
        rotate
          .cx(el.cx())
          .cy(el.cy() - Number(el.height()) / 1.4)
          .transform(el.transform());
        draw.off("mousemove", moveHandler as EventListener);
        draw.off("mouseup", upHandler);
      };
      draw.on("mousemove", moveHandler as EventListener);
      draw.on("mouseup", upHandler);
    });

    const circles = pts.map((pt, i) => {
      const circle = g
        .circle(10 / Math.round(Number(el.transform().scaleX)))
        .cx(pt[0])
        .cy(pt[1])
        .addClass("circles")
        .transform(el.transform())
        .fill("#666666")
        .mousedown((e: MouseEvent) => {
          document.querySelectorAll(".rotate").forEach((node) => node.remove());
          e.stopPropagation();
          const moveHandler = (e: MouseEvent) => {
            const point = draw.point(e.clientX, e.clientY);
            const rotatedPoint = point.transform(el.matrix().inverse());
            const dx = rotatedPoint.x - pt[0];
            const dy = rotatedPoint.y - pt[1];

            if (item.type === "polygon") {
              if (i === 0) {
                clone.height(Number(el.height()) - dy).y(Number(el.y()) + dy);
              } else if (i === 1) {
                clone
                  .x(Number(el.x()) + dx)
                  .width(Number(el.width()) - dx)
                  .height(Number(el.height()) + dy);
              } else {
                clone
                  .width(Number(el.width()) + dx)
                  .height(Number(el.height()) + dy);
                // .x(el.x())
                // .y(el.y());
              }
            } else {
              if (i === 0) {
                clone
                  .width(Number(el.width()) - dx)
                  .height(Number(el.height()) - dy)
                  .x(Number(el.x()) + dx)
                  .y(Number(el.y()) + dy);
              }
              if (i === 1) {
                clone
                  .width(Number(el.width()) + dx)
                  .height(Number(el.height()) - dy)
                  .x(el.x())
                  .y(Number(el.y()) + dy);
              }
              if (i === 2) {
                clone
                  .width(Number(el.width()) - dx)
                  .height(Number(el.height()) + dy)
                  .x(Number(el.x()) + dx)
                  .y(el.y());
              }
              if (i === 3) {
                clone
                  .width(Number(el.width()) + dx)
                  .height(Number(el.height()) + dy)
                  .x(el.x())
                  .y(el.y());
              }
            }
          };
          const upHandler = () => {
            el.size(clone.width(), clone.height()).x(clone.x()).y(clone.y());
            remove();
            draw.off("mousemove", moveHandler as EventListener);
            draw.off("mouseup", upHandler);
            controller = makeController(el);
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
  removeShape(g);
  controller = makeController(item);
};
