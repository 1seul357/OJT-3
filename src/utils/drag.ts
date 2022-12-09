import { Container } from "@svgdotjs/svg.js";
import { removeSelector } from "./remove";

export const dragItem = (group: Container) => {
  group.draggable().on("dragmove", ((e: CustomEvent) => {
    e.preventDefault();
    removeSelector();
    if (document.querySelector(".group")) {
      const { handler, box } = e.detail;
      e.preventDefault();
      handler.move(box.x, box.y);
    }
  }) as EventListener);
};
