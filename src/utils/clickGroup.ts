import { Container, Shape, Svg } from "@svgdotjs/svg.js";
import { removeSelector } from "./removeSelector";
import "../css/clickItem.css";

export const clickGroup = (group: Container, draw: Svg, select: Shape) => {
  document.querySelector(".g")?.remove();
  const g = draw.group();
  g.add(group).fill("transparent").stroke("#66666699").addClass("g");

  let controller: () => void;

  g.mousedown((e: MouseEvent) => {
    select.attr({ fill: "#ffffff66" }).stroke({ color: "#00000099" });
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
      controller = makeController();
    };
    draw.on("mousemove", moveHandler as EventListener);
    draw.on("mouseup", upHandler);
  });

  const makeController = () => {
    document.querySelector(".gclone")?.remove();
    const clone = select
      .clone()
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
      .cy(cy - Number(select.height()) / 1.4)
      .addClass("rotate")
      .attr({ fill: "#CCCCFF" })
      .transform(group.transform())
      .addTo(g);

    rotate.on("mousedown", (e) => {
      e.stopPropagation();
      rotate.hide();
      const moveHandler = (e: MouseEvent) => {
        e.preventDefault();
        // circles.forEach((el) => el.remove());

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
          .cy(group.cy() - Number(select.height()) / 1.4)
          .transform(group.transform());
        draw.off("mousemove", moveHandler as EventListener);
        draw.off("mouseup", upHandler);
      };
      draw.on("mousemove", moveHandler as EventListener);
      draw.on("mouseup", upHandler);
    });
    const remove = () => {
      clone.remove();
      rotate.remove();
    };
    return remove;
  };
  controller = makeController();
};
