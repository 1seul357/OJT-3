import { Shape, Svg } from "@svgdotjs/svg.js";
import { removeSelector, removeShape, removeGroupSelector } from "./remove";
import { dragAndDrop } from "../components/DragAndDrop";
import "../css/clickItem.css";

export const clickItem = (
  item: Shape,
  draw: Svg,
  multipleSelection: Function,
  setShape: Function,
  setGroup: Function
) => {
  const g = draw.group().add(item).fill("transparent").addClass("g");
  let controller: () => void;
  removeSelector();

  g.mousedown((e: MouseEvent) => {
    setShape(item);
    removeGroupSelector(draw);
    if (document.querySelector(".grouping")) {
      setGroup(null);
    }
    if (e.shiftKey) {
      multipleSelection(item);
      return;
    }
    removeSelector();
    dragAndDrop(g, draw, e, controller, makeController);
  });

  const makeController = () => {
    const clone = item
      .clone()
      .stroke("#66666699")
      .addClass("clone")
      .fill("transparent")
      .addTo(g);

    const x1 = Number(item.x());
    const x2 = x1 + Number(item.width());
    const y1 = Number(item.y());
    const y2 = y1 + Number(item.height());
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const pts =
      item.type === "polygon"
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

    item.transform().rotate ?? (0 * Math.PI) / 180;
    item.matrix().multiply(item.matrix().inverse());

    const rotate = g
      .circle(20 / Math.round(Number(item.transform().scaleX)))
      .cx(cx)
      .cy(cy - Number(item.height()) / 1.4)
      .addClass("rotate")
      .attr({ fill: "#CCCCFF" })
      .transform(item.transform());
    rotate.on("mousedown", (e) => {
      e.stopPropagation();
      rotate.hide();

      const moveHandler = (e: MouseEvent) => {
        e.preventDefault();
        circles.forEach((el) => el.remove());

        const pt = draw.point(e.clientX, e.clientY);
        const x = x1 + Number(item.width());
        const y = y1 + Number(item.height());
        const angle = Math.atan2(pt.x - x, -(pt.y - y)) * (180 / Math.PI);

        clone.transform(
          { rotate: angle - Number(clone.transform().rotate) },
          true
        );
      };

      const upHandler = () => {
        item.transform(clone.transform());
        rotate.show();
        rotate
          .cx(item.cx())
          .cy(item.cy() - Number(item.height()) / 1.4)
          .transform(item.transform());
        draw.off("mousemove", moveHandler as EventListener);
        draw.off("mouseup", upHandler);
      };
      draw.on("mousemove", moveHandler as EventListener);
      draw.on("mouseup", upHandler);
    });

    const circles = pts.map((pt, i) => {
      const circle = g
        .circle(10 / Math.round(Number(item.transform().scaleX)))
        .cx(pt[0])
        .cy(pt[1])
        .addClass("circles")
        .transform(item.transform())
        .fill("#666666")
        .mousedown((e: MouseEvent) => {
          document.querySelectorAll(".rotate").forEach((node) => node.remove());
          e.stopPropagation();
          const moveHandler = (e: MouseEvent) => {
            const point = draw.point(e.clientX, e.clientY);
            const rotatedPoint = point.transform(item.matrix().inverse());
            const dx = rotatedPoint.x - pt[0];
            const dy = rotatedPoint.y - pt[1];

            if (item.type === "polygon") {
              if (i === 0) {
                clone
                  .height(Number(item.height()) - dy)
                  .y(Number(item.y()) + dy);
              } else if (i === 1) {
                clone
                  .x(Number(item.x()) + dx)
                  .width(Number(item.width()) - dx)
                  .height(Number(item.height()) + dy);
              } else {
                clone
                  .width(Number(item.width()) + dx)
                  .height(Number(item.height()) + dy);
                // .x(el.x())
                // .y(el.y());
              }
            } else {
              if (i === 0) {
                clone
                  .width(Number(item.width()) - dx)
                  .height(Number(item.height()) - dy)
                  .x(Number(item.x()) + dx)
                  .y(Number(item.y()) + dy);
              }
              if (i === 1) {
                clone
                  .width(Number(item.width()) + dx)
                  .height(Number(item.height()) - dy)
                  .x(item.x())
                  .y(Number(item.y()) + dy);
              }
              if (i === 2) {
                clone
                  .width(Number(item.width()) - dx)
                  .height(Number(item.height()) + dy)
                  .x(Number(item.x()) + dx)
                  .y(item.y());
              }
              if (i === 3) {
                clone
                  .width(Number(item.width()) + dx)
                  .height(Number(item.height()) + dy)
                  .x(item.x())
                  .y(item.y());
              }
            }
          };
          const upHandler = () => {
            item.size(clone.width(), clone.height()).x(clone.x()).y(clone.y());
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
  removeShape(g);
  controller = makeController();
};
