import { Container } from "@svgdotjs/svg.js";

export const removeShapeGroup = (group: Container, setGroup: Function) => {
  window.addEventListener("keyup", (e) => {
    if (e.key === "Delete") {
      setGroup(false);
      if (group.node.childElementCount >= 2) {
        while (group.node.childNodes.length >= 1) {
          group.node.childNodes.forEach((el: any) => el.remove());
          document.querySelector(".gclone")?.remove();
          document
            .querySelectorAll(".circles")
            .forEach((node) => node.remove());
          document.querySelector(".rotate")?.remove();
          group.removeClass("grouping");
          setGroup(false);
        }
      }
    }
  });
};

export const removeShape = (g: Container) => {
  window.addEventListener("keyup", (e) => {
    if (e.key === "Delete") {
      if (g.node.childElementCount >= 4) {
        g.remove();
      }
    }
  });
};
